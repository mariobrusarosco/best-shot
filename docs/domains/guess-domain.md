# Guess Domain - Expert Reference

**Domain**: Guesses
**Location**: `src/domains/guess/`
**Last Updated**: 2026-01-02
**Status**: Active

---

## Table of Contents

1. [Overview](#overview)
2. [Domain Structure](#domain-structure)
3. [Core Concepts](#core-concepts)
4. [Data Model](#data-model)
5. [Business Rules](#business-rules)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [UI Integration](#ui-integration)
9. [User Flows](#user-flows)
10. [Known Issues](#known-issues)
11. [Key Files Reference](#key-files-reference)

---

## Overview

### What Are Guesses?

**Guesses** are sports match outcome predictions made by tournament participants. Users predict the final scores (home team vs away team) before matches begin, then earn points based on prediction accuracy when matches complete.

### Purpose

The guess domain manages the complete lifecycle of match predictions:
- Capturing user predictions before match deadlines
- Tracking prediction state through match lifecycle
- Calculating and displaying points earned
- Providing real-time feedback on prediction accuracy

### Domain Boundaries

**Owns**:
- Guess data model and lifecycle
- Prediction validation logic
- Guess state management (queries/mutations)
- Server-side API integration for guesses

**Depends On**:
- **Match Domain**: For match data (date, teams, actual scores)
- **Tournament Domain**: For tournament context and round filtering
- **League Domain**: For `CreateGuessInput` type definition

**Used By**:
- **Match Domain**: Displays guesses in `MatchCard` components
- **Tournament Domain**: Aggregates guess statistics and performance metrics

---

## Domain Structure

```
src/domains/guess/
├── hooks/
│   ├── use-guess.ts              # TanStack Query wrapper for fetching guesses
│   ├── use-guess-mutation.ts     # TanStack Mutation for creating/updating guesses
│   └── use-guess-inputs.ts       # Local form state management for guess inputs
├── server-side/
│   ├── fetchers.ts               # API fetch functions (GET guesses)
│   └── mutations.ts              # API mutation functions (POST guesses)
├── typing.ts                     # Core TypeScript interfaces and enums
└── utils.ts                      # Utility functions (mostly commented/unused)
```

**Note**: No `index.ts` barrel export exists - consumers import directly from specific files.

---

## Core Concepts

### The Guess Lifecycle

```
User Creates Prediction
  ↓
NOT_STARTED (can edit)
  ↓
Match Approaches Deadline
  ↓
WAITING_FOR_GAME (may still edit if within time window)
  ↓
Match Starts (hasLostTimewindowToGuess = true)
  ↓
Match Completes
  ↓
FINALIZED → CORRECT or INCORRECT
```

### Key Terminology

| Term | Definition |
|------|------------|
| **Guess** | A single prediction for one match (home score + away score) |
| **Time Window** | The period before match start when predictions can be submitted |
| **Timebox** | Display string showing time remaining (e.g., "2 hours") |
| **Full Match Points** | Points earned for predicting overall outcome (win/draw/loss) |
| **Total Points** | Sum of home points + away points + full match points |
| **Match Outcome Label** | Snake_case string representing result (e.g., "home_win", "draw") |

### Scoring System

Points are awarded in three categories:

1. **Home Score Points**: Earned if home team prediction is exact
2. **Away Score Points**: Earned if away team prediction is exact
3. **Full Match Points**: Earned if overall outcome is correct (win/draw/loss)

**Example**:
```
Actual: Home 2 - 1 Away (home wins)
User Prediction: Home 2 - 0 Away (home wins)

Result:
- home.points = 3 (exact match)
- away.points = 0 (incorrect)
- fullMatch.points = 1 (correct outcome)
- total = 4 points
```

---

## Data Model

### `IGuess` Interface

**Location**: `src/domains/guess/typing.ts:3`

```typescript
export interface IGuess {
  id: string;                      // Unique guess identifier
  matchId: string;                 // Associated match ID

  home: {
    status: GUESS_STATUS;          // Status for home score prediction
    value: number | null;          // User's predicted home score
    points: number | null;         // Points earned for home prediction
  };

  away: {
    status: GUESS_STATUS;          // Status for away score prediction
    value: number | null;          // User's predicted away score
    points: number | null;         // Points earned for away prediction
  };

  fullMatch: {
    status: GUESS_STATUS;          // Status for overall match outcome
    points: number | null;         // Points earned for match outcome
    label: string;                 // Match outcome (e.g., "home_win", "draw")
  };

  total: number | null;            // Total points earned (sum of all)
  status: GUESS_STATUS;            // Overall guess status
  hasLostTimewindowToGuess: boolean; // True if deadline has passed
}
```

### `GUESS_STATUS` Enum

**Location**: `src/domains/guess/typing.ts:21`

```typescript
export const GUESS_STATUSES = {
  EXPIRED: "expired",                    // User missed the deadline
  CORRECT: "correct",                    // Prediction was accurate
  INCORRECT: "incorrect",                // Prediction was wrong
  NOT_STARTED: "not-started",            // Match open for guessing
  WAITING_FOR_GAME: "waiting_for_game",  // Match starting/in progress
  FINALIZED: "finalized",                // Match complete, points calculated
  PAUSED: "paused",                      // Match postponed
} as const;

export type GUESS_STATUS = (typeof GUESS_STATUSES)[keyof typeof GUESS_STATUSES];
```

### Status Descriptions

| Status | User Can Edit? | Meaning | Visual Indicator |
|--------|----------------|---------|------------------|
| `not-started` | ✅ Yes | Match is open for predictions | Border pill (neutral) |
| `waiting_for_game` | ⚠️ Conditional | Match starting soon or in progress | Teal pill "Good Luck" |
| `waiting_for_game` (timeout) | ❌ No | Match started, can't edit anymore | Teal pill with clock icon |
| `expired` | ❌ No | User missed the guessing deadline | Red pill |
| `paused` | ❌ No | Match has been postponed | Pink pill |
| `finalized` | ❌ No | Match complete, points awarded | Shows outcome/points instead |
| `correct` | ❌ No | Prediction was accurate (subset of finalized) | Green outcome pill |
| `incorrect` | ❌ No | Prediction was wrong (subset of finalized) | Red outcome pill |

**Note**: `waiting_for_game` allows editing only when `hasLostTimewindowToGuess === false`

### `CreateGuessInput` Type

**Location**: `src/domains/league/typing.ts`

```typescript
export type CreateGuessInput = {
  id: string;                      // Guess ID (for upsert)
  matchId: string;                 // Which match this guess is for
  tournamentId: string;            // Tournament context
  home: {
    score: number;                 // Predicted home team score
  };
  away: {
    score: number;                 // Predicted away team score
  };
};
```

**Usage**: Used by `createGuess` mutation for both creating new guesses and updating existing ones (upsert pattern).

---

## Business Rules

### Submission Rules

**Location**: `src/domains/guess/hooks/use-guess-inputs.ts:67`

```typescript
const handleSave = () => {
  // Rule 1: Both home and away guesses must be provided
  if (homeGuess === null || awayGuess === null) {
    throw new Error("Invalid guess");
  }

  // Rule 2: Mutation cannot be pending (prevents double submission)
  // Rule 3: Status must allow new guesses

  return guessMutation.mutateAsync({
    id: guess?.id || "",
    matchId: match.id,
    tournamentId,
    home: { score: homeGuess },
    away: { score: awayGuess },
  });
};
```

**Validation Requirements**:

1. ✅ Both home AND away scores must be provided (non-null)
2. ✅ Scores must be non-negative integers
3. ✅ Scores must be valid numbers
4. ✅ Cannot submit while mutation is pending
5. ✅ Can only submit when:
   - Guess status is `NOT_STARTED` or `WAITING_FOR_GAME`, AND
   - `hasLostTimewindowToGuess === false`

### Time Window Logic

**Key Field**: `hasLostTimewindowToGuess: boolean`

- **Purpose**: Prevents late submissions even when match is still in progress
- **Calculated By**: Backend based on `match.date` and configured time buffer
- **Effect**: When `true`, user cannot edit/submit guesses regardless of status

**Timebox Display**:
```typescript
const timebox = defineMatchTimebox(match.date);  // e.g., "2 hours"
const showTimeBox = SHOW_TIMEBOX_WHEN_GUESS_STATUS.has(guess.status);
```

Shows countdown only for statuses: `NOT_STARTED`, `WAITING_FOR_GAME`

### Points Calculation

**Responsibility**: Backend (not calculated in frontend)

**Formula**:
```
total = home.points + away.points + fullMatch.points
```

**Point Values** (configured on backend):
- Exact score match: Higher points (typically 2-3)
- Correct outcome only: Lower points (typically 1)
- Incorrect: 0 points

---

## State Management

### Query Management

**Hook**: `useGuess()`
**Location**: `src/domains/guess/hooks/use-guess.ts`

```typescript
const guessKey = (tournamentId: string, round: string | undefined) => [
  "guess",
  { tournamentId, round }
];

const guesses = useQuery({
  queryKey: guessKey(tournamentId, round),
  queryFn: getMemberGuesses,
  enabled: !!tournamentId,
});
```

**Query Key Pattern**: `["guess", { tournamentId, round }]`

### Mutation Management

**Hook**: `useGuessMutation()`
**Location**: `src/domains/guess/hooks/use-guess-mutation.ts:13`

**Strategy**: Two-phase cache update for optimal UX

```typescript
const mutation = useMutation({
  mutationFn: createGuess,

  // Phase 1: Optimistic Update (immediate UI feedback)
  onSuccess: (newGuess) => {
    const previousGuesses = queryClient.getQueryData(queryKey) as IGuess[];
    const updatedGuesses = previousGuesses.map((guess) =>
      guess.id === newGuess.id ? newGuess : guess
    );
    queryClient.setQueryData(queryKey, updatedGuesses);
  },

  // Phase 2: Invalidation (eventual consistency)
  onSettled: () => {
    queryClient.invalidateQueries({
      queryKey: ["guess", { tournamentId, round: search?.round }],
    });
  },
});
```

**Benefits**:
- ✅ Instant UI feedback (optimistic update)
- ✅ Eventual consistency (invalidation refetch)
- ✅ Specific guess replacement (not entire array rebuild)

### Local Form State

**Hook**: `useGuessInputs()`
**Location**: `src/domains/guess/hooks/use-guess-inputs.ts`

**Purpose**: Manages transient form state separate from persisted server state

```typescript
const [homeGuess, setHomeGuess] = useState<null | number>(guess.home.value ?? null);
const [awayGuess, setAwayGuess] = useState<null | number>(guess.away.value ?? null);
```

**Pattern**:
- **Transient State**: What user is currently typing (local useState)
- **Persisted State**: What's saved on backend (TanStack Query cache)
- **Sync Point**: `handleSave()` commits transient → persisted

**Returned Interface**:
```typescript
{
  handleHomeGuess: (value: number) => void,
  handleAwayGuess: (value: number) => void,
  handleSave: () => Promise<IGuess>,
  homeGuess: number | null,
  awayGuess: number | null,
  allowNewGuess: boolean,
  isPending: boolean
}
```

---

## API Integration

### Fetcher: Get Member Guesses

**Location**: `src/domains/guess/server-side/fetchers.ts`

```typescript
export const getMemberGuesses = async ({ queryKey }: { queryKey: unknown }) => {
  const [_key, { tournamentId, round }] = queryKey as [
    string,
    { tournamentId: string; round?: number }
  ];

  const response = await api.get(`/tournaments/${tournamentId}/guess`, {
    params: { round },
  });

  return response.data as IGuess[];
};
```

**Endpoint**: `GET /tournaments/{tournamentId}/guess`
**Query Params**: `round` (optional)
**Returns**: `IGuess[]`

### Mutation: Create/Update Guess

**Location**: `src/domains/guess/server-side/mutations.ts:4`

```typescript
export const createGuess = async (guessInput: CreateGuessInput) => {
  const response = await api.post("guess", guessInput);
  return response.data as IGuess;
};
```

**Endpoint**: `POST /guess`
**Body**: `CreateGuessInput`
**Returns**: `IGuess`

**Pattern**: Upsert - same endpoint for both creating new guesses and updating existing ones

---

## UI Integration

### Match Domain Integration

**Primary Component**: `MatchCard`
**Location**: `src/domains/match/components/match-card/match-card.tsx:23`

**Sub-Components**:

| Component | File | Purpose |
|-----------|------|---------|
| `GuessDisplay` | `guess-display.tsx` | Shows user's prediction in collapsed view |
| `GuessStatus` | `guess-status.tsx` | Status pill (open/good luck/waiting/expired/paused) |
| `GuessPoints` | `guess-points.tsx` | Black pill showing points earned (finalized only) |
| `GuessMatchOutcome` | `guess-match-outcome.tsx` | Green/red pill for correct/incorrect (finalized only) |
| `ScoreDisplay` | `score-display.tsx` | Blue pills showing actual match scores |
| `ScoreInput` | `score-input.tsx` | Editable number inputs with +/- buttons |
| `TeamDisplay` | `team-display.tsx` | Team name, logo, standings position |
| `CardAnimation` | `animations.tsx` | "Good Luck!" animation on successful save |

**Component Orchestration**:
```typescript
// In MatchCard component
const guessInputs = useGuessInputs(guess, match, guessMutation);

// guessInputs provides:
// - handleHomeGuess, handleAwayGuess (input handlers)
// - handleSave (submit handler)
// - homeGuess, awayGuess (current values)
// - allowNewGuess (can submit?)
// - isPending (loading state)
```

### Tournament Domain Integration

**Components Using Guesses**:

| Component | File | Purpose |
|-----------|------|---------|
| `TournamentRoundOfGames` | `tournament-round-of-games.tsx:37` | Fetches guesses + matches, renders MatchCards |
| `GuessSection` | `guess-section.tsx` | Collapsible list of all guesses with status/points |
| `TournamentDetailedPerformanceStats` | `tournament-detailed-performance-stats.tsx` | Animated counters showing guess breakdown by status |

**Data Flow**:
```
TournamentRoundOfGames
  ├─ useQuery: guesses (getMemberGuesses)
  ├─ useQuery: matches (getTournamentMatches)
  └─ Combines data by matchId
      └─ For each match → MatchCard(match, guess, mutation)
```

---

## User Flows

### Flow 1: Viewing Guesses

```
1. User navigates to tournament page: /_auth/tournaments/{id}?round=1
2. TournamentRoundOfGames component mounts
3. useGuess() fetches all guesses for tournament/round
4. useTournamentMatches() fetches all matches for round
5. Data combined by matchId → MatchCard rendered for each
6. Cards display:
   - Match date & timebox ("2 hours")
   - Team info (name, logo, standings position)
   - Actual score (if match started)
   - User's prediction (if submitted)
   - Status indicator (open/good luck/waiting/expired/postponed)
```

### Flow 2: Creating/Editing a Guess

```
1. EXPAND CARD
   User clicks "+" button
   → setIsOpen(true)
   → Card expands
   → ScoreInput components become visible
   → Local state initialized from guess.home.value, guess.away.value

2. MODIFY PREDICTIONS
   User adjusts home/away score inputs (using +/- or direct input)
   → handleHomeGuess(value) / handleAwayGuess(value)
   → Updates local state: homeGuess, awayGuess
   → No network request yet (transient state only)

3. SAVE PREDICTION
   User clicks "Save" button
   → guessInputs.handleSave() called

   Validation:
   → if (homeGuess === null || awayGuess === null) throw Error

   Mutation:
   → guessMutation.mutateAsync({ id, matchId, tournamentId, home: {score}, away: {score} })
   → POST /guess
   → onSuccess: optimistic cache update (replace specific guess in array)
   → CardAnimation plays: "Good Luck!" splash screen
   → Card closes automatically
   → onSettled: invalidate query, refetch for consistency

4. FEEDBACK
   Success:
   → Animation plays
   → Card closes
   → Status updates to "waiting_for_game" or remains "not-started"

   Error:
   → Card stays open
   → User can retry
   → Error message may display (handled by mutation context)
```

### Flow 3: Viewing Results After Match Completion

```
1. Match completes (status → "ended")
2. Backend calculates points, updates guess
3. Guess status changes to FINALIZED (and CORRECT or INCORRECT)
4. Query refetches on next page visit or cache invalidation
5. UI updates to show:
   - GuessMatchOutcome: Green pill (correct) or red pill (incorrect)
   - GuessPoints: Black pill showing total points (e.g., "points 3")
   - Actual scores displayed in blue pills
   - User's prediction displayed alongside
   - No edit controls visible (status is finalized)
```

### Flow 4: Viewing Performance Statistics

```
1. User views tournament page
2. TournamentDetailedPerformanceStats component renders
3. useTournamentDetailedPerformance() query fetches breakdown:
   - correct: 5
   - incorrect: 3
   - waiting_for_game: 2
   - not-started: 4
4. Animated counters count up to values
5. User can click "see more" to expand GuessSection
6. GuessSection renders collapsible list of all guesses with:
   - Match info
   - User's prediction
   - Status
   - Points earned (if finalized)
```

---

## Known Issues

### 🐛 Critical Bug: Error Handler Uses Wrong Query Key

**Location**: `src/domains/guess/hooks/use-guess-mutation.ts:32`

**Problem**:
```typescript
onError: (_, __, context) => {
  const contextData = context as { previousGuesses: IGuess[] };
  queryClient.setQueryData(["todos"], contextData.previousGuesses);  // ❌ WRONG KEY!
},
```

**Impact**: When a mutation fails, the rollback attempts to restore previous state to the wrong cache key (`["todos"]` instead of `["guess", {...}]`). This means the UI doesn't properly rollback on error.

**Fix**:
```typescript
onError: (_, __, context) => {
  const contextData = context as { previousGuesses: IGuess[] };
  queryClient.setQueryData(queryKey, contextData.previousGuesses);  // ✅ CORRECT
},
```

**Severity**: High - Affects error recovery UX
**Origin**: Copy-paste from TODO app template

---

### ⚠️ Type Inconsistency: Round Parameter

**Problem**: Round is treated as `string` (from URL params) in some places and `number` in others:

```typescript
// In use-guess.ts
const search = route.useSearch() as { round: string };  // String from URL

// In use-guess-mutation.ts
queryKey: ["guess", { tournamentId, round: search?.round }]  // Passed as-is

// In query key type hint
{ tournamentId: string; round?: number }  // Expected as number
```

**Impact**: Potential cache key mismatches if type coercion doesn't work consistently

**Fix**: Standardize on one type (likely `string` since it comes from URL params)

---

### 🧹 Unused Code in utils.ts

**Location**: `src/domains/guess/utils.ts:8`

**Problem**:
- `buildGuessInputs()` function is defined but never imported/used
- `parseGuess()` function is commented out
- Suggests incomplete refactoring or abandoned code

**Recommendation**: Remove unused code or document intended usage

---

### 📋 Demo Fetcher Duplication

**Problem**: `getMemberGuesses` exists in two locations:
1. `src/domains/guess/server-side/fetchers.ts`
2. `src/domains/demo/fetchers.ts`

**Differences**:
```typescript
// Demo version has fallback
params: { round: round ?? 1 }

// Guess version doesn't
params: { round }
```

**Impact**: Inconsistent behavior between demo and real modes

**Recommendation**: Consolidate or clearly document the difference

---

### 📚 Missing Validation Schema

**Problem**: Unlike tournament domain (uses Zod schemas), guess domain only has runtime null checks:

```typescript
// Current validation
if (homeGuess === null || awayGuess === null) {
  throw new Error("Invalid guess");
}
```

**Recommendation**: Add Zod schema for better validation:
```typescript
const CreateGuessSchema = z.object({
  id: z.string().uuid(),
  matchId: z.string().uuid(),
  tournamentId: z.string().uuid(),
  home: z.object({ score: z.number().int().nonnegative() }),
  away: z.object({ score: z.number().int().nonnegative() }),
});
```

**Benefit**: Runtime type safety, better error messages, consistent with other domains

---

### 🎨 Theme.unstable_sx Usage

**Problem**: Several styled components in match domain use `theme.unstable_sx()` which is an internal API

**Recommendation**: Refactor to standard `styled()` syntax per CLAUDE.md guidelines

---

## Key Files Reference

### Core Domain Files

| File | Lines | Key Exports | Purpose |
|------|-------|-------------|---------|
| `typing.ts` | 3 | `IGuess` | Core data model |
| `typing.ts` | 21 | `GUESS_STATUS`, `GUESS_STATUSES` | Status enum and type |
| `hooks/use-guess.ts` | - | `useGuess()` | TanStack Query wrapper for fetching |
| `hooks/use-guess-mutation.ts` | 13 | `useGuessMutation()` | TanStack Mutation wrapper |
| `hooks/use-guess-inputs.ts` | 67 | `useGuessInputs()` | Local form state + validation |
| `server-side/fetchers.ts` | - | `getMemberGuesses()` | API GET function |
| `server-side/mutations.ts` | 4 | `createGuess()` | API POST function |

### UI Integration Files

| File | Lines | Component | Purpose |
|------|-------|-----------|---------|
| `match/components/match-card/match-card.tsx` | 23 | `MatchCard` | Main orchestrator |
| `match/components/match-card/guess-status.tsx` | - | `GuessStatus` | Status pill display |
| `match/components/match-card/guess-display.tsx` | - | `GuessDisplay` | User prediction display |
| `match/components/match-card/guess-points.tsx` | - | `GuessPoints` | Points display |
| `match/components/match-card/guess-match-outcome.tsx` | - | `GuessMatchOutcome` | Outcome indicator |
| `match/components/match-card/score-input.tsx` | - | `ScoreInput` | Editable inputs |
| `tournament/components/tournament-round-of-games/tournament-round-of-games.tsx` | 37 | `TournamentRoundOfGames` | Fetch orchestrator |

---

## Architectural Patterns

### Domain-Driven Design

The guess domain follows clean DDD principles:

```
Domain Layer (src/domains/guess/)
├─ typing.ts          → Data model contracts
├─ utils.ts           → Business logic utilities
├─ server-side/       → Infrastructure layer (API)
│  ├─ fetchers.ts     → Read operations
│  └─ mutations.ts    → Write operations
└─ hooks/             → Application layer
   ├─ use-guess       → Query orchestration
   ├─ use-guess-mutation → Command orchestration
   └─ use-guess-inputs   → Form state management

UI Layer (src/domains/match/components/)
└─ match-card/        → Presentation layer
   ├─ match-card.tsx  → Component orchestrator
   ├─ guess-*.tsx     → Display components
   └─ score-*.tsx     → Input components
```

### Separation of Concerns

- **Domain Logic**: Validation, state management (guess domain)
- **Presentation Logic**: Display, user interaction (match domain)
- **Data Fetching**: API integration (server-side layer)
- **State Orchestration**: Query/mutation management (hooks layer)

### Hook Composition Pattern

```typescript
// Match Card uses composed hook
const guessInputs = useGuessInputs(guess, match, guessMutation);

// Which internally uses
const guessMutation = useGuessMutation(tournamentId);

// Which provides clean interface
guessInputs.handleSave() // Validates + saves + updates cache
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ User Action: Navigate to Tournament Round                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ TournamentRoundOfGames Component Mounts                         │
│  ├─ useGuess(tournamentId, round) → GET /tournaments/.../guess │
│  └─ useTournamentMatches(tournamentId, round) → GET /matches   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ├─ guesses: IGuess[]
                 └─ matches: IMatch[]
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Combine Data by matchId                                         │
│  For each match:                                                │
│    ├─ Find corresponding guess                                  │
│    └─ Render MatchCard(match, guess, mutation)                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ MatchCard Component                                             │
│  ├─ guessInputs = useGuessInputs(guess, match, guessMutation)  │
│  ├─ Displays: GuessStatus, GuessPoints, GuessMatchOutcome      │
│  ├─ Shows: ScoreDisplay (actual), GuessDisplay (prediction)    │
│  └─ Shows: ScoreInput (if editable)                            │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ User Edits Guess                                                │
│  ├─ handleHomeGuess(value) → Updates local state               │
│  └─ handleAwayGuess(value) → Updates local state               │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ User Clicks "Save"                                              │
│  └─ guessInputs.handleSave()                                    │
│      ├─ Validates: homeGuess !== null && awayGuess !== null    │
│      └─ Calls: guessMutation.mutateAsync(input)                │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ API Request: POST /guess                                        │
│  Body: { id, matchId, tournamentId, home: {score}, away: {score} }│
└────────────────┬────────────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
    [Success]        [Error]
         │               │
         ▼               ▼
  onSuccess:      onError:
  - Optimistic    - Rollback
    Update          Previous
  - Replace         State
    Guess in        (BUG: wrong key!)
    Cache
         │               │
         └───────┬───────┘
                 ▼
         onSettled:
         - Invalidate Query
         - Refetch for Consistency
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ UI Re-renders                                                   │
│  ├─ Updated guess from cache                                    │
│  ├─ CardAnimation plays "Good Luck!"                           │
│  └─ Card closes automatically                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing Recommendations

### Unit Tests

**State Management**:
- ✅ Verify optimistic updates replace correct guess in array
- ✅ Test cache invalidation triggers on settled
- ✅ Verify rollback on error (once bug is fixed)
- ✅ Test query key construction with different round values

**Validation**:
- ✅ Both home and away must be provided (null check)
- ✅ Numbers must be non-negative integers
- ✅ Prevent submission when mutation is pending
- ✅ Prevent submission when `hasLostTimewindowToGuess === true`

**Hooks**:
- ✅ `useGuessInputs` manages local state correctly
- ✅ `handleSave` throws error when validation fails
- ✅ `allowNewGuess` computed correctly based on status

### Integration Tests

**UI Integration**:
- ✅ MatchCard displays correct guess for each match
- ✅ Multiple matches render independently
- ✅ Card expand/collapse toggles ScoreInput visibility
- ✅ Save button triggers mutation and animation

**Data Flow**:
- ✅ TournamentRoundOfGames combines guesses + matches correctly
- ✅ GuessSection displays all guesses for tournament
- ✅ Performance stats aggregate counts correctly

### E2E Tests

**User Flows**:
- ✅ User can view guesses for a tournament round
- ✅ User can create/edit guess before deadline
- ✅ User cannot edit guess after deadline
- ✅ User sees "Good Luck!" animation on save
- ✅ User sees points and outcome after match completion

**Edge Cases**:
- ✅ Expired guess shows correct status and disabled inputs
- ✅ Paused match shows postponed status
- ✅ Network error on save shows error and keeps card open
- ✅ Concurrent edits to same guess handle correctly

---

## Future Improvements

### 1. Fix Critical Bug
- [ ] Fix error handler query key in `use-guess-mutation.ts:32`
- [ ] Add test to verify rollback works correctly

### 2. Add Schema Validation
- [ ] Create Zod schema for `CreateGuessInput`
- [ ] Use schema in `handleSave` for validation
- [ ] Add error messages for specific validation failures

### 3. Type Safety Improvements
- [ ] Standardize `round` type (string vs number)
- [ ] Add strict TypeScript config for guess domain
- [ ] Create branded types for IDs (GuessId, MatchId, etc.)

### 4. Code Cleanup
- [ ] Remove unused code from `utils.ts`
- [ ] Consolidate demo/guess fetcher duplication
- [ ] Add JSDoc comments to public APIs

### 5. Performance Optimizations
- [ ] Consider React.memo for MatchCard (if many matches render)
- [ ] Evaluate if infinite scroll needed for GuessSection
- [ ] Add loading skeletons for better perceived performance

### 6. Developer Experience
- [ ] Add Storybook stories for guess components
- [ ] Create visual regression tests for status pills
- [ ] Document match outcome label format (snake_case convention)

---

## Questions & Clarifications Needed

1. **Point Calculation**: What are the exact point values for each scoring category?
2. **Time Window**: What is the configured time buffer before match start?
3. **Match Outcome Labels**: Is there a fixed set of labels or can backend return arbitrary values?
4. **Rollback Behavior**: Should error rollback be immediate or wait for user action?
5. **Concurrent Edits**: How does system handle if multiple devices edit same guess?

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-02 | Claude Code | Initial expert reference documentation created |

---

**End of Document**
