# AI Agent Instructions

This project builds its code taste over time. Before making implementation changes, AI agents must use the project code taste registry as the source of truth for local conventions.

## Before Coding

1. Identify the kind of work involved: component, hook, styling, screen, state, API/data, tests, or another category.
2. Read the relevant files under `docs/code-taste/`.
3. Follow written project taste first.
4. If no written rule exists, inspect nearby code for precedent.
5. If no nearby precedent exists, choose the smallest reasonable local implementation.
6. Ask before introducing high-impact conventions that future code is likely to copy.

## When To Ask First

Ask the developer before making decisions that establish or significantly affect:

- routing structure
- public vs authenticated screen conventions
- state management patterns
- API/data access patterns
- auth/session behavior
- styling systems or design token strategy
- major dependencies
- broad file organization
- testing strategy

## Code Taste Updates

Do not infer permanent code taste rules from normal conversation, review comments, or casual preferences.

Only update the code taste registry when the developer explicitly starts feedback with:

```txt
[FEEDBACK FOR CODE TASTE]
```

Treat marked feedback as durable project convention. If the feedback is ambiguous, ask a clarifying question before editing the registry. If it conflicts with an existing rule, call out the conflict and ask before replacing it.

## After Coding

Mention any taste-relevant decisions made during the task, especially when a convention was missing and a local precedent was followed or created.
