# Guide 0003: Biome.js Complete Migration Challenges & Solutions

## Overview

This guide documents **potential challenges** when **completely replacing** ESLint and Prettier with Biome.js, along with **practical solutions** for the Best Shot project.

## Updated Migration Scope

**✅ Complete Biome.js Adoption**:
- No CSS/SCSS/HTML/Markdown files to worry about
- 100% TypeScript/React/JSON codebase (fully supported)
- Complete removal of ESLint and Prettier
- Single tool, single configuration

## Challenge Categories

### 🔴 **Critical Challenges** (Must Address)
### 🟡 **Medium Challenges** (Should Address)  
### 🟢 **Minor Challenges** (Nice to Address)

---

## 🔴 Critical Challenges

### 1. ~~Language Support Limitations~~ ✅ RESOLVED

**Previous Problem**: Biome.js doesn't support HTML/Markdown files
**Current Status**: ✅ **Not applicable** - We don't have these file types that need formatting

| File Type | Support | Impact | Best Shot Usage |
|-----------|---------|--------|-----------------|
| TypeScript/React | ✅ Full | None | ✅ Primary codebase |
| JSON | ✅ Full | None | ✅ Config files only |
| HTML | ❌ None | None | ❌ Not used |
| Markdown | ❌ None | None | ❌ Not used |
| SCSS/CSS | ❌ None | None | ❌ We use CSS-in-JS |

**Solution**: ✅ **No action needed** - Complete Biome adoption possible

### 2. Complete Tool Removal

**Problem**: Need to completely remove ESLint and Prettier from the project

| Component | Action Required | Risk Level |
|-----------|----------------|------------|
| Package dependencies | Remove from package.json | Low |
| VS Code extensions | Disable/uninstall | Low |
| Configuration files | Delete `.prettierrc`, etc. | Low |
| CI/CD pipeline | Update GitHub Actions | Medium |
| Team workflow | Retrain on new commands | Medium |

**Solution**: Systematic removal and replacement
```bash
# 1. Remove all old dependencies
yarn remove eslint eslint-plugin-react-refresh eslint-plugin-unused-imports prettier

# 2. Remove config files
rm .prettierrc
rm .eslintrc* # if exists

# 3. Install Biome
yarn add --dev @biomejs/biome
```

### 3. Team Learning Curve  

**Problem**: Team needs to learn new tool and commands quickly

**Solution**: Rapid migration with intensive support
1. **Day 1**: Complete migration and team notification
2. **Day 2-3**: Hands-on support and troubleshooting
3. **Week 1**: Team comfortable with new workflow

**Training Materials**:
- Quick command reference guide
- VS Code setup checklist
- Migration troubleshooting guide
- Immediate support during transition

---

## 🟡 Medium Challenges

### 4. Configuration Differences

**Problem**: Biome configuration syntax differs from ESLint/Prettier

| Tool | Config Format | Example |
|------|---------------|---------|
| ESLint | JavaScript/JSON | `rules: { "no-unused-vars": "error" }` |
| Biome | JSON only | `"noUnusedVariables": "error"` |
| Prettier | JSON/JavaScript | `{ "tabWidth": 2 }` |
| Biome | JSON schema | `"indentWidth": 2` |

**Solution**: Use migration commands + manual adjustment
```bash
# Automatic migration
npx @biomejs/biome migrate eslint --write
npx @biomejs/biome migrate prettier --write

# Manual cleanup and project-specific rules
```

### 5. Rule Behavior Differences

**Problem**: Some rules behave differently between ESLint and Biome

| Scenario | ESLint Behavior | Biome Behavior | Solution |
|----------|----------------|----------------|----------|
| Unused imports | Manual plugin | Built-in rule | Use `noUnusedImports` |
| React hooks | External plugin | Built-in support | Use `useExhaustiveDependencies` |
| TypeScript any | Various rules | `noExplicitAny` | Adjust severity levels |

**Solution**: Rule mapping and gradual adjustment
```json
// biome.json - Start with warnings, promote to errors
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "warn" // Start lenient, then "error"
      }
    }
  }
}
```

### 6. CI/CD Pipeline Updates

**Problem**: Existing CI/CD workflows use ESLint and Prettier

