# Guide 0007: localStorage Usage with TanStack Store

## Overview

This guide provides practical examples and best practices for using localStorage with TanStack Store in the Best Shot application. It covers when to persist state, how to optimize performance, and common patterns for different types of data.

## Quick Reference

### When to Use Persistent State
✅ **DO persist:**
- User preferences (theme, language, notifications)
- UI state that should survive sessions (FAB position, sidebar state)
- Feature flags and experimental settings
- Form drafts and temporary user input
- Dashboard widget preferences and layouts

❌ **DON'T persist:**
- Authentication tokens or sensitive data
- Large datasets (use IndexedDB instead)
- Temporary loading states
- Real-time data that changes frequently
- Component-specific state that doesn't need persistence

## Core Patterns

### 1. Basic State Persistence

```typescript
// Adding a new persistent state
interface UIState {
  userPreferences: {
    theme: 'light' | 'dark';
    language: string;
    compactMode: boolean;
  };
}

// Action with immediate persistence
const setTheme = (theme: 'light' | 'dark') => {
  uiStore.setState((state) => ({
    ...state,
    userPreferences: {
      ...state.userPreferences,
      theme,
    },
  }));
  
  // Persist immediately for important settings
  persistState();
};
```

### 2. Performance-Optimized Persistence

```typescript
// High-frequency updates (like dragging)
const updateWidgetPosition = (widgetId: string, position: Position, shouldPersist = false) => {
  uiStore.setState((state) => ({
    ...state,
    dashboard: {
      ...state.dashboard,
      widgets: {
        ...state.dashboard.widgets,
        [widgetId]: { ...state.dashboard.widgets[widgetId], position },
      },
    },
  }));
  
  // Only persist when explicitly requested (e.g., drag end)
  if (shouldPersist) {
    persistState();
  }
};

// Usage in component
const handleWidgetDrag = (position: Position) => {
  updateWidgetPosition(widgetId, position, false); // No persistence during drag
};

const handleWidgetDragEnd = (position: Position) => {
  updateWidgetPosition(widgetId, position, true); // Persist final position
};
```

### 3. Form Draft Persistence

```typescript
// Form drafts that should survive accidental navigation
interface UIState {
  formDrafts: {
    [formId: string]: {
      data: Record<string, any>;
      lastSaved: number;
      expiresAt: number;
    };
  };
}

const saveFormDraft = (formId: string, formData: Record<string, any>) => {
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours
  
  uiStore.setState((state) => ({
    ...state,
    formDrafts: {
      ...state.formDrafts,
      [formId]: {
        data: formData,
        lastSaved: now,
        expiresAt,
      },
    },
  }));
  
  persistState();
};

const clearFormDraft = (formId: string) => {
  uiStore.setState((state) => {
    const { [formId]: removed, ...remaining } = state.formDrafts;
    return {
      ...state,
      formDrafts: remaining,
    };
  });
  
  persistState();
};
```

## Component Integration Patterns

### 1. Using the UI Store Hook

```typescript
import { useUIStore } from '@/hooks/use-ui-store';

const ThemeToggle = () => {
  const { state, actions } = useUIStore();
  
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    actions.setTheme(newTheme);
  };
  
  return (
    <Button onClick={() => handleThemeChange(state.theme.mode === 'light' ? 'dark' : 'light')}>
      Current theme: {state.theme.mode}
    </Button>
  );
};
```

### 2. Selective State Subscription

```typescript
import { useStore } from '@tanstack/react-store';
import { uiStore } from '@/stores/ui-store';

// Only subscribe to specific part of state for performance
const DashboardWidget = () => {
  const dashboardState = useStore(uiStore, (state) => state.dashboard);
  
  // Component only re-renders when dashboard state changes
  return <div>Widget content</div>;
};
```

### 3. Form Draft Integration with React Hook Form

