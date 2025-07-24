# Guide 0002: Biome.js Starter Configuration for Best Shot

## Overview

This guide provides the **recommended starter configuration** for Biome.js in the Best Shot project, based on our TypeScript + React + MUI architecture. The configuration balances **code quality**, **performance**, and **developer experience**.

## Basic Starter Configuration

### Complete `biome.json` Configuration

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

## Rule Categories Breakdown

### 🔴 **Correctness Rules** (Errors)
**Purpose**: Prevent bugs and incorrect code

| Rule | Level | Description |
|------|-------|-------------|
| `noUnusedVariables` | error | Remove unused variables |
| `noUnusedImports` | error | Remove unused imports |
| `useExhaustiveDependencies` | warn | React Hook dependencies |
| `useHookAtTopLevel` | error | React Hooks at component top |

```tsx
// ✅ CORRECT
const [count, setCount] = useState(0);

useEffect(() => {
  fetchData(count);
}, [count]); // Exhaustive dependencies

// ❌ INCORRECT  
const unusedVariable = "test"; // noUnusedVariables
import { unused } from "./module"; // noUnusedImports
```

### 🟡 **Suspicious Rules** (Warnings)
**Purpose**: Catch potentially problematic patterns

| Rule | Level | Description |
|------|-------|-------------|
| `noExplicitAny` | warn | Avoid `any` type usage |
| `noArrayIndexKey` | warn | Avoid array index as React key |
| `useAwait` | error | Require await in async functions |

```tsx
// ✅ CORRECT
interface Props {
  items: string[]; // Typed instead of any
}

// React lists with proper keys
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ INCORRECT
const data: any = fetchData(); // noExplicitAny
{items.map((item, index) => (
  <div key={index}>{item}</div> // noArrayIndexKey
))}
```

### 🔵 **Style Rules** (Code Consistency)
**Purpose**: Enforce consistent coding patterns

| Rule | Level | Description |
|------|-------|-------------|
| `useConst` | error | Prefer const over let |
| `useTemplate` | warn | Prefer template literals |
| `noNegationElse` | warn | Simplify negated conditions |

```tsx
// ✅ CORRECT  
const API_URL = "https://api.example.com"; // useConst
const message = `Hello ${name}!`; // useTemplate

if (isValid) {
  handleValid();
} else {
  handleInvalid(); // noNegationElse
}

// ❌ INCORRECT
let API_URL = "https://api.example.com"; // useConst
const message = "Hello " + name + "!"; // useTemplate

if (!isValid) {
  handleInvalid();
} else {
  handleValid(); // noNegationElse
}
```

### ⚡ **Performance Rules** 
**Purpose**: Optimize code performance

| Rule | Level | Description |
|------|-------|-------------|
| `noAccumulatingSpread` | warn | Avoid spread in loops |
| `noDelete` | error | Avoid delete operator |

```tsx
// ✅ CORRECT
const result = items.reduce((acc, item) => {
  acc.push(processItem(item));
  return acc;
}, []);

// ❌ INCORRECT  
let result = [];
for (const item of items) {
  result = [...result, processItem(item)]; // noAccumulatingSpread
}
```

### 🔒 **Security Rules**
**Purpose**: Prevent security vulnerabilities

| Rule | Level | Description |
|------|-------|-------------|
| `noDangerouslySetInnerHtml` | error | Prevent XSS attacks |
| `noGlobalObjectCalls` | error | Avoid global object calls |

```tsx
// ✅ CORRECT
<div>{sanitizedContent}</div>

// ❌ INCORRECT
<div dangerouslySetInnerHTML={{__html: userContent}} /> // noDangerouslySetInnerHtml
```

### ♿ **Accessibility Rules**
**Purpose**: Ensure accessible UI components

| Rule | Level | Description |
|------|-------|-------------|
| `noBlankTarget` | error | Require rel="noopener" for _blank |
| `useAltText` | error | Require alt text for images |
| `useValidAriaProps` | error | Validate ARIA properties |

```tsx
// ✅ CORRECT
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
<img src="logo.png" alt="Company Logo" />

// ❌ INCORRECT
<a href="https://example.com" target="_blank"> // noBlankTarget
<img src="logo.png" /> // useAltText
```

## Project-Specific Customizations

### React + TypeScript Optimizations

```json
{
  "linter": {
    "rules": {
      "correctness": {
        "useExhaustiveDependencies": "warn",
        "useHookAtTopLevel": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  }
}
```

### MUI-Specific Considerations

```tsx
// ✅ CORRECT: MUI with Biome
const StyledCard = styled(Surface)(({ theme }) => ({
  backgroundColor: theme.palette.black[800], // No noExplicitAny warning
  padding: theme.spacing(2),
}));

// sx prop usage
<Box sx={{ display: "flex", gap: 2 }}> // No style violations
```

## VS Code Integration

### `.vscode/settings.json`
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

## Package.json Scripts

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

**⚠️ Complete Replacement**: Remove all ESLint and Prettier scripts from package.json after migration.

## Rule Severity Levels

| Level | Description | Action |
|-------|-------------|---------|
| **error** | Blocks commits, fails CI | Must fix |
| **warn** | Shows warnings, CI passes | Should fix |
| **off** | Rule disabled | Ignored |

## Gradual Adoption Strategy

### Week 1: Core Rules
- Enable `recommended: true`
- Focus on `correctness` and `security` rules
- Set most rules to `warn` initially

### Week 2: Style Enforcement  
- Promote `style` rules to `error`
- Add `complexity` rules
- Team review and feedback

### Week 3: Fine-tuning
- Adjust rule levels based on team feedback
- Add project-specific rules
- Performance optimization

## Migration from ESLint Rules

| ESLint Rule | Biome Equivalent | Notes |
|-------------|------------------|--------|
| `no-unused-vars` | `noUnusedVariables` | Direct equivalent |
| `prefer-const` | `useConst` | Direct equivalent |
| `no-array-index-key` | `noArrayIndexKey` | React-specific |
| `exhaustive-deps` | `useExhaustiveDependencies` | React Hooks |

## Next Steps

1. **Install Biome**: `yarn add --dev @biomejs/biome`
2. **Create Config**: Copy the starter `biome.json`
3. **VS Code Setup**: Install Biome extension
4. **Team Training**: Review rules with development team
5. **Gradual Migration**: Start with new files, migrate existing

## Related Documents
- [ADR 0002: Migrate to Biome.js](../adr/0002-migrate-to-biome-js.md)
- [Styling Guide 0001](./0001-styling-guide.md)