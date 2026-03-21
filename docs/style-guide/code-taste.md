# Code Taste Guide

This guide defines the practical coding taste for Best Shot. It complements the technical rules in the other style-guide files by clarifying how to make tradeoffs in real feature work.

## Core Taste

- Understand the code first.
- Never edit code you cannot explain.
- Do not explain, refactor, or edit code based on pattern-matching alone.
- Before changing code, understand what it does, why it exists, which business rule it implements, where the data comes from, and who consumes it.
- Do not create helper interfaces, helper types, or `satisfies` contracts unless they are already established in the local domain or are strictly required.
- Do not create new hooks, utilities, wrappers, or files unless they are strictly required by the requested change.
- Prefer obvious code over "cleaner" architecture.
- Prefer local simplicity over speculative reusability.
- When a user points to a specific file, assume the meaningful solution should remain in that file unless there is explicit approval to move it.
- Do not solve a request by moving the "real" logic elsewhere unless that move is explicitly requested or required.
- Treat optional abstractions as a cost, not as an automatic improvement.

## Naming

- Method and helper names must reflect their real responsibility.
- If a function filters, reshapes, sorts, and limits data, do not name it as if it only sorts.
- If a name and the business meaning diverge, fix the name or the logic. Do not leave misleading names in place just because the code works.

## Declarative Pipelines

- When a transformation pipeline contains business rules, prefer named local helpers and constants over anonymous inline callbacks.
- A split is good when each helper expresses real business meaning or UI intent.
- Treat predicates like `byUpcomingMatch`, `byCurrentMonth`, mappers like `toMatchAndLeagueName`, comparators like `byAscMatchDate`, and constants like `MAX_MATCHES_TO_DISPLAY` as good local clarity, not unnecessary abstraction.

Preferred style:

```ts
const getUpcomingMatches = (leagues: I_League[]) => {
  return leagues
    .flatMap(toUpcomingMatches)
    .filter(byCurrentMonth)
    .map(toMatchAndLeagueName)
    .sort(byAscMatchDate)
    .slice(0, MAX_MATCHES_TO_DISPLAY);
};
```

## File Layout

- Place local `type` and `interface` declarations at the bottom of the file unless there is a strong reason to keep them near usage.

## Custom Hooks & Data Orchestration

- The rule *"Do not create new hooks, utilities, wrappers... unless strictly required"* does **not** forbid UI-oriented hooks. 
- Creating custom domain hooks (e.g., the `useUpcomingMatches` example in the lifecycle guide) to orchestrate raw server-state queries into derived UI state is **strictly required**.
- These composition hooks exist to enforce the strict `{ data, states, handlers }` contract defined in [components-lifecycle.md](./components-lifecycle.md) and keep complex orchestration out of `.tsx` components.

## Scope

- Do not introduce structure just because it looks more reusable or more elegant.
- If the requested change can be completed by adapting existing code, prefer that over creating new layers.
- Keep the visible solution close to where the user expects to find it.
