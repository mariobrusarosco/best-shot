# AI Agent Workflow

This document defines how AI agents should understand and apply project code taste before making implementation changes.

## Purpose

Project code taste is built over time by the developer. AI agents should not invent a complete style guide up front. Instead, agents must read the existing taste registry, inspect local precedent, and ask before creating important conventions.

## Taste Preflight

Before coding, run this preflight:

1. Identify the work category: component, hook, styling, screen, state, API/data, tests, or another category.
2. Read the relevant files in `docs/code-taste/`.
3. Check whether a written convention applies.
4. Inspect nearby code for local precedent.
5. Decide whether the task would create a new convention.
6. If the convention is high-impact, ask before implementing it.

## Taste Gap Protocol

When no written convention exists:

- For low-impact gaps, follow nearby code or make the smallest reasonable local choice.
- For high-impact gaps, ask the developer before proceeding.

Low-impact gaps are small, local, and easy to revise.

High-impact gaps affect patterns future work is likely to copy, such as:

- routing
- authenticated vs public screen structure
- data fetching and API boundaries
- global or shared state
- custom hook return shapes
- styling systems
- component file organization
- dependency choices
- test strategy

## Explicit Feedback Capture

Do not treat normal feedback as permanent project taste.

Only update the code taste registry when the developer explicitly starts feedback with:

```txt
[FEEDBACK FOR CODE TASTE]
```

When receiving marked feedback:

1. Interpret it as a durable project convention.
2. Ask for clarification if the rule is ambiguous.
3. If it conflicts with an existing rule, call out the conflict and ask before replacing it.
4. Add or update the relevant file in `docs/code-taste/`.
5. Apply the rule to the current work when relevant.

Without the marker, feedback applies only to the current task.

## Reporting Back

After implementation, briefly mention taste-relevant decisions, especially when:

- a written convention was followed,
- nearby code was used as precedent,
- no convention existed and a local choice was made,
- or the agent paused to ask before creating a high-impact convention.