**Before** (Multiple tools):
```yaml
- name: Lint with ESLint
  run: npm run lint
- name: Format Check with Prettier
  run: npm run format:check
```

**After** (Single tool):
```yaml
- name: Biome Check (Lint + Format)
  run: npm run ci:check
```

**Solution**: Simplified single-command CI/CD
```json
// package.json
{
  "scripts": {
    "ci:check": "biome ci ./src"
  }
}
```

**Benefits**: Faster CI/CD with single tool execution

### 7. VS Code Extension Conflicts

**Problem**: Multiple formatter extensions can conflict

**Solution**: Complete Biome setup, disable old extensions
```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "eslint.enable": false, // Disable ESLint extension  
  "prettier.enable": false, // Disable Prettier extension
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

**Team Action**: Uninstall ESLint and Prettier VS Code extensions

---

## 🟢 Minor Challenges

### 8. Formatting Differences

**Problem**: Biome's default formatting may differ from current Prettier setup

| Setting | Prettier Default | Biome Default | Best Shot Config |
|---------|------------------|---------------|------------------|
| Indentation | 2 spaces | 1 tab | ✅ Tabs (matches) |
| Quote Style | Double quotes | Double quotes | ✅ Matches |
| Semicolons | Always | Always | ✅ Matches |
| Trailing Commas | ES5 | ES5 | ✅ Matches |

**Solution**: Our current Prettier config aligns well with Biome defaults - minimal impact

### 9. Editor Integration Setup

**Problem**: Team needs to install and configure Biome VS Code extension

**Solution**: Provide team setup checklist
1. Install Biome VS Code extension
2. Update workspace settings
3. Disable conflicting extensions
4. Test formatting and linting

### 10. Performance Monitoring

**Problem**: Need to measure performance improvements

**Solution**: Benchmark before/after migration
```bash
# Before migration
time npm run lint    # ESLint timing
time npm run format  # Prettier timing

# After migration  
time npm run check   # Biome timing (should be ~15x faster)
```

---

## Risk Mitigation Strategies

### 1. **Gradual Migration Approach**
- Start with new files only
- Migrate one domain at a time
- Keep old tools available during transition

### 2. **Rollback Plan**
```json
// Keep ESLint/Prettier configs in git history
// Rollback script
{
  "scripts": {
    "rollback:eslint": "git checkout HEAD~1 -- .eslintrc.js",
    "rollback:prettier": "git checkout HEAD~1 -- .prettierrc"
  }
}
```

### 3. **Team Communication**
- Announce migration timeline
- Provide training materials
- Set up help channels for questions

### 4. **Monitoring & Feedback**
- Track performance improvements
- Collect team feedback weekly
- Adjust rules based on real usage

---

## Common Issues & Quick Fixes

### Issue: Biome not formatting in VS Code
```json
// Solution: Check VS Code settings
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true
}
```

### Issue: Rules too strict initially
```json
// Solution: Use warnings first
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "warn" // Change to "error" later
      }
    }
  }
}
```

### Issue: Import organization conflicts
```json
// Solution: Enable organizeImports
{
  "organizeImports": {
    "enabled": true
  }
}
```

---

## Success Criteria

### Week 1 Success Metrics
- [ ] Biome installed and configured
- [ ] Basic rules working without errors
- [ ] Team can format and lint new files

### Week 2 Success Metrics  
- [ ] All TypeScript/React files migrated
- [ ] CI/CD pipeline updated
- [ ] No formatting conflicts

### Week 3 Success Metrics
- [ ] Performance improvements measured
- [ ] Team comfortable with new workflow
- [ ] Old tools removed from project

---

## Escalation Plan

If challenges become blockers:

1. **Technical Issues**: 
   - Check Biome GitHub issues
   - Consult official documentation
   - Consider community Discord/forums

2. **Team Adoption Issues**:
   - Extended training sessions
   - Pair programming sessions
   - Temporary dual-tool approach

3. **Performance Issues**:
   - Profile Biome configuration
   - Optimize rule selection
   - Consider rule subset approach

## Related Documents
- [ADR 0002: Migrate to Biome.js](../adr/0002-migrate-to-biome-js.md)
- [Guide 0002: Biome.js Starter Configuration](./0002-biome-js-starter-configuration.md)