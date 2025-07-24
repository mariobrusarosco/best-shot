# Guide 0004: Step-by-Step Biome.js Implementation

## Overview

This guide provides **exact commands and steps** to completely replace ESLint and Prettier with Biome.js in the Best Shot project. Follow these steps in order for a smooth migration.

## Pre-Migration Checklist

- [ ] Commit all current changes to git
- [ ] Ensure all team members are aware of migration timing
- [ ] Backup current `.prettierrc` configuration (for reference)
- [ ] Verify VS Code Biome extension is available

---

## Step 1: Remove Old Dependencies

### 1.1 Remove ESLint and Prettier packages
```bash
yarn remove eslint eslint-plugin-react-refresh eslint-plugin-unused-imports prettier
```

### 1.2 Remove configuration files
```bash
# Remove Prettier config
rm .prettierrc

# Remove ESLint config (if exists)
rm .eslintrc*
rm eslint.config.*
```

### 1.3 Verify removal
```bash
# Check package.json - these should be gone
grep -E "(eslint|prettier)" package.json
```

---

## Step 2: Install and Configure Biome

### 2.1 Install Biome.js
```bash
yarn add --dev @biomejs/biome
```

### 2.2 Initialize Biome configuration
```bash
# Create basic biome.json
npx @biomejs/biome init
```

### 2.3 Replace biome.json with starter configuration
Create `/home/mario/coding/best-shot/biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "include": ["src/**/*", "*.ts", "*.tsx", "*.js", "*.jsx", "*.json"],
    "ignore": [
      "node_modules/**",
      "dist/**", 
      "build/**",
      "coverage/**",
      "*.min.js",
      "public/**"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error",
        "useExhaustiveDependencies": "warn",
        "useHookAtTopLevel": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noArrayIndexKey": "warn",
        "useAwait": "error"
      },
      "style": {
        "useConst": "error",
        "useTemplate": "warn",
        "noNegationElse": "warn",
        "useCollapsedElseIf": "warn"
      },
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn",
        "noBannedTypes": "error",
        "noUselessThisAlias": "error"
      },
      "performance": {
        "noAccumulatingSpread": "warn",
        "noDelete": "error"
      },
      "security": {
        "noDangerouslySetInnerHtml": "error",
        "noGlobalObjectCalls": "error"
      },
      "a11y": {
        "noAriaUnsupportedElements": "error",
        "noBlankTarget": "error",
        "useAltText": "error",
        "useAriaPropsForRole": "error",
        "useValidAriaProps": "error"
      },
      "nursery": {
        "useSortedClasses": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "always",
      "arrowParentheses": "always"
    }
  },
  "json": {
    "formatter": {
      "indentStyle": "tab",
      "indentWidth": 2
    }
  }
}
```

---

## Step 3: Update Package.json Scripts

### 3.1 Remove old scripts
Delete these scripts from `package.json` (if they exist):
```json
// DELETE these lines from package.json scripts section
"eslint": "...",
"prettier": "...",
"format:check": "...",
"lint:check": "..."
```

