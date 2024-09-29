import { Link } from "@tanstack/react-router";
import Stack from "@mui/material/Stack";

export const Header = () => {
	return (
		<header>
			<Stack spacing={2}>
				<Link to="/">Home</Link>
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/leagues">Leagues</Link>
				<Link to="/tournaments">Tournaments</Link>
			</Stack>
		</header>
	);
};
