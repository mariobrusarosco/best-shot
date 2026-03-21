# Components Lifecycle

A Component should follow this order:

- Loading
- Error or Success
- Content

No matter the state, the component should always occupy the same space.

## Component Responsibilities

A component should focus on rendering:

- layout
- visual states
- markup

When a component depends on fetched or derived data, it should consume a UI-oriented hook from its domain instead of shaping raw query output inside the `.tsx` file.

This hook should be the composition layer between domain hooks and the component. It is responsible for:

- consuming lower-level hooks
- deriving view-specific state
- exposing a stable UI contract

The preferred contract is:

- `data`
- `states`
- `handlers`

This means the component should not be responsible for:

- calling raw query hooks when the view needs derived state
- sorting, filtering, slicing, or adapting server data for presentation
- naming UI booleans from raw query output
- composing handlers from multiple hooks

Instead, the hook should adapt the data into something the component can render directly.

## Example

Avoid pushing data orchestration into the component:

```tsx
export const UpcomingMatches = () => {
  const { data, isLoading, isError } = useMatches({ status: "upcoming" });

  if (isLoading) return <UpcomingMatchesSkeleton />;
  if (isError) return <UpcomingMatchesError />;

  const matches = data?.data ?? [];
  const upcomingMatches = [...matches]
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
    .slice(0, 5);

  if (upcomingMatches.length === 0) {
    return <UpcomingMatchesEmpty />;
  }

  return <UpcomingMatchesContent matches={upcomingMatches} />;
};
```

Prefer composing the data in a UI-oriented hook and keeping the component focused on rendering:

```ts
export const useUpcomingMatches = () => {
  const matchesQuery = useMatches({ status: "upcoming" });

  const matches = matchesQuery.data?.data ?? [];
  const upcomingMatches = [...matches]
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
    .slice(0, 5);

  return {
    data: {
      matches: upcomingMatches,
    },
    states: {
      isLoading: matchesQuery.isLoading,
      isError: matchesQuery.isError,
      isEmpty: !matchesQuery.isLoading && !matchesQuery.isError && upcomingMatches.length === 0,
    },
    handlers: {},
  };
};
```

```tsx
export const UpcomingMatches = () => {
  const { data, states } = useUpcomingMatches();

  if (states.isLoading) return <UpcomingMatchesSkeleton />;
  if (states.isError) return <UpcomingMatchesError />;
  if (states.isEmpty) return <UpcomingMatchesEmpty />;

  return <UpcomingMatchesContent matches={data.matches} />;
};
```

1. _Loading_:
   A Skeleton is used while the data of the component is not loaded yet.
2. In case of an **Error**
   We display a friendly message to the user. The exception is when we're absolutely sure the Back End has returned the friendly message for us.
3. **Empty State**:

- If there's _no error_ , _data is not being fetched_ but there's _no data_, we display a friendly message accordingly to what we would display in case of _success_.

4. _Content_:

- If there's _no error_ , _data was fetched_ and we _have data_, we display the content of the component.
