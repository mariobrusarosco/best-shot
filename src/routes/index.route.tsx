import { useAuth0 } from "@auth0/auth0-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();

	return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
	const { logout } = useAuth0();

	return (
		<button
			onClick={() =>
				logout({ logoutParams: { returnTo: window.location.origin } })
			}
		>
			Log Out
		</button>
	);
};

function Index() {
	return (
		<div className="p-2">
			<h3>Best Shot Home!</h3>

			<LoginButton />
			<LogoutButton />
		</div>
	);
}
