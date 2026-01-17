# Guess Reconciliation - Backend Lazy Creation Migration

## Status
Pending


## 🎯 Objective

Migrate the guess domain from **backend eager creation** (pre-creates all guesses) to **backend lazy creation** (creates guesses only when user submits). This requires implementing **frontend reconciliation** to merge sparse guess data with complete match lists.

**Problem Statement:**
- **Current**: Backend pre-creates 10 guess records (all with null scores) when user joins tournament
- **New**: Backend creates guesses only when user submits → Frontend receives 0-10 guesses for 10 matches
- **Challenge**: Frontend must reconcile sparse guess array with match array to maintain 1:1 UI mapping

**Key Principles:**
1. **Cache Purity**: Query cache contains only real backend data (no virtual guesses)
2. **Reconciliation Hook**: Single custom hook merges matches + guesses for components
3. **Type Safety**: `id: string | null` to distinguish real vs placeholder guesses
4. **No Breaking Changes**: UI behavior remains identical from user perspective
5. **Performance**: Use `useMemo` to prevent unnecessary reconciliations

**Backend Changes (Confirmed):**
- ✅ No longer pre-creates guesses
- ✅ Returns empty array `[]` when user has no guesses yet
- ✅ `POST /guess` no longer requires `id` field (backend generates it)
- ✅ Backend calculates `hasLostTimewindowToGuess` based on match date

---

## 📅 Phase 1: Type System & Utilities

### Goal
Update TypeScript types and create core reconciliation utilities to handle nullable guess IDs and merge logic.

### Tasks

#### Task 1.1 - Update IGuess interface to allow null IDs []
**File**: `src/domains/guess/typing.ts`

**Changes**:
```typescript
export interface IGuess {
  id: string | null; // ✅ Allow null for placeholder guesses
  matchId: string;
  // ... rest unchanged
}
```

**Why**: Placeholder guesses won't have backend-generated IDs until first save.

---

#### Task 1.2 - Update CreateGuessInput to remove id field []
**File**: `src/domains/league/typing.ts`

**Changes**:
```typescript
// BEFORE
export type CreateGuessInput = {
  id: string;          // ❌ Remove
  matchId: string;
  tournamentId: string;
  home: { score: number };
  away: { score: number };
};

// AFTER
export type CreateGuessInput = {
  matchId: string;     // ✅ Backend uses this as identifier
  tournamentId: string;
  home: { score: number };
  away: { score: number };
};
```

**Why**: Backend no longer accepts `id` in request body (generates it server-side).

---

#### Task 1.3 - Create hasLostTimewindow utility function []
**File**: `src/domains/guess/utils.ts`

**Implementation**:
```typescript
/**
 * Calculates if user has lost the time window to guess based on match date
 * @param matchDate ISO datetime string (e.g., "2025-01-15T14:00:00Z")
 * @returns true if match has already started
 */
export const hasLostTimewindow = (matchDate: string): boolean => {
  const matchTime = new Date(matchDate).getTime();
  const now = Date.now();
  return now >= matchTime;
};
```

**Why**: Placeholder guesses need client-side time window calculation.

**Edge Cases**:
- Invalid date string → Should default to `false` (allow guessing)?
- Timezone handling → Ensure Date constructor handles ISO strings correctly

---

#### Task 1.4 - Create buildPlaceholderGuess utility function []
**File**: `src/domains/guess/utils.ts`

**Implementation**:
```typescript
import type { IGuess } from "./typing";
import type { IMatch } from "@domains/match/typing";
import { GUESS_STATUSES } from "./typing";

/**
 * Creates a placeholder guess for a match that has no guess yet
 * @param match The match to create a placeholder for
 * @returns A virtual IGuess with null id and calculated status
 */
export const buildPlaceholderGuess = (match: IMatch): IGuess => {
  const hasLostWindow = hasLostTimewindow(match.date);

  // Determine status based on match state
  let status = GUESS_STATUSES.NOT_STARTED;
  if (hasLostWindow && match.status === "open") {
    status = GUESS_STATUSES.EXPIRED;
  } else if (match.status === "ended") {
    status = GUESS_STATUSES.FINALIZED;
  }

  return {
    id: null, // ✅ No ID until backend creates it
    matchId: match.id,
    home: {
      status,
      value: null,
      points: null,
    },
    away: {
      status,
      value: null,
      points: null,
    },
    fullMatch: {
      status,
      points: null,
      label: "",
    },
    total: null,
    status,
    hasLostTimewindowToGuess: hasLostWindow,
  };
};
```

