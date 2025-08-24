# ADR 0004: Client-Side State Persistence with TanStack Store and localStorage

## Status
Accepted

## Context

Best Shot requires persistent client-side state management for user preferences and UI state that should survive browser sessions. Previously, the application relied solely on in-memory state, leading to poor user experience where settings and UI positions were lost on page refresh.

### Requirements Analysis
- **User Preferences**: Theme settings, notification preferences, display options
- **UI State Persistence**: Floating action button position, sidebar collapse state
- **Performance**: High-frequency updates (like dragging) should not impact performance
- **Cross-Session Persistence**: State should survive browser refreshes and app restarts
- **Graceful Degradation**: App should work even if localStorage is unavailable

### Current State Problems
1. **Lost User Preferences**: Theme and settings reset on every page refresh
2. **Poor UX**: Floating UI elements return to default positions
3. **No State Management**: Scattered useState hooks without centralized state
4. **Performance Issues**: No optimization for high-frequency state updates

## Research Findings: State Persistence Solutions 2025

### Option 1: TanStack Store + localStorage (Recommended)
**Pros:**
- ✅ **Lightweight**: ~2KB bundle size, signal-based reactivity
- ✅ **Performance**: Optimized for minimal re-renders
- ✅ **TypeScript**: Excellent type safety and inference
- ✅ **Framework Agnostic**: Future-proof if we adopt other frameworks
- ✅ **TanStack Ecosystem**: Integrates seamlessly with Query and Router
- ✅ **Manual Persistence**: Full control over when/what to persist

**Cons:**
- ⚠️ **Learning Curve**: New library for the team
- ⚠️ **Manual Integration**: Requires custom localStorage sync logic

### Option 2: Zustand with Persist Middleware
**Pros:**
- ✅ **Mature**: Well-established with large community
- ✅ **Built-in Persistence**: Automatic localStorage sync
- ✅ **DevTools**: Good debugging experience

**Cons:**
- ❌ **Bundle Size**: Larger than TanStack Store (~4KB)
- ❌ **Performance**: More re-renders than signal-based approach
- ❌ **Framework Lock-in**: React-specific

### Option 3: React Context + Custom localStorage Hook
**Pros:**
- ✅ **Native**: Uses built-in React patterns
- ✅ **No Dependencies**: No additional libraries

**Cons:**
- ❌ **Performance**: Context causes unnecessary re-renders
- ❌ **Boilerplate**: Significant custom implementation needed
- ❌ **Error Handling**: Manual localStorage error management
- ❌ **Type Safety**: Requires extensive custom typing

## Decision

**Adopt TanStack Store with optimized localStorage persistence** for all client-side state management in Best Shot.

### Rationale
1. **Performance Match**: Perfect for sports platform with real-time UI interactions (draggable FAB)
2. **TanStack Ecosystem**: Natural fit with existing Query and Router usage
3. **Type Safety**: Superior TypeScript integration compared to alternatives
4. **Bundle Optimization**: Smallest footprint for performance-critical mobile users
5. **Fine-grained Control**: Manual persistence allows performance optimizations

## Technical Architecture

### Store Structure
```typescript
interface UIState {
  fab: {
    position: { x: number; y: number };
    isDragging: boolean;  // Not persisted (temporary state)
    isVisible: boolean;
  };
  sidebar: {
    isCollapsed: boolean;
  };
  theme: {
    mode: "light" | "dark";
  };
}
```

### Persistence Strategy
```typescript
// Performance-optimized persistence
export const uiActions = {
  setFabPosition: (position: { x: number; y: number }, shouldPersist = false) => {
    // Update in-memory state immediately
    uiStore.setState(/* ... */);
    
    // Only persist when explicitly requested (e.g., drag end)
    if (shouldPersist) {
      persistState();
    }
  }
};
```

### Implementation Patterns

#### 1. **Performance-First Persistence**
- **High-frequency updates**: In-memory only during operations (dragging)
- **Event-based persistence**: Save to localStorage on operation completion
- **Immediate persistence**: For low-frequency, important state changes

#### 2. **Graceful Error Handling**
```typescript
const loadPersistedState = (): UIState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
  } catch (error) {
    console.warn("Failed to load state:", error);
    return defaultState;
  }
};
```

#### 3. **State Merging Strategy**
- **Default values**: Always provide fallbacks for new state properties
- **Version compatibility**: Merge persisted state with current defaults
- **Migration support**: Handle schema changes gracefully

## Implementation Details

