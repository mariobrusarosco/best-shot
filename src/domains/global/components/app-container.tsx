import { Link, Outlet } from "react-router-dom";

const AppContainer = () => {
	return (
		<div className="app-container">
			<Header />
			<Outlet />
		</div>
	);
};
const Header = () => {
	return (
		<header>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/dashboard">Dashboard</Link>
					</li>
					<li>
						<Link to="/leagues">Leagues</Link>
					</li>
					<li>
						<Link to="/tournaments">Tournaments</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export { AppContainer };