```typescript
import { useForm, useWatch } from 'react-hook-form';
import { useUIStore } from '@/hooks/use-ui-store';
import { useEffect } from 'react';

const LeagueCreationForm = () => {
  const { state, actions } = useUIStore();
  const formId = 'league-creation';
  
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: state.formDrafts[formId]?.data || { name: '', description: '' },
  });
  
  // Watch form changes and save drafts
  const watchedValues = useWatch({ control });
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.values(watchedValues).some(Boolean)) {
        actions.saveFormDraft(formId, watchedValues);
      }
    }, 1000); // Debounce saves to every 1 second
    
    return () => clearTimeout(timeoutId);
  }, [watchedValues, actions, formId]);
  
  const onSubmit = (data: any) => {
    // Clear draft on successful submission
    actions.clearFormDraft(formId);
    // Handle form submission...
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

## Advanced Patterns

### 1. State Migration and Versioning

```typescript
interface UIState {
  version: number;
  // ... other state
}

const CURRENT_VERSION = 2;

const migrateState = (persistedState: any): UIState => {
  if (!persistedState.version || persistedState.version < CURRENT_VERSION) {
    // Migrate from v1 to v2
    if (persistedState.version === 1) {
      return {
        ...persistedState,
        version: 2,
        // Add new properties with defaults
        newFeature: {
          enabled: false,
          settings: {},
        },
      };
    }
  }
  
  return persistedState;
};

const loadPersistedState = (): UIState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return migrateState({ ...defaultState, ...parsed });
    }
  } catch (error) {
    console.warn("Failed to load UI state from localStorage:", error);
  }
  return { ...defaultState, version: CURRENT_VERSION };
};
```

### 2. Expired Data Cleanup

```typescript
const cleanupExpiredData = () => {
  const now = Date.now();
  
  uiStore.setState((state) => {
    // Clean up expired form drafts
    const validDrafts = Object.entries(state.formDrafts).reduce((acc, [id, draft]) => {
      if (draft.expiresAt > now) {
        acc[id] = draft;
      }
      return acc;
    }, {} as typeof state.formDrafts);
    
    return {
      ...state,
      formDrafts: validDrafts,
    };
  });
  
  persistState();
};

// Run cleanup on app initialization
useEffect(() => {
  cleanupExpiredData();
}, []);
```

### 3. Cross-Tab Synchronization

```typescript
const syncAcrossTabs = () => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const newState = JSON.parse(e.newValue);
        uiStore.setState(newState);
      } catch (error) {
        console.warn("Failed to sync state across tabs:", error);
      }
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

// Use in root component
useEffect(() => {
  const cleanup = syncAcrossTabs();
  return cleanup;
}, []);
```

## Performance Optimization

### 1. Debounced Persistence

```typescript
import { debounce } from 'lodash-es';

// Create debounced persist function
const debouncedPersist = debounce(persistState, 500);

const updateSearchFilters = (filters: SearchFilters) => {
  uiStore.setState((state) => ({
    ...state,
    search: { ...state.search, filters },
  }));
  
  // Use debounced persistence for rapid updates
  debouncedPersist();
};
```

### 2. Selective Persistence

```typescript
// Only persist certain parts of state
const persistOnlyUserPreferences = () => {
  const { userPreferences, theme } = uiStore.state;
  const stateToPersist = { userPreferences, theme };
  
  try {
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(stateToPersist));
  } catch (error) {
    console.warn("Failed to persist user preferences:", error);
  }
};
```

### 3. Size Monitoring

```typescript
const getStorageUsage = (): { used: number; available: number } => {
  let used = 0;
  
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }
  
  // Estimate 5MB limit (varies by browser)
  const available = 5 * 1024 * 1024 - used;
  
  return { used, available };
};

// Monitor storage usage
const { used, available } = getStorageUsage();
if (available < 1024 * 1024) { // Less than 1MB available
  console.warn("localStorage is running low on space");
  // Implement cleanup strategy
}
```

## Error Handling and Fallbacks

### 1. Graceful Degradation

```typescript
const safeLocalStorageOperation = <T>(
  operation: () => T,
  fallback: T,
  errorMessage: string
): T => {
  try {
    return operation();
  } catch (error) {
    console.warn(`${errorMessage}:`, error);
    return fallback;
  }
};

