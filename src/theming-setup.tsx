import { useMediaQuery } from "@mui/system";
import Button from "@mui/material/Button";

export const ThemingSetup = () => {
	return (
		<div>
			<h1>Theming Setup</h1>

			<section>
				<h2>Material UI Component</h2>
				<h3>Button</h3>
				<p>This is a Core Component of MUI. Directly using it!</p>
				<Button variant="contained">Hello</Button>
			</section>

			<section>
				<h2>Pure and Global CSS</h2>
				<p className="example-01">
					This paragraph is style via Pure CSS. This app support the usage of
					CSS by importing stylesheets the old fashioned way. Inside a .tsx or
					.ts file we can import a CSS file like this:
				</p>
				<pre>import "./App.css"; .... ...</pre>
			</section>

			<section className="">
				<h2>System</h2>
				<p>
					To use the MUI theming system, we need to wrap our app in a
					<code>ThemeProvider</code> component. This component provides the
					theme to all the components in the app. The theme can be customized by
					providing a custom theme object to the <code>ThemeProvider</code>.
				</p>
				<p>
					Here is an example of how to set up the theming system in a MUI app:
				</p>
				<pre>
					{`import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    secondary: {
      main: "#00ff00",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app content here */}
    </ThemeProvider>
  );
}

export default App;`}
				</pre>
			</section>
		</div>
	);
};
