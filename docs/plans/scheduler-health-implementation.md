# Phase 1: Implement Scheduler Health Monitoring

## Goal
Integrate the new Scheduler Health endpoints into the Admin Dashboard to allow monitoring of the match polling scheduler status and manual triggering of updates.

## Tasks

### Task 1: API Integration Layer
- [x] Define Zod schemas for the scheduler stats response in `src/domains/admin/schemas.ts`.
- [x] Add TypeScript interfaces in `src/domains/admin/typing.ts`.
- [x] Implement `fetchSchedulerStats` in `src/domains/admin/server-side/fetchers.ts`.
- [x] Implement `triggerMatchPolling` in `src/domains/admin/server-side/mutations.ts`.

### Task 2: React Query Hooks
- [x] Create `src/domains/admin/hooks/use-scheduler-stats.ts` for fetching stats.
- [x] Create `src/domains/admin/hooks/use-trigger-match-polling.ts` for the manual trigger mutation.
- [x] Export new hooks from `src/domains/admin/hooks/index.ts`.

### Task 3: UI Implementation
- [x] Create `src/domains/admin/components/scheduler-health/scheduler-health-card.tsx`.
    - Display "Status" (Running/Warning based on pending updates).
    - Display "Matches Pending" count.
    - Display "Total Open Matches".
    - Display "Last Checked" (if available or implied).
    - Add "Trigger Manual Update" button with loading state.
- [x] Integrate `SchedulerHealthCard` into `src/domains/admin/pages/main.tsx`.

## Dependencies
- Backend endpoints:
    - `GET /api/v2/admin/scheduler/stats`
    - `POST /api/v2/admin/scheduler/trigger-match-polling`

## Expected Result
The Admin Dashboard should have a new section/card showing the scheduler's health and allowing manual execution of the match polling process.
