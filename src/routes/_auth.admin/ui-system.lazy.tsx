import { createLazyFileRoute } from "@tanstack/react-router";
import { UISystemViewer } from "@/domains/admin/components/ui-system-viewer/ui-system-viewer";

export const Route = createLazyFileRoute("/_auth/admin/ui-system")({
	component: UISystemViewer,
});
