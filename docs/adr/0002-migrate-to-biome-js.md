# ADR 0002: Migrate from ESLint & Prettier to Biome.js

## Status
Proposed

## Context

Currently, Best Shot uses ESLint for linting and Prettier for code formatting. Our current setup includes:
- ESLint v8.57.0 with minimal plugins (react-refresh, unused-imports)  
- Prettier with basic configuration (tabs, tabWidth: 2)
- No comprehensive linting rules or code quality enforcement

### Problems with Current Setup
1. **Performance**: Separate tools slow down development workflow
2. **Configuration Complexity**: Managing two different tools and configs
3. **Incomplete Coverage**: Missing comprehensive linting rules for code quality
4. **Build Pipeline**: Slower CI/CD due to running multiple tools

## Research Findings: Biome.js in 2025

### Performance Advantages
- **25x faster formatting** than Prettier (Rust + multi-threading)
- **15x faster linting** than ESLint
- **80% faster build pipelines** reported by migrated projects
- Single tool reduces toolchain complexity

### Features & Capabilities
- **Unified Toolchain**: Single tool for linting + formatting
- **333 total rules** across multiple categories
- **Single Configuration**: One `biome.json` file vs separate configs
- **Better Error Messages**: Clear, actionable feedback
- **Automatic Migration**: Built-in commands for ESLint/Prettier migration

### Language Support (2025)
✅ **Fully Supported**: JavaScript, TypeScript, JSX, TSX, JSON, GraphQL
⚠️ **Partial Support**: Vue, Astro, Svelte  
❌ **Not Supported**: HTML, Markdown, SCSS

## Decision

**Completely replace ESLint and Prettier with Biome.js** for all linting and formatting in Best Shot.

### Rationale
1. **Performance**: Significantly faster development experience (25x formatting, 15x linting)
2. **Complete Coverage**: Our codebase is 100% TypeScript/React/JSON (fully supported)
3. **Simplification**: Single tool, single config, eliminate toolchain complexity
4. **No Unsupported Files**: We don't use CSS/SCSS/HTML/Markdown files that need formatting
5. **Future-Ready**: Active development, growing ecosystem

## Implementation Plan

### Phase 1: Complete Replacement (Day 1)
1. **Remove old tools**: Uninstall ESLint and Prettier packages
2. **Install Biome**: Add @biomejs/biome as dev dependency
3. **Migrate configs**: Run automatic migration commands
4. **Update scripts**: Replace all lint/format commands with Biome
5. **Update CI/CD**: Switch GitHub Actions to Biome commands

### Phase 2: Configuration & Integration (Day 2-3)
1. **Configure VS Code**: Install Biome extension, update workspace settings
2. **Set up pre-commit hooks**: Replace ESLint/Prettier hooks with Biome
3. **Team setup**: Ensure all developers have Biome VS Code extension
4. **Test workflow**: Verify linting, formatting, and CI/CD pipeline

### Phase 3: Optimization (Week 1)
1. **Fine-tune rules**: Adjust severity levels based on team feedback
2. **Performance validation**: Measure speed improvements
3. **Documentation**: Update CLAUDE.md with new commands
4. **Team training**: Brief session on new commands and workflow

## Complete Migration Strategy

### 1. Remove Old Dependencies
```bash
# Remove ESLint and Prettier completely
yarn remove eslint eslint-plugin-react-refresh eslint-plugin-unused-imports prettier

# Install Biome
yarn add --dev @biomejs/biome
```

### 2. Migrate Configurations
```bash
# Automatic migration (will create biome.json)
npx @biomejs/biome migrate eslint --write
npx @biomejs/biome migrate prettier --write

# Remove old config files
rm .prettierrc
rm .eslintrc* (if exists)
```

### 3. Update Package.json Scripts
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

### 4. Update CI/CD Pipeline
Replace existing lint/format steps with single Biome command:
```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: yarn install

- name: Biome Check (Lint + Format)
  run: yarn ci:check
```
```

## Consequences

### Positive
- **Faster Development**: 25x faster formatting, 15x faster linting
- **Simplified Toolchain**: Single tool, single config
- **Better DX**: Superior error messages and IDE integration
- **Future-Proof**: Active development, growing adoption

### Negative
- **Learning Curve**: Team needs to learn new tool and commands
- **Rule Differences**: Some ESLint rules may not have exact equivalents
- **Ecosystem Maturity**: Newer tool, smaller plugin ecosystem
- **Migration Risk**: Potential temporary disruption during switch

### Mitigation Strategies
- **Rapid Migration**: Complete switch in 1-3 days to minimize disruption
- **Documentation**: Comprehensive guides and team training materials
- **Performance Focus**: Immediate speed benefits offset learning curve
- **Team Support**: Dedicated migration assistance and troubleshooting

## Success Metrics

- **Performance**: Measure lint/format execution time improvements
- **Developer Satisfaction**: Survey team on DX improvements  
- **Code Quality**: Track rule violation trends
- **Build Time**: Monitor CI/CD pipeline performance

## Related Documents
- [Styling Guide 0001](../guides/0001-styling-guide.md)
- [CLAUDE.md Development Commands](/CLAUDE.md)

---

**Decision Date**: 2025-01-24  
**Review Date**: 2025-04-24 (3 months)