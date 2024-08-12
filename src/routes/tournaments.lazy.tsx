import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tournaments")({
	component: Tournaments,
});

function Tournaments() {
	return (
		<div className="p-2">
			<h3>Tournaments</h3>
		</div>
	);
}
