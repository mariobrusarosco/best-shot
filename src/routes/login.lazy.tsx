import { Box, Stack, styled, Typography } from "@mui/material";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Authentication } from "@/domains/authentication";
import { APP_MODE } from "@/domains/global/utils";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { PublicLayout } from "@/domains/ui-system/layout/public";
import { theme } from "@/domains/ui-system/theme";

const useAppAuth = Authentication.useAppAuth;

const LoginScreen = () => {
	const auth = useAppAuth();
	const navigate = useNavigate();

	return (
		<PublicLayout>
			<Login>
				<Typography variant="h1" color="neutral.100">
					Best Shot
				</Typography>

				{APP_MODE === "demo" && (
					<Box
						sx={{
							bgcolor: "warning.main",
							p: 1,
							borderRadius: 1,
							mb: 2,
							textAlign: "center",
						}}
					>
						<Typography variant="caption" color="warning.contrastText">
							DEMO MODE: No credentials needed. Click Login to access as Guest.
						</Typography>
					</Box>
				)}

				<LoginBUtton
					slotProps={{
						root: {
							onClick: async () => {
								try {
									await auth.login();

									navigate({ to: "/dashboard" });
								} catch (error) {
									console.log(error);
								}
							},
						},
					}}
				>
					{APP_MODE === "demo" ? "ENTER DEMO" : "LOGIN"}
				</LoginBUtton>

				<Stack
					gap={2}
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="topic" color={theme.palette.neutral[100]}>
						New to Best Shot?
					</Typography>
					<RegisterNow to="/signup">
						<Typography
							variant="label"
							color={theme.palette.teal[500]}
							textTransform="uppercase"
						>
							Register now!
						</Typography>
					</RegisterNow>
				</Stack>
			</Login>
		</PublicLayout>
	);
};

const Login = styled(Box)(({ theme }) => ({
	display: "grid",
	placeContent: "center",
	flex: 1,
	gap: theme.spacing(4),
}));

const LoginBUtton = styled(AppButton)(({ theme }) => ({
	padding: theme.spacing(2, 4),
	borderRadius: theme.spacing(1),
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
}));

const RegisterNow = styled(Link)(() => ({}));

export const Route = createLazyFileRoute("/login")({
	component: LoginScreen,
});
