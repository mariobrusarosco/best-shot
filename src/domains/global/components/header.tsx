import { Link } from "@tanstack/react-router";

export const Header = () => {
	return (
		<header>
			<ul className="p-2 flex gap-2">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{" "}
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/leagues">Leagues</Link>
				<Link to="/tournaments">Tournaments</Link>
				<Link to="/my-account">My Account</Link>
			</ul>
		</header>
	);
};
