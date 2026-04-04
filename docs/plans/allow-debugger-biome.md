# Plan - Allow Debugger Statements in Biome

## Goal
Modify the Biome configuration to prevent `debugger` statements from being automatically removed on save.

## Phases

### Phase 1: Configuration Update
- **Goal:** Update `biome.json` to change the severity of the `noDebugger` rule.
- **Tasks:**
    - **Task 1.1:** Add `"noDebugger": "warn"` to the `linter.rules.correctness` section in `biome.json`. [x]

### Phase 2: Verification
- **Goal:** Confirm that `debugger` statements are preserved.
- **Tasks:**
    - **Task 2.1:** Run `yarn check` (or Biome CLI) to see if `debugger` emits a warning instead of an error that gets autofixed. []
    - **Task 2.2:** Ask user to try adding a `debugger` and saving the file. []

## Dependencies
- Biome configuration (`biome.json`).

## Expected Result
`debugger` statements will no longer be removed automatically by Biome on save, but will still show a warning in the editor/lint results.

## Next Steps
- Implement Task 1.1.