// Usage
const persistState = () => {
  safeLocalStorageOperation(
    () => localStorage.setItem(STORAGE_KEY, JSON.stringify(uiStore.state)),
    undefined,
    "Failed to persist UI state"
  );
};
```

### 2. Storage Availability Check

```typescript
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Use in store initialization
const createUIStore = () => {
  const hasStorage = isLocalStorageAvailable();
  
  if (!hasStorage) {
    console.warn("localStorage is not available, using in-memory state only");
  }
  
  return new Store(hasStorage ? loadPersistedState() : defaultState);
};
```

## Testing Patterns

### 1. Mocking localStorage in Tests

```typescript
// test-utils.ts
const createMockStorage = () => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: createMockStorage(),
  });
});
```

### 2. Testing State Persistence

```typescript
// ui-store.test.ts
import { uiStore, uiActions } from '@/stores/ui-store';

describe('UI Store Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    uiStore.setState(defaultState);
  });
  
  it('should persist FAB position changes', () => {
    const newPosition = { x: 100, y: 200 };
    
    uiActions.setFabPosition(newPosition, true);
    
    // Check if persisted to localStorage
    const stored = localStorage.getItem('best-shot-ui-state');
    const parsed = JSON.parse(stored!);
    
    expect(parsed.fab.position).toEqual(newPosition);
  });
  
  it('should not persist during drag operations', () => {
    localStorage.clear();
    
    uiActions.setFabPosition({ x: 50, y: 75 }, false);
    
    expect(localStorage.getItem('best-shot-ui-state')).toBeNull();
  });
});
```

## Common Pitfalls and Solutions

### 1. **Pitfall**: Persisting every state change
```typescript
// ❌ Bad: Persists on every change
const updateCounter = (count: number) => {
  uiStore.setState((state) => ({ ...state, counter: count }));
  persistState(); // Called too frequently!
};

// ✅ Good: Debounced or event-based persistence
const updateCounter = (count: number) => {
  uiStore.setState((state) => ({ ...state, counter: count }));
  debouncedPersist(); // Debounced
};
```

### 2. **Pitfall**: Not handling localStorage errors
```typescript
// ❌ Bad: No error handling
localStorage.setItem(key, value);

// ✅ Good: Graceful error handling
try {
  localStorage.setItem(key, value);
} catch (error) {
  console.warn("Storage failed:", error);
  // App continues to work without persistence
}
```

### 3. **Pitfall**: Storing sensitive data
```typescript
// ❌ Bad: Never store sensitive information
const userState = {
  token: 'abc123',           // Never!
  password: 'secret',        // Never!
  creditCard: '1234-5678',   // Never!
};

// ✅ Good: Only store UI preferences
const userState = {
  theme: 'dark',
  language: 'en',
  fabPosition: { x: 20, y: 100 },
};
```

## Decision Matrix: When to Persist State

| State Type | Persist? | When | Performance | Example |
|------------|----------|------|-------------|---------|
| **User Preferences** | ✅ Yes | Immediately | Low frequency | Theme, language |
| **UI Positions** | ✅ Yes | On interaction end | Optimized | FAB position after drag |
| **Form Drafts** | ✅ Yes | Debounced | Medium frequency | Form auto-save |
| **Loading States** | ❌ No | N/A | N/A | `isLoading: true` |
| **Authentication** | ❌ No | N/A | N/A | JWT tokens |
| **Large Datasets** | ❌ No | Use IndexedDB | N/A | Tournament history |

## Related Resources

- [ADR 0004: Client-Side State Persistence](../adr/0004-client-side-state-persistence.md)
- [TanStack Store Documentation](https://tanstack.com/store/latest/docs/overview)
- [React Hook Form Guide](./0005-react-hook-form-guide.md)
- [MDN localStorage Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Summary

This guide provides practical patterns for using localStorage with TanStack Store in Best Shot. Key takeaways:

1. **Performance First**: Optimize high-frequency updates with selective persistence
2. **Error Resilience**: Always handle localStorage failures gracefully
3. **User Experience**: Persist what matters to users across sessions
4. **Security**: Never store sensitive data in localStorage
5. **Testing**: Mock localStorage for reliable tests

Follow these patterns to build robust, performant persistent state features that enhance user experience while maintaining application stability.