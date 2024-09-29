import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h3>Best Shot Home!</h3>

			{/* <LoginButton />
			<LogoutButton /> */}
		</div>
	);
}
