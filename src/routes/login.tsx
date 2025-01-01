import { AppButton } from "@/domains/ui-system/components/button/button";
import { PublicLayout } from "@/domains/ui-system/layout/public";
import { theme } from "@/theming/theme";
import { Box, Stack, styled } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { createFileRoute, Link } from "@tanstack/react-router";

const LoginScreen = () => {
	// const { auth } = useAppAuth();
	// const router = useRouter();
	// console.log("LoginScreen - [router]", router);
	return (
		<PublicLayout>
			<Login>
				<Typography variant="h1" color="neutral.100">
					Best Shot
				</Typography>

				<LoginBUtton
					slotProps={{
						root: {
							onClick: async () => {
								console.log("START loginWithPopup");
								await auth.login?.();
								console.log("END loginWithPopup");
							},
						},
					}}
				>
					LOGIN
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

export const Route = createFileRoute("/login")({
	component: LoginScreen,
});
