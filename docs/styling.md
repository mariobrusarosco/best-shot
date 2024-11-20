# Styling

## Introduction

This project will use Material-UI as the main styling library.

[Rationale]
// TODO

## Creating a Component

1. Creating a `themed` Component

```tsx
const StatRoot = styled("div" | Box)(({ theme }) => ({
	flexDirection: "column",
	fontWeight: 600,
	gap: theme.spacing(0.5),
	padding: theme.spacing(3, 4),
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[2],

	// Responsiveness
	[theme.breakpoints.up("mobile")]: {
		position: "absolute",
		bottom: 0,
	},
}));
```

2. Using the `sx` prop

A) using `theme` from `useTheme()`

```tsx
import { useTheme } from "@mui/material";

const HeaderButton = ({ iconName }: { iconName: keyof typeof ICONS }) => {
	const theme = useTheme();

	console.log({ theme });

	return (
		<Button
			sx={{
				backgroundColor: theme.palette.teal[500],
				color: theme.palette.neutral[100],
				padding: theme.spacing(1),
			}}
		>
			<AppIcon name={iconName} size="small" stroke={2} width={20} height={20} />
		</Button>
	);
};
```

B) Via `styled` function

```tsx
const Button = styled(BaseButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
	color: ${theme.palette.mode === 'dark' ? 'red' : 'blue'};
	....
`
// Usage
<Button ... />

```

C) using special strings.

<Callout>
This only works with `MUI props`. A MUI Component or a Custom Component that EXPOSES `MUI props`. If that's the case we can "create" our Component by proving specific `props`. These `props` have inner access the App's Theme.  
</Callout>

```tsx
// Given this Theme Config...
...
palette: {
	black: {
		400: "#A3ABA8",
		700: "#131514",
		800: "#242424",
	}
}
...

// Usage
	<Typography color="black.400" variant="body1">
		Dashboard
	</Typography>
```

## Creating a Screen

# Icons

We have an `Icon Component` (it uses `@tabler/icons-react`)

```tsx
<AppIcon name={iconName} size="small" stroke={2} width={20} height={20} />
```

- Available values for `size` and `name` props will be prompted by 'autocomplete'
- It's up to us to add more customization to an `Icon`. It accepts the same SVG properties a `<svg>` does. (including a 'style' prop)

```tsx
<AppIcon
	color="red"
	name={iconName}
	size="small"
	stroke={2}
	width={20}
	height={20}
/>
```

# Utilities

We'll use Material-UI's utilities library.

# Guides

## How to work with Media Queries in this Project?

### Targeting Screens by theirs sizes / Using Breakpoints

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
import { useMediaQuery } from "@mui/material";

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
	[theme.breakpoints.up("mobile")]: {
		position: "absolute",
		bottom: 0,
	},
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

##### Recommended way

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

### How to set styles that are applied to all components/pages?

---

# Reset / Normalization

This project uses MUI normalization, through `CssBaseline` component.
More details: (here)[https://mui.com/material-ui/react-css-baseline/]

# Texts, Fonts and, Typography

## Accessing typography aspects when creating `Custom UI`s

```tsx
import { styled } from "@mui/material/styles";

// How to set Typography properties on App's theme
{
	...,
	typography: {
		fontFamily: "Libre Baskerville,Montserrat Variable, sans-serif",
		fontSize: 14,
		fontWeightBold: 700,
		....
	}
	...
}

// How to access Typography properties
const Div = styled("div")(({ theme }) => ({
	...theme.typography.button,
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(1),
}));
```
