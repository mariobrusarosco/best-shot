# Code Taste Registry

This registry captures project-specific coding conventions as they are defined during real work.

The goal is not to define every convention up front. The goal is to give developers and AI agents a reliable place to check before coding, and a durable place to store explicit taste decisions when they are made.

## Current Files

- `ai-agent-workflow.md`: the workflow AI agents must follow before coding and when handling taste gaps.

## Future Taste Areas

Create these files only when the project has explicit conventions to record:

- `components.md`
- `hooks.md`
- `styling.md`
- `screens.md`
- `state.md`
- `api-data.md`
- `tests.md`

## Updating This Registry

AI agents must not update this registry from ordinary feedback or interpretation.

Only feedback explicitly marked with the following prefix should become a durable code taste rule:

```txt
[FEEDBACK FOR CODE TASTE]
```

Unmarked feedback applies to the current task only.
