import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { Menu } from "@/domains/global/components/menu";
import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
	const { memberIsReady, loadingMemberData, authError, member } = useAppAuth();

	console.log({ memberIsReady, loadingMemberData, authError, member });

	// if (loadingMemberData) {
	// 	return (
	// 		<Typography variant="h1" color="neutral.100">
	// 			loading
	// 		</Typography>
	// 	);
	// }

	// if (authError) {
	// 	console.error("[AUTH] - ERROR", authError);

	// 	return <Navigate to="/login" />;
	// }

	// if (memberIsReady) console.log("[MEMBER]", member.data.nickName);
	return (
		<Box
			data-ui="authenticated-layout"
			sx={{
				display: "flex",
				height: "100%",
				width: "100%",
			}}
		>
			<Menu />
			<Box data-ui="main-area" sx={{ flex: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export const Route = createFileRoute("/_auth")({
	// beforeLoad: async ({ context, location }) => {
	// 	const isAuthenticated = context.member.query.is;

	// if (!isAuthenticated || !hasValidMemberId) {
	// 	throw redirect({
	// 		to: "/",
	// 		search: {
	// 			redirect: location.href,
	// 		},
	// 	});
	// }
	// },
	component: AuthLayout,
});
