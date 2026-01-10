# Phase 1: Adjust Build Failure Criteria

## Goal

Prevent the CI build from failing due to formatting issues, while ensuring it still fails for TypeScript compilation errors and critical linting issues.

## Tasks

### Task 1 - Update package.json scripts [x]

#### Task 1.1 - Modify `validate` script to exclude formatting from the blocking check [x]

#### Task 1.2 - Ensure `validate:fix` still functions for developers [x]

### Task 2 - Verify CI configuration [x]

#### Task 2.1 - Review `.github/workflows/main.yaml` to ensure it uses the updated `check` script [x]

#### Task 2.2 - Review `.github/workflows/pr-validation.yml` to ensure it uses the updated `check` script [x]

## Dependencies

- None

## Expected Result

The command `yarn validate` will now exit with an error ONLY if there are TypeScript errors or Biome linting errors, ignoring any formatting discrepancies.

## Next Steps

- After user confirmation, implement the changes in `package.json`.