**Status Logic**:
| Match Status | Time Window Lost? | Guess Status |
|--------------|-------------------|--------------|
| `open` | No | `NOT_STARTED` |
| `open` | Yes | `EXPIRED` |
| `ended` | - | `FINALIZED` |

**Edge Cases**:
- What if match status is undefined/null?
- Should paused matches be handled specially?

---

#### Task 1.5 - Create reconcileMatchesWithGuesses utility function []
**File**: `src/domains/guess/utils.ts`

**Implementation**:
```typescript
/**
 * Reconciles matches with sparse guess data
 * Ensures every match has a corresponding guess (real or placeholder)
 *
 * @param matches Array of matches (N items)
 * @param guesses Array of real guesses from backend (0 to N items)
 * @returns Array of N guesses (real + virtual merged)
 *
 * @example
 * // 10 matches, 2 real guesses
 * reconcileMatchesWithGuesses(matches, guesses)
 * // Returns: 10 guesses (2 real, 8 placeholders)
 */
export const reconcileMatchesWithGuesses = (
  matches: IMatch[],
  guesses: IGuess[]
): IGuess[] => {
  return matches.map((match) => {
    const existingGuess = guesses.find((g) => g.matchId === match.id);
    return existingGuess ?? buildPlaceholderGuess(match);
  });
};
```

**Complexity**: O(N*M) where N = matches, M = guesses
- Acceptable for small datasets (typically < 20 matches per round)
- Could optimize with Map if performance becomes issue

**Edge Cases**:
- Empty matches array → Returns []
- Empty guesses array → Returns all placeholders
- Guess with matchId not in matches → Ignored (orphaned guess)

---

### Dependencies
- None (pure utility functions)

### Expected Result
- ✅ Type system supports nullable IDs
- ✅ CreateGuessInput no longer has id field
- ✅ Utility functions handle all reconciliation logic
- ✅ All edge cases documented and handled
- ✅ `yarn typecheck` passes

### Next Steps
- Write unit tests for utility functions
- Proceed to Phase 2 (Hook Implementation)

---

## 📅 Phase 2: State Management Hooks

### Goal
Create `useReconciledGuesses` hook and update mutation logic to handle create vs update scenarios.

### Tasks

#### Task 2.1 - Create useReconciledGuesses hook []
**File**: `src/domains/guess/hooks/use-reconciled-guesses.ts` (NEW)

**Implementation**:
```typescript
import { useMemo } from "react";
import { useGuess } from "./use-guess";
import { reconcileMatchesWithGuesses } from "../utils";
import type { IMatch } from "@domains/match/typing";

/**
 * Fetches guesses and reconciles with matches to ensure every match has a guess
 * (either real from backend or virtual placeholder)
 *
 * @param tournamentId Tournament identifier
 * @param round Round number/string (from URL params)
 * @param matches Array of matches to reconcile against
 * @returns Query result with reconciled data (N guesses for N matches)
 */
export const useReconciledGuesses = (
  tournamentId: string,
  round: string | undefined,
  matches: IMatch[]
) => {
  const guessesQuery = useGuess(tournamentId, round);

  // Reconcile real guesses with matches to fill gaps
  const reconciledGuesses = useMemo(() => {
    if (!guessesQuery.data || !matches.length) return [];
    return reconcileMatchesWithGuesses(matches, guessesQuery.data);
  }, [guessesQuery.data, matches]);

  return {
    ...guessesQuery,
    data: reconciledGuesses, // ✅ Always returns N guesses for N matches
  };
};
```

