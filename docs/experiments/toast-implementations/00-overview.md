# Toast Implementation Experiment

## 🎯 Objective

Compare three different approaches for implementing a global toast notification system in our React application to determine which provides the best developer experience, performance, and maintainability.

## 🤔 The Problem

We need a toast notification system that:
- Can be triggered from any component in the app
- Shows one toast at a time (no chaos)
- Integrates with MUI theming
- Works with React Query error handling
- Sends errors to Sentry for monitoring

The fundamental challenge: **How do we make a global UI component accessible without over-engineering?**

## 🧪 The Experiment: Three Approaches

### 1. Context API (Built-in React)
**Hypothesis:** Familiar pattern, but might feel over-engineered for a simple toast.

### 2. Zustand (External Library)
**Hypothesis:** Lightweight state management without Provider overhead.

### 3. useSyncExternalStore (React 18 API)
**Hypothesis:** Official React solution for external stores, no deps needed.

## 📝 Documentation Strategy: Hybrid Approach

For each implementation, we'll document in **three phases**:

### Phase 1: BEFORE (Hypothesis)
- Why we think this might work
- Expected benefits
- Expected challenges
- Predictions

### Phase 2: DURING (Live Findings)
- Setup experience
- Integration friction
- Unexpected issues
- Time tracking
- Code snippets of gotchas

### Phase 3: AFTER (Summary)
- What went well
- What was painful
- Performance metrics
- Final thoughts

### Phase 4: COMPARISON (Final Decision)
- Side-by-side comparison table
- Winner declaration
- When to use each approach
- Recommendations for future global UIs

## ✅ Success Criteria

All three implementations must:
- ✅ Provide the same API: `toast.showError()`, `toast.showSuccess()`, etc.
- ✅ Integrate with MUI Snackbar + Alert components
- ✅ Work in React Query `onError` callbacks
- ✅ Be plug-and-play (easy to switch between them)
- ✅ Support Sentry integration

## 📊 Evaluation Metrics

| Metric | Description |
|--------|-------------|
| **Setup Time** | How long to get first toast working |
| **Lines of Code** | Total implementation size |
| **Bundle Size** | Added KB to production bundle |
| **DevEx** | How pleasant to use (subjective) |
| **Testability** | How easy to mock/test |
| **Learning Curve** | How much new knowledge required |
| **Scalability** | Can we add modals, drawers easily? |

## 🗂️ File Structure

```
src/domains/ui-system/
├── global-ui/                    # Approach 1: Context
├── global-ui-zustand/            # Approach 2: Zustand
└── global-ui-external/           # Approach 3: useSyncExternalStore

docs/experiments/toast-implementations/
├── 00-overview.md                # This file
├── 01-context.md                 # Context approach documentation
├── 02-zustand.md                 # Zustand approach documentation
├── 03-external-store.md          # External store documentation
└── 04-final-comparison.md        # Final decision & comparison
```

## 🚀 Implementation Order

1. **Context API** - Start with the familiar
2. **Zustand** - Explore the popular alternative
3. **useSyncExternalStore** - Try the React 18 solution

## 📅 Timeline

- **Hypothesis Writing:** 15 minutes (all three)
- **Implementation:** ~1 hour each (with live notes)
- **Final Comparison:** 30 minutes
- **Total:** ~4 hours

---

**Let the experiment begin!** 🧪


