# Guide 0008: Code Quality and Validation

## Overview

This guide covers the comprehensive code quality and validation system implemented in the Best Shot project. The system ensures consistent code style, catches errors early, and prevents broken builds from reaching production.

## Tools Stack

### Biome.js - Primary Quality Tool
- **Linter**: Fast JavaScript/TypeScript linting with 200+ rules
- **Formatter**: Consistent code formatting (replaces Prettier)
- **Import Sorter**: Automatic import organization
- **Configuration**: Centralized in `biome.json`

### TypeScript - Type Safety
- **Strict Configuration**: Enforces type safety across the codebase
- **Build-time Validation**: Catches type errors before deployment
- **IDE Integration**: Real-time error highlighting

### Husky - Git Hooks
- **Pre-commit Hooks**: Runs quality checks before commits
- **Cross-platform**: Works on Windows, Mac, and Linux
- **Automatic Setup**: Configured via `yarn install`

### lint-staged - Efficient Processing
- **Staged Files Only**: Only processes files being committed
- **Fast Execution**: Avoids checking entire codebase on each commit
- **Selective Processing**: Different rules for different file types

## Configuration Files

### biome.json - Main Configuration
```json
{
  "files": {
    "includes": ["src/**/*", "*.ts", "*.tsx", "*.js", "*.jsx", "*.json"],
    "ignore": ["**/*.{test,spec}.{ts,tsx,js,jsx}"]
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": { "noExplicitAny": "warn" },
      "correctness": { "noUnusedImports": "error" }
    }
  },
  "formatter": {
    "indentStyle": "tab",
    "lineWidth": 100,
    "quoteStyle": "double"
  }
}
```

### .lintstagedrc.js - Pre-commit Processing
```javascript
module.exports = {
  "**/*.{ts,tsx,js,jsx}": ["yarn check:fix"],
  "**/*.{json,md}": ["yarn format:fix"]
};
```

### .husky/pre-commit - Git Hook
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint-staged
```

## Package.json Scripts

### Quality Commands
- `yarn check` - Run linting + TypeScript validation
- `yarn check:fix` - Auto-fix issues + run validation
- `yarn lint` - Biome linting only
- `yarn format` - Biome formatting only
- `yarn typecheck` - TypeScript validation only

### Development Integration
All scripts use Biome's configuration automatically, ensuring consistency across:
- Local development
- Pre-commit hooks
- CI/CD pipelines

## Quality Rules

### TypeScript Rules
- **Strict Mode**: Enabled for maximum type safety
- **No Implicit Any**: Warns about untyped variables
- **Unused Imports**: Automatically removed
- **No Unused Variables**: Prevents dead code

### Biome Linting Rules
- **Correctness**: Catches logical errors and bugs
- **Performance**: Identifies performance anti-patterns
- **Security**: Prevents security vulnerabilities
- **Accessibility**: Ensures WCAG compliance
- **Complexity**: Warns about overly complex code

### Formatting Standards
- **Indentation**: Tabs (2 spaces width)
- **Line Length**: 100 characters maximum
- **Quotes**: Double quotes for strings
- **Semicolons**: Always required
- **Trailing Commas**: ES5 style

## Test File Exclusion

Test files are intentionally excluded from quality checks to allow more flexible patterns:

### Excluded Patterns
- `**/*.test.{ts,tsx,js,jsx}`
- `**/*.spec.{ts,tsx,js,jsx}`

### Rationale
- Test files often need relaxed linting (e.g., `any` types for mocks)
- Focus quality checks on production code
- Faster pre-commit execution

## Development Workflow

### First-Time Setup
```bash
# Install dependencies (sets up Husky automatically)
yarn install

# Verify hooks are installed
ls .husky/
```

### Daily Development
1. **Write Code**: Normal development in any editor
2. **Commit Changes**: `git commit -m "feature: add new component"`
3. **Automatic Checks**: Pre-commit hook runs quality checks
4. **Auto-fixing**: Formatting issues fixed automatically
5. **Manual Fix**: TypeScript errors must be resolved manually

### Manual Quality Checks
```bash
# Check all quality rules
yarn check

# Fix auto-fixable issues
yarn check:fix

# Only check types
yarn typecheck
```

## CI/CD Integration

### GitHub Actions Validation
All deployment workflows include quality validation:
```yaml
- name: Run code quality checks
  run: yarn check
```

### Environment Variables
CI environments disable Husky to prevent conflicts:
```yaml
env:
  HUSKY: 0
```

## Bypassing Quality Checks

### Emergency Commits
```bash
# Skip pre-commit hooks
git commit --no-verify -m "emergency fix"

# Disable Husky temporarily
HUSKY=0 git commit -m "bulk update"
```

### When to Bypass
- ⚠️ **Emergency hotfixes** (rare)
- 📦 **Bulk dependency updates**
- 🔄 **Automated commits** (release scripts)

**Important**: Bypassed commits will still be validated in CI/CD.

## Troubleshooting

### Common Issues

#### Pre-commit Hooks Not Running
```bash
# Reinstall hooks
rm -rf .husky
yarn install

# Check permissions (Unix systems)
chmod +x .husky/pre-commit
```

#### Biome Errors
```bash
# Check configuration syntax
yarn biome check --config-path ./biome.json

# Reset configuration cache
rm -rf node_modules/.cache/biome
```

#### TypeScript Errors in CI
```bash
# Run local type checking
yarn typecheck

# Check for missing type definitions
yarn add -D @types/package-name
```

### Performance Issues

#### Slow Pre-commit Hooks
- Check if running on entire codebase instead of staged files
- Verify `.lintstagedrc.js` configuration
- Consider excluding large generated files

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" yarn check
```

## Best Practices

### Code Organization
- Keep functions small and focused
- Use meaningful variable names
- Add JSDoc comments for complex logic
- Prefer explicit types over `any`

### Git Workflow
- Make small, focused commits
- Write descriptive commit messages
- Fix quality issues before pushing
- Use feature branches for development

### Configuration Management
- Keep quality rules consistent across team
- Update tools regularly for security patches
- Document any rule exceptions
- Review quality metrics periodically

## Integration with IDEs

### VS Code Setup
Install these extensions for optimal experience:
- Biome (official extension)
- TypeScript + JavaScript
- Error Lens (for inline error display)

### Settings Configuration
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": true,
    "quickfix.biome": true
  }
}
```

## Metrics and Monitoring

### Quality Metrics
- **Build Success Rate**: Should be >95%
- **Pre-commit Success**: Track hook effectiveness
- **Type Safety**: Monitor `any` usage trends
- **Code Complexity**: Review complexity warnings

### Continuous Improvement
- Regular tool updates
- Rule effectiveness reviews
- Team feedback incorporation
- Performance optimization

## Related Documentation

- [Guide 0007: CI/CD and Deployment](./0007-ci-cd-deployment.md)
- [Biome.js Documentation](https://biomejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Husky Documentation](https://typicode.github.io/husky/)