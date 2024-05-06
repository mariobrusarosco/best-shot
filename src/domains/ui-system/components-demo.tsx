import { Box, Container, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useMediaQuery, useTheme } from "@mui/system";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
	color: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	borderColor: theme.palette.text.secondary,
	[theme.breakpoints.down("mobile")]: {
		backgroundColor: "red",
	},
	[theme.breakpoints.up("mobile")]: {
		backgroundColor: "blue",
	},
	[theme.breakpoints.up("desktop")]: {
		backgroundColor: "green",
	},
}));

export const ComponentsDemo = () => {
	const theme = useTheme();
	console.log(theme.breakpoints);
	const isSmallScreen = useMediaQuery("(max-width:600px)");
	const isLargeScreen = useMediaQuery("(min-width:601px)");

	return (
		<div>
			<section>
				<h2>Container</h2>

				<Container maxWidth="mobile">
					<Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }} />
				</Container>
			</section>

			<section>
				<h2>Grid</h2>

				<p>Basic Example</p>
				<Grid container spacing={2}>
					<Grid item mobile={4} tablet={6} desktop={12}>
						<Item>hello</Item>
					</Grid>
					<Grid item mobile={4} tablet={6} desktop={12}>
						<Item>hello</Item>
					</Grid>
					<Grid item mobile={4} tablet={6} desktop={12}>
						<Item>hello</Item>
					</Grid>
					<Grid item mobile={4} tablet={6} desktop={12}>
						<Item>hello</Item>
					</Grid>
				</Grid>

				<p>With Columns</p>
				<Grid
					container
					spacing={{ mobile: 2, tablet: 3, desktop: 4 }}
					columns={{ mobile: 1, tablet: 8, desktop: 12 }}
				>
					{Array.from(Array(6)).map((_, index) => (
						<Grid item mobile={4} tablet={6} desktop={12} key={index}>
							<Item>hello!</Item>
						</Grid>
					))}
				</Grid>
			</section>

			<section>
				<h2>Breakpoints / Media Queries</h2>

				{isSmallScreen && <p>Small Screen</p>}
				{isLargeScreen && <p>Large Screen</p>}
			</section>
		</div>
	);
};
