# Styled Components

- Treat styled components as part of the component API, not just a CSS container.
- When a styled component needs custom styling props, type them explicitly.
- Suffix style-only props with `$` so their purpose is obvious at the usage site and they do not leak to the DOM.
- Prefer putting durable layout and responsive behavior in the styled component itself. Use `sx` for small local exceptions, not as the main styling strategy.
- When responsiveness is part of the component behavior, express it inside the styled component with `UIHelper.whileIs(...)` and `UIHelper.startsOn(...)` blocks.

Preferred pattern:

```tsx
const Container = styled(Stack)<{
	isOpen$: boolean;
}>(({ theme, isOpen$ }) => ({
	width: isOpen$ ? 350 : 230,
	padding: theme.spacing(3),

	[UIHelper.whileIs("mobile")]: {
		// TODO
	},
	[UIHelper.startsOn("tablet")]: {
		// TODO
	},
}));
```

- Type custom styling props explicitly.
- Read custom styling props only inside the styled callback.
- If the prop is styling-only, suffix it with `$`.