**Memoization Strategy**:
- Deps: `[guessesQuery.data, matches]`
- Only re-reconciles when guesses refetch or matches change
- Prevents unnecessary reconciliations on unrelated re-renders

**Edge Cases**:
- What if matches is undefined? → Returns []
- What if guessesQuery is loading? → Returns [] (acceptable, loading state handled by query)

---

#### Task 2.2 - Update useGuessMutation to handle create vs update []
**File**: `src/domains/guess/hooks/use-guess-mutation.ts`

**Changes**:

**2.2.1 - Fix onSuccess to use matchId instead of id**
```typescript
onSuccess: (newGuess) => {
  const previousGuesses = queryClient.getQueryData(queryKey) as IGuess[];

  // ✅ Use matchId to identify (not id, since id might be null for placeholders)
  const existingIndex = previousGuesses.findIndex(
    (g) => g.matchId === newGuess.matchId
  );

  let updatedGuesses: IGuess[];
  if (existingIndex >= 0) {
    // UPDATE: Replace existing guess
    updatedGuesses = [...previousGuesses];
    updatedGuesses[existingIndex] = newGuess;
  } else {
    // CREATE: Add new guess to cache
    updatedGuesses = [...previousGuesses, newGuess];
  }

  queryClient.setQueryData(queryKey, updatedGuesses);
}
```

**Why matchId instead of id?**
- Placeholder guesses have `id: null`
- Backend generates ID on first save
- `matchId` is the stable identifier

**2.2.2 - Fix onError to use correct query key**
```typescript
onError: (_, __, context) => {
  // ✅ FIX BUG: Use queryKey instead of ["todos"]
  const contextData = context as { previousGuesses: IGuess[] };
  queryClient.setQueryData(queryKey, contextData.previousGuesses);
}
```

**Bug Context**: Original code had copy-paste error from TODO app template.

---

#### Task 2.3 - Update useGuessInputs to not send id field []
**File**: `src/domains/guess/hooks/use-guess-inputs.ts`

**Changes**:
```typescript
const handleSave = () => {
  if (homeGuess === null || awayGuess === null) {
    throw new Error("Invalid guess");
  }

  return guessMutation.mutateAsync({
    // ✅ No id field sent to backend
    matchId: match.id,
    tournamentId,
    home: { score: homeGuess },
    away: { score: awayGuess },
  });
};
```

**Removed**: `id: guess?.id || ""`
**Why**: Backend generates ID, doesn't accept it in request

---

### Dependencies
- Phase 1 must be complete (utilities and types)

### Expected Result
- ✅ `useReconciledGuesses` merges matches + guesses correctly
- ✅ Mutation handles both create (no ID) and update (has ID) scenarios
- ✅ Cache updates use `matchId` as stable identifier
- ✅ Error handler bug is fixed
- ✅ `yarn typecheck` passes

### Next Steps
- Test hooks in isolation
- Proceed to Phase 3 (Component Integration)

---

## 📅 Phase 3: Component Integration

### Goal
Update components to use new `useReconciledGuesses` hook and verify UI behavior remains unchanged.

### Tasks

#### Task 3.1 - Update TournamentRoundOfGames component []
**File**: `src/domains/tournament/components/tournament-round-of-games/tournament-round-of-games.tsx`

**Changes**:
```typescript
// BEFORE
const guessesQuery = useGuess(tournamentId, search?.round);
const matchesQuery = useTournamentMatches(tournamentId, search?.round);

// Manual lookup (might return undefined)
matches.map(match => {
  const guess = guesses.find(g => g.matchId === match.id);
  return <MatchCard match={match} guess={guess} />; // guess could be undefined!
})

// AFTER
const matchesQuery = useTournamentMatches(tournamentId, search?.round);
const guessesQuery = useReconciledGuesses(
  tournamentId,
  search?.round,
  matchesQuery.data || []
);

// Direct indexed access (always defined)
matchesQuery.data?.map((match, index) => {
  const guess = guessesQuery.data[index]; // ✅ Always defined!
  return <MatchCard match={match} guess={guess} />;
});
```

