# Styling

## Introduction

This project will use Material-UI as the main styling library.

[Rationale]
// TODO

## Feature

### Icons

We'll use Material-UI's icons library.

### Utilities

We'll use Material-UI's utilities library.

## Guides

### How to work with Media Queries in this Project?

### How to set styles that are applied to all components/pages?

---

## Reset / Normalization

This project uses MUI normalization, through `CssBaseline` component.
More details: (here)[https://mui.com/material-ui/react-css-baseline/]

## Targeting Screens by theirs sizes / Using Breakpoints

We can use breakpoints in three ways:

1. Inside a Component or Hook
   Using the `useMediaQuery` hook

```tsx
const isSmallScreen = useMediaQuery("(max-width:600px)");
const isLargeScreen = useMediaQuery("(min-width:601px)");

{
	isSmallScreen && <p>Small Screen</p>;
}
{
	isLargeScreen && <p>Large Screen</p>;
}
```

2. Using the `useTheme` hook
   We can access the breakpoints object from the theme object (ThemeProvider must be set up!)

```tsx
const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
```

3. Creating a `themed` Component

```tsx
const StatRoot = styled("div", {
	name: "MuiStat", // The component name
	slot: "root", // The slot name
})(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(0.5),
	padding: theme.spacing(3, 4),
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[2],
	letterSpacing: "-0.025em",
	fontWeight: 600,
}));
```

4. Internally via <Grid> and <Container />
   We get to use the xs, sm, md, lg, and xl props in the Grid component. They target the App's breakpoints.

```tsx
<Grid container spacing={2}>
	<Grid item xs={8} md={12}>
		<Item>xs=8</Item>
	</Grid>
	<Grid item xs={4}>
		<Item>xs=4</Item>
	</Grid>
	<Grid item xs={4}>
		<Item>xs=4</Item>
	</Grid>
	<Grid item xs={8}>
		<Item>xs=8</Item>
	</Grid>
</Grid>

// We get to pass the breakpoints string values to the Container component
	<Container maxWidth="xs">
		<Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }} />
	</Container>

		<Container maxWidth="lg">
		<Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }} />
	</Container>
```

### Recommended way

```jsx
import { useMediaQuery } from "@mui/material";

const App = () => {
	const isSmallScreen = useMediaQuery("(max-width: 600px)");
	const isLargeScreen = useMediaQuery("(min-width: 600px)");

	return (
		<div>
			{isSmallScreen && <p>Small Screen</p>}
			{isLargeScreen && <p>Large Screen</p>}
		</div>
	);
};
```
