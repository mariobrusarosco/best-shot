## Recommended render branching order
- Loading → Error → Empty State → Main Content

Example
```tsx
export function Component() {
  const { data, isPending, error } = useQuery(...);

  if (isPending) return <LoadingSkeleton />;        // Loading first
  if (error) return <ErrorState />;                 // Then error
  if (!data || data.length === 0) return <Empty />; // Then empty
  return <MainContent data={data} />;               // Finally main content
}
```