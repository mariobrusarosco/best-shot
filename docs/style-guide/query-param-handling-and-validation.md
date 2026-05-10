## Query Param Handling And Validation

- Put state in route search params when the state is part of the screen's addressable behavior.
- Every route-owned search param must be declared and validated in that route's `validateSearch`.
- MUST USE `zod` schemas in the route file so the allowed values are explicit at the route boundary.
- Read child-owned params from a broader parent route ONLY IF YOU NEED.

Preferred style:

### Setting them on a route (aka screen)
```ts
const transactionsSearchSchema = z.object({
  sort_by: z.enum(['date', 'amount', 'created_at', 'category']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const Route = createFileRoute('/(auth)/transactions/')({
  component: TransactionsRouteComponent,
  validateSearch: transactionsSearchSchema,
});
```

### Handling them on the child component

```ts
const DEFAULT_SORT_BY = 'date';
const DEFAULT_SORT_ORDER = 'desc';

function TransactionsRouteComponent() {
  const { sort_by, sort_order } = Route.useSearch();
  const navigate = Route.useNavigate();

  const resolvedSortBy = sort_by ?? DEFAULT_SORT_BY;
  const resolvedSortOrder = sort_order ?? DEFAULT_SORT_ORDER;

  useEffect(() => {
    if (sort_by && sort_order) {
      return;
    }

    void navigate({
      search: prev => ({
        ...prev,
        sort_by: resolvedSortBy,
        sort_order: resolvedSortOrder,
      }),
      replace: true,
    });
  }, [navigate, resolvedSortBy, resolvedSortOrder, sort_by, sort_order]);
}
```

## File Layout

- Place local `type` and `interface` declarations at the bottom of the file unless there is a strong reason to keep them near usage.

## Scope

- Do not introduce structure just because it looks more reusable or more elegant.
- If the requested change can be completed by adapting existing code, prefer that over creating new layers.
- Keep the visible solution close to where the user expects to find it.
