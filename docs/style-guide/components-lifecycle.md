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

The mandatory contract is:

- `query`
- `actions`

This means the component should not be responsible for:

- calling raw query hooks when the view needs derived state
- sorting, filtering, slicing, or adapting server data for presentation
- naming UI booleans from raw query output
- composing handlers from multiple hooks

* Avoid pushing data orchestration into the component
* Prefer composing the data in a UI-oriented hook and keeping the component focused on rendering:

## Creating a UI-oriented hook

```tsx
<resourceName>: {
	query,
	actions: {
		refetch<ResourceName>: query.refetch,
	},
},
<resourceName>: {
	...
}
```

```tsx
export const useLeagues = () => {
	const queryClient = useQueryClient();

	const leaguesQuery = useQuery({
		queryKey: leaguesQueryKey(),
		queryFn: getLeagues,
	});

	const createLeagueMutation = useMutation({
		mutationFn: createLeague,
		onSuccess: () => {
			alert("League created successfully");
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
		},
		onError: () => {
			alert("Failed to create league");
		},
	});

	return {
		leagues: {
			query: leaguesQuery,
			actions: {
				refetch: leaguesQuery.refetch,
			},
		},
		league: {
			mutation: createLeagueMutation,
		},
	};
};
```

## Using a Hook with the UI-friendly contract

```tsx
export const Leagues = () => {
  const { query, actions } = useLeagues();

  if (query.isLoading) return <LeaguesSkeleton />;
  if (query.isError) return <LeaguesError />;
  if (nationalLeagues.length === 0 && internationalLeagues.length === 0) {
    return <LeaguesEmpty />;
  }

// Content Ready
  const nationalLeagues = [...query.data ?? []]
    .filter((l) => l.type === "national");

  const internationalLeagues = [...query.data ?? []]
    .filter((l) => l.type === "international");

  return <LeaguesContent nationalLeagues={nationalLeagues} internationalLeagues={internationalLeagues} />;
};
```

## Lifecycle States

1. _Loading_:
   A Skeleton is used while the data of the component is not loaded yet.
2. In case of an **Error**
   We display a friendly message to the user. The exception is when we're absolutely sure the Back End has returned the friendly message for us.
3. **Empty State**:

- If there's _no error_ , _data is not being fetched_ but there's _no data_, we display a friendly message accordingly to what we would display in case of _success_.

4. _Content_:

- If there's _no error_ , _data was fetched_ and we _have data_, we display the content of the component.
