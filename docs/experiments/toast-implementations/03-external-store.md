# Approach 3: useSyncExternalStore

## 📋 Phase 1: BEFORE Implementation (Hypothesis)

### Motivation

`useSyncExternalStore` is a React 18 hook designed specifically for subscribing to external stores. It's the official React solution for integrating with external state without using Context.

We're exploring this because:
- It's the "official" React way for external stores
- Zero dependencies (built into React 18+)
- Used by popular libraries (Zustand, Valtio, react-hot-toast)
- No Provider needed
- Works outside React tree

### Expected Benefits

- ✅ **Zero dependencies** - Built into React 18+
- ✅ **Official solution** - React team's answer to this problem
- ✅ **No Provider** - Works without wrapping app
- ✅ **Concurrent Mode safe** - Designed for React 18+ features
- ✅ **Framework agnostic** - Store is pure JavaScript
- ✅ **SSR compatible** - Has server snapshot support
- ✅ **Educational** - Learn modern React patterns

### Expected Challenges

- ❌ **Manual implementation** - More code than Zustand (no helper library)
- ❌ **Learning curve** - New API, unfamiliar pattern
- ❌ **Boilerplate** - Need to write subscribe/getSnapshot manually
- ❌ **Less ergonomic** - More verbose than Context or Zustand
- ❌ **No DevTools** - No special debugging tools
- ❌ **Requires React 18+** - Not compatible with older React

### Hypothesis

**We believe useSyncExternalStore will be:**
- The **most "correct"** React 18+ solution
- The **most educational** (learn new React API)
- The **most boilerplate-heavy** (manual subscribe logic)
- But the **most performant** (purpose-built for this)

**Prediction:** This will be the hardest to implement but the most satisfying intellectually. We'll appreciate learning the "right way" but miss the simplicity of Zustand.

### Architecture Design

```
External Store (Plain JS)
  ├── State (plain object)
  ├── Listeners (Set of callbacks)
  ├── subscribe(listener) function
  ├── getSnapshot() function
  └── Actions (mutate state + notify)

GlobalSnackbar Component
  └── useSyncExternalStore(subscribe, getSnapshot)

Any Component
  └── Can call store actions directly OR use hook
```

### API Design

```typescript
// Usage in components - Option A (with hook)
import { useToast } from '@/domains/ui-system/global-ui-external';

const toast = useToast();
toast.showError('Failed to save');

// Usage - Option B (direct store access)
import { toastStore } from '@/domains/ui-system/global-ui-external';

toastStore.showError('Failed to save');
```

### Estimated Metrics

| Metric | Estimate |
|--------|----------|
| Setup Time | 40-50 minutes |
| Lines of Code | 100-120 lines |
| Bundle Size | 0 KB (built-in) |
| Files Created | 4-5 files |
| Learning Curve | High (new API) |

---

## 🔨 Phase 2: DURING Implementation (Live Findings)

### Setup Experience

**Time Started:** [To be filled]

#### Step 1: Create External Store
**Duration:** [To be filled]
**Experience:**
- [Notes as we go]
- Need to implement subscribe/getSnapshot pattern
- Need to manage listeners Set

#### Step 2: Wire useSyncExternalStore
**Duration:** [To be filled]
**Gotchas:**
- [Issues encountered]

#### Step 3: Create Actions
**Duration:** [To be filled]
**Surprises:**
- [Unexpected challenges]

#### Step 4: Build Hook Wrapper
**Duration:** [To be filled]
**Notes:**
- [Implementation details]

#### Step 5: First Integration
**Duration:** [To be filled]
**Test case:** Sign-up error handling
**Result:**
- [How it went]

### Code Snippets

**Interesting bits:**
```typescript
// [Add notable code as we write it]
```

**Gotchas:**
```typescript
// [Add problems we solved]
```

### Pain Points

1. **[Issue 1]**
   - Problem: [description]
   - Solution: [how we fixed it]
   - Time lost: [minutes]

2. **[Issue 2]**
   - Problem: [description]
   - Solution: [how we fixed it]
   - Time lost: [minutes]

### Pleasant Surprises

1. **[Good thing 1]**
   - Why it was nice: [description]

2. **[Good thing 2]**
   - Why it was nice: [description]

### Time Tracking

| Task | Estimated | Actual | Diff |
|------|-----------|--------|------|
| Store setup | 15 min | [TBD] | [TBD] |
| Subscribe logic | 10 min | [TBD] | [TBD] |
| Actions | 10 min | [TBD] | [TBD] |
| Hook wrapper | 10 min | [TBD] | [TBD] |
| Component | 10 min | [TBD] | [TBD] |
| Integration | 10 min | [TBD] | [TBD] |
| **TOTAL** | **65 min** | **[TBD]** | **[TBD]** |

---

## 📊 Phase 3: AFTER Implementation (Summary)

### Final Metrics

| Metric | Result |
|--------|--------|
| Actual Setup Time | [TBD] |
| Actual Lines of Code | [TBD] |
| Bundle Size Impact | [TBD] |
| Files Created | [TBD] |

### What Went Well

- ✅ [Thing 1]
- ✅ [Thing 2]
- ✅ [Thing 3]

### What Was Painful

- ❌ [Pain 1]
- ❌ [Pain 2]
- ❌ [Pain 3]

### Hypothesis Validation

| Prediction | Reality | Correct? |
|------------|---------|----------|
| Most "correct" solution | [TBD] | [TBD] |
| Most educational | [TBD] | [TBD] |
| Most boilerplate | [TBD] | [TBD] |
| Most performant | [TBD] | [TBD] |

### Developer Experience (1-10)

| Aspect | Score | Notes |
|--------|-------|-------|
| Setup | [TBD] | [Notes] |
| Usage | [TBD] | [Notes] |
| Testing | [TBD] | [Notes] |
| Debugging | [TBD] | [Notes] |
| **Overall** | **[TBD]** | **[Summary]** |

### Would We Use This in Production?

**Answer:** [TBD]

**Reasoning:**
[To be filled after implementation]

---

## 🎯 Key Takeaways

1. **[Takeaway 1]**
2. **[Takeaway 2]**
3. **[Takeaway 3]**

## 💭 Reflections

[Personal thoughts after completing this approach]

## 🆚 Comparison to Previous Approaches

| Aspect | Context | Zustand | External Store | Winner |
|--------|---------|---------|----------------|--------|
| Setup | [TBD] | [TBD] | [TBD] | [TBD] |
| Usage | [TBD] | [TBD] | [TBD] | [TBD] |
| Bundle | [TBD] | [TBD] | [TBD] | [TBD] |
| Learning | [TBD] | [TBD] | [TBD] | [TBD] |

---

**Status:** 🟡 Hypothesis Written → ⏳ In Progress → ✅ Complete


