import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/leagues")({
	component: Leagues,
});

function Leagues() {
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