### 3.2 Add Biome scripts
Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "lint": "biome lint ./src",
    "lint:fix": "biome lint --write ./src",
    "format": "biome format ./src", 
    "format:fix": "biome format --write ./src",
    "check": "biome check ./src",
    "check:fix": "biome check --write ./src",
    "ci:check": "biome ci ./src"
  }
}
```

---

## Step 4: VS Code Setup

### 4.1 Install Biome VS Code extension
```bash
# Command Palette: Extensions: Install Extensions
# Search for: "Biome"
# Install: "biomejs.biome"
```

### 4.2 Update VS Code workspace settings
Create/update `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "eslint.enable": false,
  "prettier.enable": false,
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### 4.3 Disable old extensions
Disable these VS Code extensions:
- ESLint (ms-vscode.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

---

## Step 5: Test Migration

### 5.1 Test formatting
```bash
# Test format command
yarn format

# Test format with auto-fix
yarn format:fix
```

### 5.2 Test linting
```bash
# Test lint command
yarn lint

# Test lint with auto-fix
yarn lint:fix
```

### 5.3 Test combined check
```bash
# Test combined lint + format
yarn check

# Test combined with auto-fix
yarn check:fix
```

### 5.4 Test CI command
```bash
# Test CI command (what will run in GitHub Actions)
yarn ci:check
```

---

## Step 6: Update CI/CD Pipeline

### 6.1 Update GitHub Actions workflow
Find your CI workflow file (likely `.github/workflows/ci.yml` or similar) and update the lint/format steps:

**Before**:
```yaml
- name: Lint with ESLint
  run: yarn lint

- name: Format check with Prettier  
  run: yarn format:check
```

**After**:
```yaml
- name: Biome Check (Lint + Format)
  run: yarn ci:check
```

---

## Step 7: Update Documentation

### 7.1 Update CLAUDE.md
Update the development commands section in `CLAUDE.md`:

**Before**:
```markdown
## Development Commands
- `yarn lint` - Run ESLint
- `yarn format:check` - Check Prettier formatting
```

**After**:
```markdown
## Development Commands  
- `yarn lint` - Run Biome linting
- `yarn format` - Run Biome formatting
- `yarn check` - Run both linting and formatting
- `yarn check:fix` - Auto-fix linting and formatting issues
```

---

## Step 8: Team Migration

### 8.1 Team notification
Send team notification with:
- Migration timeline
- New VS Code extension requirements
- New command reference
- Support contact for issues

### 8.2 Team setup checklist
Each team member should:
- [ ] Pull latest changes with Biome configuration
- [ ] Run `yarn install` to get Biome dependency
- [ ] Install Biome VS Code extension
- [ ] Disable ESLint and Prettier VS Code extensions
- [ ] Update their workspace settings
- [ ] Test formatting with `yarn check:fix`

---

## Step 9: Verification & Cleanup

### 9.1 Verify complete migration
```bash
# Check no old dependencies remain
yarn list | grep -E "(eslint|prettier)"

# Check new commands work
yarn check:fix

# Check VS Code formatting works (Ctrl+Shift+F)
```

### 9.2 Clean up old files
```bash
# Remove any remaining config files
find . -name ".eslintrc*" -not -path "./node_modules/*" -delete
find . -name "prettier.config.*" -not -path "./node_modules/*" -delete
```

### 9.3 Commit migration
```bash
git add .
git commit -m "feat: migrate from ESLint/Prettier to Biome.js

- Remove ESLint and Prettier dependencies
- Add @biomejs/biome with comprehensive rule set
- Update package.json scripts for Biome commands
- Configure VS Code workspace for Biome
- Update CI/CD pipeline to use single Biome check

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Troubleshooting Common Issues

### Issue: Biome not working in VS Code
**Solution**:
1. Restart VS Code
2. Check Biome extension is installed and enabled
3. Verify `.vscode/settings.json` has correct configuration
4. Check VS Code output panel for Biome errors

### Issue: Formatting conflicts between developers
**Solution**:
1. Ensure all team members have same `biome.json` configuration
2. Verify VS Code settings are consistent
3. Run `yarn check:fix` to standardize formatting

### Issue: CI/CD pipeline fails
**Solution**:
1. Verify `yarn ci:check` works locally
2. Check GitHub Actions has `yarn install` step
3. Ensure `biome.json` is committed to repository

### Issue: Rules too strict/lenient
**Solution**:
1. Adjust rule levels in `biome.json`
2. Use `"warn"` initially, promote to `"error"` later
3. Disable problematic rules with `"off"`

---

## Post-Migration Performance Check

After migration, benchmark the performance improvements:

```bash
# Time the new Biome commands
time yarn check

# Compare with old workflow (if available)
# Expected: 15-25x faster than previous ESLint + Prettier
```

Expected performance improvements:
- **Linting**: ~15x faster than ESLint
- **Formatting**: ~25x faster than Prettier  
- **CI/CD**: Single command reduces build time
- **Development**: Instant feedback in VS Code

## Success Criteria

✅ **Migration Complete When**:
- [ ] All old dependencies removed
- [ ] Biome configuration working
- [ ] All team members using Biome in VS Code
- [ ] CI/CD pipeline updated and passing
- [ ] Performance improvements measured
- [ ] No formatting conflicts between developers

## Related Documents
- [ADR 0002: Migrate to Biome.js](../adr/0002-migrate-to-biome-js.md)
- [Guide 0002: Biome.js Starter Configuration](./0002-biome-js-starter-configuration.md)
- [Guide 0003: Migration Challenges & Solutions](./0003-biome-js-migration-challenges.md)