# V2 Refactor Plan - Clean Break Strategy

## Status
Pending


## 🎯 Objective
Migrate the `best-shot` frontend application to a `v2` architecture using a **Clean Break** strategy.
The goal is to modernize the UI and Logic (Domains) without disrupting the existing `v1` application, using URL-based versioning for coexistence.

**Key Principles:**
1.  **Isolation:** `v2` code must not import from `v1` (legacy) domains.
2.  **Duplication over Coupling:** Prefer copying utilities/components to `v2` over sharing with `v1`.
3.  **Vertical Slices:** Organize code by Domain/Feature, not by technical layer.
4.  **Coexistence:** `v1` (/leagues) and `v2` (/v2/leagues) run side-by-side.

---

## 📅 Phase 1: The Foundation
*Setup the empty shell and routing infrastructure for the new version.*

### Tasks
- [ ] **Infrastructure Setup**
    - [ ] Create `src/domains/v2` directory structure.
    - [ ] Create `src/routes/v2` directory structure.
    - [ ] Create `src/domains/v2/ui-system` (Clone/Setup base UI components).
- [ ] **Routing & Layout**
    - [ ] Create `src/routes/v2/_auth.tsx`.
    - [ ] Implement V2 Main Layout (Shell, Navigation, Sidebar) in `src/routes/v2/_auth.tsx`.
    - [ ] Connect Authentication (Share Auth0 context, but render new UI).
- [ ] **Proof of Concept**
    - [ ] Create a "Hello World" page at `/v2/dashboard`.
    - [ ] Verify navigation between `/dashboard` (v1) and `/v2/dashboard` (v2).

### Checklist
- [ ] V2 Routes are accessible via browser URL.
- [ ] V2 Layout is visually distinct (or ready to be).
- [ ] No `v1` domain code is imported in `v2` files.

---

## 📅 Phase 2: The Pilot Domain (Leagues)
*Migrate the first complete domain to prove the architecture.*

### Tasks
- [ ] **Domain Modeling (Leagues)**
    - [ ] Create `src/domains/v2/league`.
    - [ ] Define V2 Types/Interfaces for League.
    - [ ] Implement V2 API Fetchers (using TanStack Query v5 conventions).
- [ ] **UI Implementation**
    - [ ] Create V2 League List Component.
    - [ ] Create V2 New League Wizard/Form.
    - [ ] Create V2 League Details View.
- [ ] **Integration**
    - [ ] Create Route: `/v2/leagues` (List).
    - [ ] Create Route: `/v2/leagues/$leagueId` (Details).
    - [ ] Create Route: `/v2/leagues/new` (Creation).

### Checklist
- [ ] User can view leagues in V2.
- [ ] User can create a league in V2.
- [ ] Data updates in V2 are reflected in V1 (Shared Database/Backend).

---

## 📅 Phase 3: Core Domains Rollout
*Iteratively migrate the remaining domains.*

### Tasks - Batch A (Matches & Tournaments)
- [ ] **Matches Domain**
    - [ ] Scaffold `src/domains/v2/match`.
    - [ ] Implement Match Card & Score Input.
    - [ ] Route: `/v2/tournaments/$id/matches`.
- [ ] **Tournaments Domain**
    - [ ] Scaffold `src/domains/v2/tournament`.
    - [ ] Implement Standings & Stats.
    - [ ] Route: `/v2/tournaments`.

### Tasks - Batch B (Member & Dashboard)
- [ ] **Member Domain** (Profile, Settings).
- [ ] **Dashboard Domain** (Home screen widgets).

### Checklist
- [ ] All critical user flows exist in V2.
- [ ] Feature parity with V1 (or agreed upon V2 scope) is reached.

---

## 📅 Phase 4: The Switch & Cleanup
*Make V2 the default and remove V1.*

### Tasks
- [ ] **The Switch**
    - [ ] Update Root Redirects: `/` goes to `/v2/dashboard`.
    - [ ] Update Navigation Links: Remove `v2` prefix from UI (or swap paths).
    - [ ] (Optional) Remap routes so `/leagues` renders the V2 component.
- [ ] **Deprecation**
    - [ ] Analyze usage logs (ensure V1 traffic is zero).
    - [ ] Delete `src/domains/league` (V1).
    - [ ] Delete `src/domains/match` (V1).
    - [ ] ...repeat for all V1 domains.
- [ ] **Final Polish**
    - [ ] Move `src/domains/v2/*` up to `src/domains/*`.
    - [ ] Remove `v2` from route paths.

### Checklist
- [ ] Old code is deleted.
- [ ] Project size is reduced.
- [ ] Architecture is clean and vertical.