**Import Changes**:
```typescript
// Add import
import { useReconciledGuesses } from "@domains/guess/hooks/use-reconciled-guesses";

// Remove if exists
import { useGuess } from "@domains/guess/hooks/use-guess";
```

**Edge Cases**:
- What if matchesQuery is loading? → guessesQuery.data will be []
- What if matchesQuery errors? → Existing error handling should work
- Index mismatch? → Shouldn't happen if reconciliation works correctly

---

#### Task 3.2 - Verify MatchCard handles null IDs correctly []
**File**: `src/domains/match/components/match-card/match-card.tsx`

**Review**:
- Check if MatchCard ever uses `guess.id` directly
- Ensure ScoreInput components don't depend on `guess.id`
- Verify GuessDisplay handles null IDs gracefully

**Expected**: No changes needed (MatchCard shouldn't care about ID)

**Verification Checklist**:
- [ ] MatchCard doesn't read `guess.id`
- [ ] useGuessInputs uses `match.id` not `guess.id`
- [ ] No components break with null IDs

---

#### Task 3.3 - Update GuessSection if it uses guess IDs []
**File**: `src/domains/tournament/components/tournament-performance-stats/guess-section.tsx`

**Review**:
- Check if GuessSection renders guess IDs
- Verify it doesn't use ID as React key
- Use `matchId` or index as key if needed

**Expected**: Minimal changes (possibly key update)

---

### Dependencies
- Phase 2 must be complete (hooks implemented)

### Expected Result
- ✅ TournamentRoundOfGames uses `useReconciledGuesses`
- ✅ All match cards render with guesses (real or placeholder)
- ✅ No components break with null IDs
- ✅ UI behavior identical to before (from user perspective)
- ✅ `yarn typecheck` passes

### Next Steps
- Manual testing of user flows
- Proceed to Phase 4 (Testing & Validation)

---

## 📅 Phase 4: Testing & Validation

### Goal
Verify the reconciliation logic works correctly through automated tests and manual testing.

### Tasks

#### Task 4.1 - Write unit tests for utility functions []
**File**: `src/domains/guess/utils.test.ts` (NEW)

**Test Cases**:
1. `hasLostTimewindow`
   - [ ] Returns false for future dates
   - [ ] Returns true for past dates
   - [ ] Returns true for current time
   - [ ] Handles invalid date strings

2. `buildPlaceholderGuess`
   - [ ] Creates guess with null ID
   - [ ] Sets status to NOT_STARTED for open future match
   - [ ] Sets status to EXPIRED for open past match
   - [ ] Sets status to FINALIZED for ended match
   - [ ] Copies matchId correctly

3. `reconcileMatchesWithGuesses`
   - [ ] Returns empty array for empty matches
   - [ ] Returns all placeholders when guesses is empty
   - [ ] Merges 10 matches + 0 guesses → 10 placeholders
   - [ ] Merges 10 matches + 3 guesses → 3 real + 7 placeholders
   - [ ] Merges 10 matches + 10 guesses → 10 real
   - [ ] Preserves real guess data exactly
   - [ ] Maintains match order

---

#### Task 4.2 - Write integration tests for hooks []
**File**: `src/domains/guess/hooks/use-reconciled-guesses.test.ts` (NEW)

**Test Cases**:
1. `useReconciledGuesses`
   - [ ] Returns empty array when matches is empty
   - [ ] Returns placeholders when backend returns []
   - [ ] Returns mixed array when backend returns partial guesses
   - [ ] Memoizes result correctly (doesn't re-reconcile unnecessarily)
   - [ ] Updates when guesses refetch
   - [ ] Updates when matches change

---

#### Task 4.3 - Manual testing user flows []

**Test Scenarios**:

**Scenario A: First-time user**
1. [ ] User joins tournament (backend returns [])
2. [ ] Navigate to round → See 10 matches with "Open" status
3. [ ] Verify all cards are editable (can expand, see inputs)
4. [ ] Save first guess → Card shows "Good Luck" animation
5. [ ] Refresh page → See 1 real guess + 9 placeholders
6. [ ] Verify saved guess shows values, placeholders are empty

**Scenario B: Partial guesses**
1. [ ] User has 5 guesses saved (backend returns 5 items)
2. [ ] Navigate to round → See 10 matches
3. [ ] Verify 5 show saved predictions
4. [ ] Verify 5 show empty inputs
5. [ ] Edit existing guess → Update works
6. [ ] Save new guess on empty card → Create works

**Scenario C: Time window expiration**
1. [ ] User has no guess for match starting in 1 minute
2. [ ] Card shows "Open" status with timebox "1 minute"
3. [ ] Wait for match to start
4. [ ] Refresh page
5. [ ] Verify card shows "Expired" status (red pill)
6. [ ] Verify inputs are disabled

**Scenario D: Match completion**
1. [ ] User has guess for match that ends
2. [ ] Backend updates guess with points + outcome
3. [ ] Refresh page
4. [ ] Verify card shows points + outcome pills
5. [ ] Verify inputs are disabled

---

#### Task 4.4 - Run type checking and linting []

**Checklist**:
- [ ] `yarn typecheck` passes with no errors
- [ ] `yarn lint` passes
- [ ] `yarn format` passes
- [ ] No console errors in browser
- [ ] No React warnings in dev mode

---

### Dependencies
- Phase 3 must be complete (components updated)

### Expected Result
- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ All manual test scenarios work correctly
- ✅ No type errors
- ✅ No linting errors
- ✅ User experience unchanged from before

### Next Steps
- Proceed to Phase 5 (Documentation)

---

## 📅 Phase 5: Documentation & Cleanup

### Goal
Update documentation to reflect new architecture and clean up unused code.

### Tasks

#### Task 5.1 - Update guess domain documentation []
**File**: `docs/domains/guess-domain.md`

**Sections to Update**:
1. **Overview** - Mention reconciliation pattern
2. **Data Model** - Update IGuess to show `id: string | null`
3. **State Management** - Document useReconciledGuesses hook
4. **API Integration** - Remove id from CreateGuessInput
5. **Known Issues** - Remove bug about error handler (now fixed)
6. **Architecture Patterns** - Add "Reconciliation Hook Pattern"
7. **Data Flow Diagram** - Update to show reconciliation step

**New Section**: Add "Reconciliation Architecture" explaining:
- Why reconciliation is needed
- How useReconciledGuesses works
- Placeholder guess lifecycle
- Cache purity principle

---

#### Task 5.2 - Create ADR for reconciliation pattern []
**File**: `docs/adr/XXXX-guess-reconciliation-pattern.md` (NEW)

**Content**:
- **Context**: Backend changed from eager to lazy creation
- **Decision**: Use reconciliation hook with pure cache
- **Alternatives Considered**:
  - Option A: Store placeholders in cache
  - Option B: Make guess optional in components
  - Option C: Hybrid approach (chosen)
- **Consequences**: Benefits and trade-offs
- **Related**: Link to guess domain docs

---

#### Task 5.3 - Update CHANGELOG []
**File**: `CHANGELOG.md` (if exists)

**Entry**:
```markdown
## [Version] - 2026-01-XX

### Changed
- **Guess Domain**: Migrated to backend lazy creation with frontend reconciliation
  - Backend no longer pre-creates guesses
  - Frontend reconciles sparse guess data with match lists
  - Added `useReconciledGuesses` hook for seamless integration
  - Fixed bug in mutation error handler (wrong query key)

### Technical
- Updated `IGuess` interface to allow null IDs
- Removed `id` field from `CreateGuessInput`
- Added reconciliation utilities in `src/domains/guess/utils.ts`
- Cache now only contains real backend guesses (placeholders generated on-demand)
```

---

#### Task 5.4 - Clean up unused code []

**Checklist**:
- [ ] Review `src/domains/guess/utils.ts` for commented code
- [ ] Remove `buildGuessInputs()` if still unused
- [ ] Remove commented `parseGuess()` function
- [ ] Check for any other dead code in guess domain

---

#### Task 5.5 - Add JSDoc comments to public APIs []

**Files to Document**:
- [ ] `reconcileMatchesWithGuesses()` - Already has JSDoc, verify quality
- [ ] `buildPlaceholderGuess()` - Already has JSDoc, verify quality
- [ ] `hasLostTimewindow()` - Already has JSDoc, verify quality
- [ ] `useReconciledGuesses()` - Already has JSDoc, verify quality

**Standard**:
```typescript
/**
 * Brief description
 *
 * @param paramName - Description
 * @returns Description
 *
 * @example
 * // Code example
 */
```

---

### Dependencies
- Phase 4 must be complete (testing validated)

### Expected Result
- ✅ Documentation reflects new architecture
- ✅ ADR documents decision rationale
- ✅ CHANGELOG updated
- ✅ Unused code removed
- ✅ All public APIs have JSDoc comments

### Next Steps
- Code review
- Merge to main branch
- Monitor production for issues

---

## 🔍 Risk Assessment

### High Risk
❌ **Cache update logic** - If mutation onSuccess logic is wrong, cache becomes inconsistent
- **Mitigation**: Comprehensive unit tests, manual testing of create/update scenarios

### Medium Risk
⚠️ **Time window calculation** - If client-side calculation differs from backend, UX issues
- **Mitigation**: Test with real match times, verify expired state matches backend

⚠️ **Performance** - Reconciliation runs on every render if not memoized correctly
- **Mitigation**: Verify useMemo dependencies, test with many matches

### Low Risk
✅ **Type safety** - Nullable IDs might cause issues if components expect string
- **Mitigation**: TypeScript will catch at compile time, manual review

---

## 📋 Definition of Done

### Phase 1
- [ ] All type changes compile without errors
- [ ] All utility functions implemented with JSDoc
- [ ] Unit tests written for utilities
- [ ] `yarn typecheck` passes

### Phase 2
- [ ] `useReconciledGuesses` hook implemented
- [ ] `useGuessMutation` updated for create/update
- [ ] `useGuessInputs` no longer sends id
- [ ] Integration tests written for hooks
- [ ] `yarn typecheck` passes

### Phase 3
- [ ] `TournamentRoundOfGames` uses new hook
- [ ] All components handle null IDs
- [ ] No UI regressions
- [ ] `yarn check` passes

### Phase 4
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All manual test scenarios pass
- [ ] No type/lint errors

### Phase 5
- [ ] Documentation updated
- [ ] ADR created
- [ ] CHANGELOG updated
- [ ] Unused code removed

### Overall
- [ ] User experience unchanged (feature parity)
- [ ] Backend integration works correctly (creates/updates guesses)
- [ ] Cache stays consistent (no stale data)
- [ ] Performance acceptable (no unnecessary re-renders)
- [ ] Code quality high (types, tests, docs)

---

## 📞 Stakeholder Communication

### Before Starting
- [ ] Review plan with team
- [ ] Confirm backend API changes are deployed
- [ ] Verify testing strategy

### After Each Phase
- [ ] Demo completed phase to stakeholders
- [ ] Get approval before proceeding
- [ ] Document any feedback/changes

### After Completion
- [ ] Demo full feature to product team
- [ ] Deploy to staging for QA
- [ ] Monitor production metrics

---

## 🚀 Deployment Strategy

### Pre-Deployment
1. Verify backend API changes are live
2. Run full test suite
3. Deploy to staging environment
4. QA testing on staging

### Deployment
1. Deploy frontend changes
2. Monitor error logs for 24 hours
3. Check analytics for user flow completion rates

### Rollback Plan
If issues found:
1. Revert frontend to previous version
2. Backend keeps new API (backward compatible)
3. Investigate and fix issues
4. Re-deploy after testing

---

## 📚 References

- **Guess Domain Documentation**: `docs/domains/guess-domain.md`
- **TanStack Query Docs**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **React Memoization**: [https://react.dev/reference/react/useMemo](https://react.dev/reference/react/useMemo)

---

**Plan Created**: 2026-01-02
**Plan Owner**: Development Team
**Estimated Effort**: 3-5 days
**Priority**: High (Backend change requires frontend update)