### Phase 1: Core Infrastructure (Completed)
1. ✅ **TanStack Store Setup**: Created `src/stores/ui-store.ts`
2. ✅ **React Integration**: Created `src/hooks/use-ui-store.ts`
3. ✅ **Performance Optimization**: Implemented selective persistence
4. ✅ **Error Handling**: Added try/catch for localStorage operations

### Phase 2: Floating Action Button (Completed)  
1. ✅ **Draggable FAB**: Position persistence with performance optimization
2. ✅ **Global Integration**: Added to root layout for all pages
3. ✅ **Mobile Support**: Touch events with proper gesture handling
4. ✅ **Viewport Constraints**: Automatic repositioning on window resize

### Phase 3: Future Extensions (Planned)
1. **User Preferences**: Theme, language, notification settings
2. **Dashboard State**: Widget positions, filter preferences
3. **Form Drafts**: Temporary form data persistence
4. **Feature Flags**: Client-side feature toggle persistence

## Consequences

### Positive
- **Better UX**: User preferences and UI state persist across sessions
- **Performance**: Optimized persistence prevents high-frequency localStorage writes
- **Developer Experience**: Type-safe state management with clear patterns
- **Maintainability**: Centralized state logic with consistent error handling
- **Scalability**: Easy to extend for new persistent state requirements

### Negative
- **Complexity**: Additional abstraction layer for state management
- **Storage Limits**: localStorage has ~5-10MB limits (not a concern for UI state)
- **Browser Support**: Requires fallback handling for localStorage unavailability
- **Testing**: Requires mocking localStorage in test environments

### Mitigation Strategies
- **Documentation**: Comprehensive guides for team onboarding
- **Patterns**: Established conventions for when/how to persist state
- **Monitoring**: Console warnings for localStorage failures
- **Fallbacks**: App remains functional even without persistence

## Success Metrics

### User Experience
- **State Persistence**: UI positions and preferences survive browser refresh
- **Performance**: Smooth drag interactions without UI lag
- **Reliability**: Zero data loss for important user preferences

### Developer Experience  
- **Implementation Speed**: Time to add new persistent state
- **Bug Reduction**: Fewer state-related bugs due to centralized management
- **Code Quality**: Consistent patterns across persistent state features

### Technical Health
- **Bundle Size**: Monitor impact on application size (target: <5KB total)
- **Performance**: Track localStorage operation frequency and timing
- **Error Rates**: Monitor localStorage failure rates and fallback usage

## Storage Strategy

### What to Persist
- ✅ **UI Preferences**: FAB position, sidebar state, theme
- ✅ **User Settings**: Language, notifications, display options  
- ✅ **Feature Toggles**: Client-side experimental features
- ❌ **Sensitive Data**: Never persist authentication tokens or personal data
- ❌ **Large Data**: Use IndexedDB for large datasets, not localStorage

### Performance Guidelines
- **High-frequency updates**: In-memory during operations, persist on completion
- **Low-frequency updates**: Persist immediately (theme changes, settings)
- **Batch operations**: Group multiple related updates when possible
- **Debounce**: For rapid successive updates, debounce persistence calls

## Migration Plan

### Current State
- ✅ **FAB Implementation**: Draggable floating action button with position persistence
- ✅ **Store Foundation**: Core infrastructure for UI state management

### Next Steps
1. **User Preferences**: Migrate theme and settings to persistent store
2. **Dashboard State**: Add widget preferences and filter persistence  
3. **Form Drafts**: Implement temporary form data preservation
4. **Analytics**: Track usage patterns to optimize persistence strategy

## Related Documents
- [React Hook Form Guide 0005](../guides/0005-react-hook-form-guide.md) - Form state management
- [TanStack Store Documentation](https://tanstack.com/store/latest/docs/overview)
- [CLAUDE.md Development Commands](/CLAUDE.md#code-quality-biomejs--typescript)

## Examples

### Adding New Persistent State
```typescript
// 1. Extend the UIState interface
interface UIState {
  fab: { /* existing */ };
  newFeature: {
    setting1: boolean;
    setting2: string;
  };
}

// 2. Add action creator
export const uiActions = {
  setNewFeatureSetting: (setting1: boolean) => {
    uiStore.setState(/* ... */);
    persistState(); // Immediate persistence for settings
  }
};

// 3. Use in component
const { state, actions } = useUIStore();
```

---

**Decision Date**: 2025-01-24  
**Review Date**: 2025-07-24 (6 months)  
**Implementation Status**: Phase 1 & 2 Complete, Phase 3 Planned