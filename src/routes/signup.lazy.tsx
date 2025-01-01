import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { PublicLayout } from "@/domains/ui-system/layout/public";
import { theme } from "@/theming/theme";
import { Box, styled } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { createLazyFileRoute } from "@tanstack/react-router";

const SignUpScreen = () => {
	const { auth } = useAppAuth();

	// console.log("LoginScreen", auth);
	return (
		<PublicLayout>
			<SignUp>
				<Typography variant="h1" color="neutral.100">
					Best Shot
				</Typography>

				<SignUpBUtton
					slotProps={{
						root: {
							onClick: async () => {
								console.log("START loginWithPopup");
								await auth.signup?.();
								console.log("END loginWithPopup");
							},
						},
					}}
				>
					SIGN UP
				</SignUpBUtton>
				<ProviderDisclaimer>
					<Typography variant="caption" color={theme.palette.teal[500]}>
						using Auth0 by Okta
					</Typography>
				</ProviderDisclaimer>
			</SignUp>
		</PublicLayout>
	);
};

const SignUp = styled(Box)(({ theme }) => ({
	display: "grid",
	placeContent: "center",
	flex: 1,
	gap: theme.spacing(1),
}));

const SignUpBUtton = styled(AppButton)(({ theme }) => ({
	padding: theme.spacing(2, 4),
	borderRadius: theme.spacing(1),
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
}));

const ProviderDisclaimer = styled(AppButton)(() => ({}));

export const Route = createLazyFileRoute("/signup")({
	component: SignUpScreen,
});
