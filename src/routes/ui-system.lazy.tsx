import { createLazyFileRoute } from "@tanstack/react-router";
import { ComponentsDemo } from "../domains/ui-system/components-demo";

export const Route = createLazyFileRoute("/ui-system")({
	component: UISystemScreen,
});

function UISystemScreen() {
	return <ComponentsDemo />;
}
