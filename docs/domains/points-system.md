x# Points System - Expert Reference

**Domain**: Points Calculation & Aggregation
**Last Updated**: 2026-01-03
**Status**: Active (Backend-Calculated, Frontend-Displayed)

---

## Table of Contents

1. [Overview](#overview)
2. [How Points Are Calculated](#how-points-are-calculated)
3. [Point Lifecycle](#point-lifecycle)
4. [Point Aggregation Hierarchy](#point-aggregation-hierarchy)
5. [Data Flow](#data-flow)
6. [Display Components](#display-components)
7. [API Integration](#api-integration)
8. [Business Rules](#business-rules)
9. [Architecture](#architecture)
10. [Key Files Reference](#key-files-reference)

---

## Overview

### What Are Points?

Points are rewards earned by users for accurate match predictions in the Best Shot sports prediction application. Users predict match scores before games begin, and earn points based on how accurate their predictions are when matches complete.

### Critical Architectural Principle

**Backend Does Everything, Frontend Displays Only**

- **Backend Responsibility**: Calculate, aggregate, and store all points
- **Frontend Responsibility**: Fetch, cache, and display points
- **Zero Calculation Logic in Frontend**: All point values come from backend API

### Why Backend-Only Calculation?

✅ **Single Source of Truth**: No risk of frontend/backend mismatch
✅ **Security**: Users cannot manipulate points client-side
✅ **Flexibility**: Point values can change without frontend deployment
✅ **Consistency**: All users see identical calculation logic
✅ **Auditability**: Central location for point calculation rules

---

## How Points Are Calculated

### Three Point Categories

Every guess can earn points in **three independent ways**:

```typescript
interface IGuess {
  home: {
    value: number | null;    // User's predicted home score
    points: number | null;   // ← Points for home score accuracy
  };
  away: {
    value: number | null;    // User's predicted away score
    points: number | null;   // ← Points for away score accuracy
  };
  fullMatch: {
    label: string;           // Match outcome (e.g., "home_win", "draw")
    points: number | null;   // ← Points for outcome accuracy
  };
  total: number | null;      // ← Sum of all three categories
}
```

### Scoring Rules

#### 1. Home Score Points
**Earned When**: User's predicted home score **exactly matches** actual home score

**Example**:
```
Predicted: Home 2
Actual:    Home 2
Result:    ✅ Points awarded (typically 2-3 points)
```

#### 2. Away Score Points
**Earned When**: User's predicted away score **exactly matches** actual away score

**Example**:
```
Predicted: Away 1
Actual:    Away 1
Result:    ✅ Points awarded (typically 2-3 points)
```

#### 3. Full Match Points
**Earned When**: User's predicted **match outcome** is correct (doesn't require exact scores)

**Match Outcomes**:
- `home_win` - Home team wins
- `away_win` - Away team wins
- `draw` - Match ends in a tie

**Example**:
```
Predicted: Home 3 - Away 1 (outcome: home_win)
Actual:    Home 2 - Away 0 (outcome: home_win)
Result:    ✅ Points awarded for correct outcome (typically 1 point)
```

### Complete Scoring Example

```
Match Result:
Home 2 - 1 Away (home wins)

User Prediction:
Home 2 - 0 Away (home wins)

Points Breakdown:
┌─────────────────┬───────────┬────────┬────────────────────────┐
│ Category        │ Predicted │ Actual │ Points                 │
├─────────────────┼───────────┼────────┼────────────────────────┤
│ home.points     │     2     │   2    │ ✅ 3 (exact match)     │
│ away.points     │     0     │   1    │ ❌ 0 (incorrect)       │
│ fullMatch.points│ home_win  │home_win│ ✅ 1 (correct outcome) │
├─────────────────┴───────────┴────────┼────────────────────────┤
│ TOTAL                                │ 4 points               │
└──────────────────────────────────────┴────────────────────────┘
```

### Point Values

**⚠️ Important**: Frontend has **no knowledge** of exact point values. These are backend configuration.

**Typical Values** (based on documentation):
- **Exact score match**: 2-3 points per score (home or away)
- **Correct outcome only**: 1 point
- **Incorrect prediction**: 0 points

**Backend Configuration**: Point values can be adjusted without frontend changes.

---

## Point Lifecycle

### When Points Are Calculated

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User Submits Guess                                      │
│   POST /guess { matchId, home: {score: 2}, away: {score: 1} }  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Backend Stores Guess                                    │
│   guess.home.points = null                                      │
│   guess.away.points = null                                      │
│   guess.fullMatch.points = null                                 │
│   guess.total = null                                            │
│   guess.status = "not-started" or "waiting_for_game"            │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Match Completes                                         │
│   match.status = "ended"                                        │
│   match.home.score = 2 (actual)                                 │
│   match.away.score = 1 (actual)                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Backend Calculates Points                               │
│   1. Compare predicted home (2) vs actual home (2) → Match!     │
│      guess.home.points = 3                                      │
│                                                                  │
│   2. Compare predicted away (1) vs actual away (1) → Match!     │
│      guess.away.points = 3                                      │
│                                                                  │
│   3. Determine outcome: 2 > 1 → home_win                        │
│      Predicted outcome: home_win                                │
│      Actual outcome: home_win → Match!                          │
│      guess.fullMatch.points = 1                                 │
│      guess.fullMatch.label = "home_win"                         │
│                                                                  │
│   4. Calculate total                                            │
│      guess.total = 3 + 3 + 1 = 7                                │
│                                                                  │
│   5. Update status                                              │
│      guess.status = "finalized"                                 │
│      guess.home.status = "correct"                              │
│      guess.away.status = "correct"                              │
│      guess.fullMatch.status = "correct"                         │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Frontend Fetches & Displays                             │
│   GET /tournaments/{id}/guess                                   │
│   → Returns IGuess[] with populated points                      │
│                                                                  │
│   Components check:                                             │
│   if (guess.status === "finalized") {                           │
│     return <GuessPoints total={7} />                            │
│   }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Status Transitions

```
NOT_STARTED (points: null)
    ↓
WAITING_FOR_GAME (points: null)
    ↓ [Match completes]
FINALIZED (points: calculated!)
    ↓ [Backend determines accuracy]
CORRECT or INCORRECT
```

**Key Point**: Points only exist when `status === "finalized"`

---

## Point Aggregation Hierarchy

### Level 1: Individual Guess Total

**Calculation**:
```typescript
guess.total = guess.home.points + guess.away.points + guess.fullMatch.points
```

**Where**: Backend calculates after match completion
**Type**: `number | null`
**Displayed**: Match card (GuessPoints component)

**Example**:
```
home.points = 3
away.points = 0
fullMatch.points = 1
─────────────────
total = 4 points
```

---

### Level 2: Tournament Total Points

**Calculation**:
```typescript
tournament.points = SUM(all guess.total for this tournament)
```

**Where**: Backend aggregates across all rounds
**Type**: `string` (formatted number)
**API**: `GET /tournaments/{tournamentId}/performance`
**Displayed**: Tournament performance stats

**Example**:
```
Tournament: "World Cup 2026"
─────────────────────────────
Round 1, Match 1: 4 points
Round 1, Match 2: 7 points
Round 1, Match 3: 0 points
Round 2, Match 1: 6 points
...
─────────────────────────────
Total: 142 points
```

---

### Level 3: League Leaderboard Points

**Calculation**:
```typescript
member.leaderBoard.points = SUM(all tournament.points for this member)
```

**Where**: Backend aggregates across all tournaments in league
**Type**: `string` (formatted number)
**API**: `GET /leagues/{leagueId}/performance`
**Displayed**: League leaderboard

**Example**:
```
League: "Friends Fantasy League"
Member: "Player One"
────────────────────────────────────
World Cup 2026:     142 points
Champions League:   98 points
Premier League:     67 points
────────────────────────────────────
Total: 307 points → Rank #1
```

---

## Data Flow

### From Calculation to Display

```
┌───────────────────────────────────────────────────────────────┐
│ Backend Calculation Engine                                    │
│  ├─ Compare predictions vs actual scores                      │
│  ├─ Award points per category (home, away, fullMatch)         │
│  ├─ Calculate totals                                          │
│  ├─ Aggregate tournament points                               │
│  └─ Aggregate league leaderboard                              │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ▼
┌───────────────────────────────────────────────────────────────┐
│ API Endpoints                                                 │
│  ├─ GET /tournaments/{id}/guess → IGuess[]                    │
│  ├─ GET /tournaments/{id}/performance → ITournamentPerformance│
│  ├─ GET /tournaments/{id}/performance/details → Breakdown     │
│  └─ GET /leagues/{id}/performance → ILeaguePerformance        │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ▼
┌───────────────────────────────────────────────────────────────┐
│ TanStack Query Cache (Frontend)                              │
│  ├─ ["guess", { tournamentId, round }]                       │
│  ├─ ["tournamentPerformance", { tournamentId }]              │
│  └─ ["leaguePerformance", { leagueId }]                      │
└────────────────┬──────────────────────────────────────────────┘
                 │
         ┌───────┴────────┬──────────────┬──────────────┐
         ▼                ▼              ▼              ▼
    MatchCard    TournamentStats  LeagueStats  GuessSection
    (Individual) (Tournament)     (Leaderboard) (Breakdown)
```

### Cache Management

**Query Keys**:
```typescript
// Individual guesses with points
["guess", { tournamentId: "abc", round: "1" }]

// Tournament total points
["tournamentPerformance", { tournamentId: "abc" }]

// League leaderboard
["leaguePerformance", { leagueId: "xyz" }]
```

**Invalidation Strategy**:
- When guess is saved → Invalidate guess query
- When match completes → Backend updates, frontend refetches
- Manual refresh → User clicks "Update" button

---

## Display Components

### Match-Level Components (Individual Guess)

#### GuessPoints Component

**File**: `src/domains/match/components/match-card/guess-points.tsx:8`

**Purpose**: Display total points earned for a single guess

**Appearance**:
```
┌─────────────────────┐
│ POINTS    4         │  ← Black pill
└─────────────────────┘
```

**Code**:
```typescript
export const GuessPoints = ({ guess }: { guess: IGuess }) => {
  // Only show when match is finalized
  if (guess.status !== "finalized") return null;

  return (
    <AppPill bgcolor="black.500" width={75} height={20}>
      <Stack direction="row" gap={2}>
        <Typography variant="tag" color="teal.500">POINTS</Typography>
        <Typography color="neutral.100">{guess.total}</Typography>
      </Stack>
    </AppPill>
  );
};
```

**Display Rules**:
- ✅ Visible when: `guess.status === "finalized"`
- ❌ Hidden when: not-started, waiting_for_game, expired, paused

---

#### GuessMatchOutcome Component

**File**: `src/domains/match/components/match-card/guess-match-outcome.tsx:7`

**Purpose**: Display match outcome prediction result (correct/incorrect)

**Appearance**:
```
CORRECT:                    INCORRECT:
┌─────────────────┐        ┌─────────────────┐
│ home win        │        │ away win        │
│ (Green pill)    │        │ (Red pill)      │
└─────────────────┘        └─────────────────┘
```

**Code**:
```typescript
export const GuessMatchOutcome = ({ guess }: { guess: IGuess }) => {
  if (guess.status !== "finalized") return null;

  // Convert "home_win" → "home win"
  const label = guess.fullMatch.label.replaceAll("_", " ");

  // Red pill for incorrect
  if (guess.fullMatch.status === "incorrect") {
    return <AppPill bgcolor="red.400">{label}</AppPill>;
  }

  // Green pill for correct
  return <AppPill bgcolor="green.200">{label}</AppPill>;
};
```

**Label Format**:
- Backend stores: `"home_win"`, `"away_win"`, `"draw"`
- Frontend displays: `"home win"`, `"away win"`, `"draw"`
- Conversion: `label.replaceAll("_", " ")`

---

### Tournament-Level Components (Aggregate)

#### TournamentPerformanceStats Component

**File**: `src/domains/tournament/components/tournament-performance-stats/tournament-performance-stats.tsx:17`

**Purpose**: Display total points for entire tournament

**Appearance**:
```
┌─────────────────────────────────┐
│ POINTS                          │
│ 142  ← Animated counter         │
│                                 │
│ [Update Button]                 │
└─────────────────────────────────┘
```

**Code**:
```typescript
<PerfCard>
  <Stack direction="row" gap={1.5} alignItems="start">
    <Typography variant="topic" color="teal.500">POINTS</Typography>
    <Typography variant="h1" color="neutral.100">
      <Counter initialValue={Number(basicPerformance?.points) ?? 0} />
    </Typography>
  </Stack>
  <AppButton onClick={refetch}>Update</AppButton>
</PerfCard>
```

**Features**:
- Animated counter (counts up to value)
- Manual refresh button
- Large prominent display

---

#### TournamentDetailedPerformanceStats Component

**File**: `src/domains/tournament/components/tournament-performance-stats/tournament-detailed-performance-stats.tsx:20`

**Purpose**: Breakdown of guess statistics

**Appearance**:
```
┌───────────────────────────────────────┐
│ Correct Guesses              5        │
│ Incorrect Guesses            3        │
│ Waiting for Match Outcome    2        │
│ Still Can Guess              4        │
└───────────────────────────────────────┘
```

**Data Structure**:
```typescript
interface ITournamentPerformanceWithDetails {
  points: string;                    // Total points
  details: Record<string, number>;   // Count by status
  guessesByOutcome: {
    correct: number;                 // Correct guess count
    incorrect: number;               // Incorrect guess count
  };
}
```

**API Response Example**:
```json
{
  "points": "142",
  "details": {
    "not-started": 4,
    "waiting_for_game": 2,
    "correct": 5,
    "incorrect": 3
  },
  "guessesByOutcome": {
    "correct": 5,
    "incorrect": 3
  }
}
```

---

#### GuessSection Component

**File**: `src/domains/tournament/components/tournament-performance-stats/guess-section.tsx:22`

**Purpose**: Collapsible list of all guesses with points

**Appearance**:
```
┌─────────────────────────────────────────────────┐
│ Correct [+]                                  5  │ ← Collapsed
└─────────────────────────────────────────────────┘

When expanded:
┌─────────────────────────────────────────────────┐
│ Correct [-]                                  5  │
│ ┌─────────────────────────────────────────────┐ │
│ │ MATCH #1    CORRECT    POINTS 7             │ │
│ │ MATCH #2    CORRECT    POINTS 4             │ │
│ │ MATCH #3    CORRECT    POINTS 6             │ │
│ │ MATCH #4    CORRECT    POINTS 3             │ │
│ │ MATCH #5    CORRECT    POINTS 5             │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Groups**:
- Correct guesses
- Incorrect guesses
- Waiting for result
- Not started

---

### League-Level Components (Leaderboard)

#### LeaguePerformanceStats Component

**File**: `src/domains/league/components/league-performance-stats/league-performance-stats.tsx:18`

**Purpose**: Display league-wide leaderboard and per-tournament standings

**Leaderboard Appearance**:
```
┌──────────────────────────────────────────────┐
│ LEADERBOARD                                  │
├──────┬───────────────────┬───────────────────┤
│ RANK │ MEMBER            │ POINTS            │
├──────┼───────────────────┼───────────────────┤
│  1   │ Player One        │ 307               │
│  2   │ Player Two        │ 289               │
│  3   │ Player Three      │ 256               │
│  4   │ Player Four       │ 198               │
└──────┴───────────────────┴───────────────────┘
```

**Per-Tournament Standings**:
```
┌──────────────────────────────────────────────┐
│ 🏆 World Cup 2026                            │
│ ├─ Player One:    142 points                │
│ ├─ Player Two:    135 points                │
│ └─ Player Three:  128 points                │
│                                              │
│ 🏆 Champions League                          │
│ ├─ Player One:    98 points                 │
│ ├─ Player Two:    87 points                 │
│ └─ Player Three:  76 points                 │
└──────────────────────────────────────────────┘
```

**Data Structure**:
```typescript
interface ILeaguePerformance {
  leaderBoard: {
    memberName: string;
    points: string;           // Total across all tournaments
    lastUpdated: string;
  }[];
  standings: Record<string, {
    id: string;
    logo: string;
    members: {
      member: string;
      points: string;         // Points in this specific tournament
    }[];
  }>;
  lastUpdated: string;
}
```

---

## API Integration

### Endpoints

#### 1. Fetch Individual Guesses with Points

```
GET /tournaments/{tournamentId}/guess
Query Params: { round?: number }
Response: IGuess[]
```

**Response Example**:
```json
[
  {
    "id": "guess-uuid-1",
    "matchId": "match-uuid-1",
    "home": {
      "value": 2,
      "points": 3,
      "status": "correct"
    },
    "away": {
      "value": 1,
      "points": 3,
      "status": "correct"
    },
    "fullMatch": {
      "label": "home_win",
      "points": 1,
      "status": "correct"
    },
    "total": 7,
    "status": "finalized",
    "hasLostTimewindowToGuess": true
  }
]
```

**Fetcher**: `src/domains/guess/server-side/fetchers.ts:3`

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

---

#### 2. Fetch Tournament Total Points

```
GET /tournaments/{tournamentId}/performance
Response: ITournamentPerformance
```

**Response Example**:
```json
{
  "points": "142",
  "lastUpdated": "2025-01-06T10:00:00Z"
}
```

**Type**: `src/domains/tournament/schemas.ts:32`

```typescript
interface ITournamentPerformance {
  lastUpdated: string;
  points: string;
}
```

**Fetcher**: `src/domains/tournament/server-state/fetchers.ts:45`

```typescript
export const getTournamentPerformance = async ({ queryKey }: { queryKey: unknown }) => {
  const [_key, { tournamentId }] = queryKey as [string, { tournamentId: string }];
  const response = await api.get(`tournaments/${tournamentId}/performance`, {
    baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
  });
  return response.data as ITournamentPerformance;
};
```

---

#### 3. Fetch Detailed Tournament Performance

```
GET /tournaments/{tournamentId}/performance/details
Response: ITournamentPerformanceWithDetails
```

**Response Example**:
```json
{
  "points": "142",
  "lastUpdated": "2025-01-06T10:00:00Z",
  "details": {
    "not-started": 4,
    "waiting_for_game": 2,
    "correct": 5,
    "incorrect": 3,
    "expired": 1
  },
  "guessesByOutcome": {
    "correct": 5,
    "incorrect": 3
  }
}
```

**Type**: `src/domains/tournament/schemas.ts:39`

```typescript
interface ITournamentPerformanceWithDetails extends ITournamentPerformance {
  details: Record<string, number>;
  guessesByOutcome: {
    correct: number;
    incorrect: number;
  };
}
```

---

#### 4. Fetch League Leaderboard

```
GET /leagues/{leagueId}/performance
Response: ILeaguePerformance
```

**Response Example**:
```json
{
  "leaderBoard": [
    { "memberName": "Player One", "points": "307", "lastUpdated": "..." },
    { "memberName": "Player Two", "points": "289", "lastUpdated": "..." }
  ],
  "standings": {
    "world-cup-2026": {
      "id": "tournament-1",
      "logo": "https://...",
      "members": [
        { "member": "Player One", "points": "142" },
        { "member": "Player Two", "points": "135" }
      ]
    }
  },
  "lastUpdated": "2025-01-06T10:00:00Z"
}
```

**Type**: `src/domains/league/typing.ts:17`

```typescript
interface ILeaguePerformance {
  leaderBoard: {
    memberName: string;
    points: string;
    lastUpdated: string;
  }[];
  standings: Record<string, {
    id: string;
    logo: string;
    members: {
      member: string;
      points: string;
    }[];
  }>;
  lastUpdated: string;
}
```

---

## Business Rules

### Points Are Awarded When

✅ **Exact Home Score Match**
- User predicts: Home 2
- Actual result: Home 2
- Award: Higher points (typically 2-3)

✅ **Exact Away Score Match**
- User predicts: Away 1
- Actual result: Away 1
- Award: Higher points (typically 2-3)

✅ **Correct Match Outcome**
- User predicts: Home wins (any score)
- Actual result: Home wins (any score)
- Award: Lower points (typically 1)

---

### No Points Awarded When

❌ **Prediction is Incorrect**
- User predicts: Home 3
- Actual result: Home 2
- Award: 0 points

❌ **Guess Submitted After Deadline**
- Guess status: `expired`
- Result: No points, guess not counted

❌ **Match Not Yet Complete**
- Match status: `open`
- Guess status: `waiting_for_game`
- Result: Points are `null` until match ends

❌ **Match Postponed**
- Guess status: `paused`
- Result: Points remain `null`

---

### Display Rules

**Points Only Display When:**
```typescript
if (guess.status === "finalized") {
  // Show GuessPoints component
  // Show GuessMatchOutcome component
}
```

**Hidden When Status Is:**
- `not-started` - Match hasn't begun
- `waiting_for_game` - Match in progress or waiting for result
- `expired` - User missed deadline
- `paused` - Match postponed

---

### Validation Rules

**Guess Submission Requirements**:
1. ✅ Both home AND away scores must be non-null
2. ✅ Scores must be non-negative integers
3. ✅ Cannot submit while mutation is pending
4. ✅ Can only submit when:
   - Guess status is `NOT_STARTED` or `WAITING_FOR_GAME`
   - `hasLostTimewindowToGuess === false`

**Code**: `src/domains/guess/hooks/use-guess-inputs.ts:26`

```typescript
const handleSave = () => {
  if (homeGuess === null || awayGuess === null) {
    throw new Error("Invalid guess");
  }

  return guessMutation.mutateAsync({
    matchId: match.id,
    tournamentId,
    home: { score: homeGuess },
    away: { score: awayGuess },
  });
};
```

---

## Architecture

### Separation of Concerns

```
┌──────────────────────────────────────────────────────────────┐
│ Backend (Point Calculation Engine)                          │
├──────────────────────────────────────────────────────────────┤
│ ✓ Calculate exact point values                              │
│ ✓ Compare predictions vs actual scores                      │
│ ✓ Determine match outcomes                                  │
│ ✓ Award points based on accuracy                            │
│ ✓ Aggregate tournament totals                               │
│ ✓ Aggregate league leaderboards                             │
│ ✓ Update guess status to "finalized"                        │
│ ✓ Store all point data in database                          │
└──────────────────────────────────────────────────────────────┘
                            ↓
                    [API Endpoints]
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ Frontend (Point Display System)                             │
├──────────────────────────────────────────────────────────────┤
│ ✓ Fetch points from backend API                             │
│ ✓ Cache points using TanStack Query                         │
│ ✓ Display points in components                              │
│ ✓ Format display (pills, colors, animations)                │
│ ✓ Show/hide based on guess status                           │
│ ✗ NO calculation logic                                      │
│ ✗ NO point value configuration                              │
│ ✗ NO aggregation logic (display only)                       │
└──────────────────────────────────────────────────────────────┘
```

---

### Frontend Has Zero Knowledge Of

The frontend **cannot** and **does not** know:

❌ **Point Values**
- How many points for exact score?
- How many points for correct outcome?
- Are there bonuses or penalties?

❌ **Calculation Formula**
- How is total calculated?
- Are there multipliers?
- Special rules for certain match types?

❌ **Comparison Logic**
- How does backend compare scores?
- What defines a "correct outcome"?
- How are ties handled?

❌ **Aggregation Rules**
- How are tournament totals calculated?
- How are league rankings determined?
- Are there any exclusions?

**All of this is backend business logic.**

---

### Why This Architecture?

**Benefits**:

✅ **Security**: Users cannot manipulate points client-side
✅ **Consistency**: All users see same calculation
✅ **Flexibility**: Change point values without frontend deploy
✅ **Auditability**: Single source of truth for calculations
✅ **Performance**: Expensive calculations happen server-side
✅ **Scalability**: Backend can optimize aggregations

**Trade-offs**:

⚠️ **Network Dependency**: Must fetch points from API
⚠️ **Cache Staleness**: Points may be outdated until refetch
⚠️ **Limited Offline**: Cannot calculate points offline

---

### Cache Strategy

**TanStack Query Keys**:
```typescript
// Individual guess points
["guess", { tournamentId: "abc", round: "1" }]

// Tournament aggregate
["tournamentPerformance", { tournamentId: "abc" }]

// Detailed breakdown
["tournamentPerformanceDetails", { tournamentId: "abc" }]

// League leaderboard
["leaguePerformance", { leagueId: "xyz" }]
```

**Invalidation**:
```typescript
// When user saves guess
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["guess", { tournamentId, round }]
  });
}

// Manual refresh
const handleUpdate = () => {
  refetch(); // Re-fetch tournament performance
};
```

**Stale Time**: Not configured - queries refetch on mount/focus by default

---

## Key Files Reference

### Type Definitions

| File | Line | Type | Purpose |
|------|------|------|---------|
| `guess/typing.ts` | 1 | `IGuess` | Core guess interface with point fields |
| `tournament/schemas.ts` | 32 | `ITournamentPerformance` | Tournament total points |
| `tournament/schemas.ts` | 39 | `ITournamentPerformanceWithDetails` | Detailed breakdown |
| `league/typing.ts` | 17 | `ILeaguePerformance` | League leaderboard |

### API Integration

| File | Line | Function | Purpose |
|------|------|----------|---------|
| `guess/server-side/fetchers.ts` | 3 | `getMemberGuesses()` | Fetch guesses with points |
| `tournament/server-state/fetchers.ts` | 45 | `getTournamentPerformance()` | Fetch tournament total |
| `tournament/server-state/fetchers.ts` | 55 | `getTournamentPerformanceDetails()` | Fetch detailed breakdown |

### Display Components

| File | Line | Component | Purpose |
|------|------|-----------|---------|
| `match/components/match-card/guess-points.tsx` | 8 | `GuessPoints` | Individual points display |
| `match/components/match-card/guess-match-outcome.tsx` | 7 | `GuessMatchOutcome` | Outcome pill (correct/incorrect) |
| `tournament/components/tournament-performance-stats/tournament-performance-stats.tsx` | 17 | `TournamentPerformanceStats` | Tournament total |
| `tournament/components/tournament-performance-stats/tournament-detailed-performance-stats.tsx` | 20 | `TournamentDetailedPerformanceStats` | Breakdown counters |
| `tournament/components/tournament-performance-stats/guess-section.tsx` | 22 | `GuessSection` | Collapsible guess list |
| `league/components/league-performance-stats/league-performance-stats.tsx` | 18 | `LeaguePerformanceStats` | Leaderboard display |

### Hooks

| File | Line | Hook | Purpose |
|------|------|------|---------|
| `guess/hooks/use-guess.ts` | 7 | `useGuess()` | Fetch guesses query |
| `tournament/hooks/use-tournament-performance.ts` | - | `useTournamentPerformance()` | Fetch tournament points |

---

## Testing Considerations

### What Can Be Tested Frontend

✅ **Display Logic**
- GuessPoints shows when status is "finalized"
- GuessPoints hidden when status is not "finalized"
- Correct color coding (green for correct, red for incorrect)

✅ **Formatting**
- Points displayed correctly
- Labels converted from snake_case to spaces
- Animated counter works

✅ **Cache Management**
- Query invalidation triggers refetch
- Manual refresh updates data
- Stale data handling

---

### What Cannot Be Tested Frontend

❌ **Calculation Logic** (backend only)
- Exact point values
- Score comparison formula
- Outcome determination

❌ **Aggregation** (backend only)
- Tournament total calculation
- League leaderboard ranking
- Status transitions

---

### Example Test Coverage

```typescript
describe("GuessPoints Component", () => {
  it("displays points when status is finalized", () => {
    const guess = { status: "finalized", total: 7 };
    render(<GuessPoints guess={guess} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("hides when status is not finalized", () => {
    const guess = { status: "waiting_for_game", total: null };
    render(<GuessPoints guess={guess} />);
    expect(screen.queryByText("POINTS")).not.toBeInTheDocument();
  });
});

describe("GuessMatchOutcome Component", () => {
  it("shows green pill for correct outcome", () => {
    const guess = {
      status: "finalized",
      fullMatch: { status: "correct", label: "home_win" }
    };
    render(<GuessMatchOutcome guess={guess} />);
    expect(screen.getByText("home win")).toHaveStyle({ backgroundColor: "green" });
  });

  it("shows red pill for incorrect outcome", () => {
    const guess = {
      status: "finalized",
      fullMatch: { status: "incorrect", label: "away_win" }
    };
    render(<GuessMatchOutcome guess={guess} />);
    expect(screen.getByText("away win")).toHaveStyle({ backgroundColor: "red" });
  });
});
```

---

## Summary

### Key Takeaways

1. **Backend Calculates, Frontend Displays**
   - All point calculation happens on backend
   - Frontend only fetches and displays

2. **Three Point Categories**
   - Home score points
   - Away score points
   - Full match outcome points

3. **Three Aggregation Levels**
   - Individual guess total
   - Tournament total
   - League leaderboard

4. **Points Only Visible When Finalized**
   - Status must be "finalized"
   - Hidden during active matches

5. **Zero Frontend Configuration**
   - No point values in code
   - No calculation formulas
   - Pure display layer

---

## Related Documentation

- **Guess Domain Reference**: `docs/domains/guess-domain.md`
- **Tournament Schema**: `src/domains/tournament/schemas.ts`
- **League Types**: `src/domains/league/typing.ts`
- **API Integration**: Backend API documentation (external)

---

**End of Document**