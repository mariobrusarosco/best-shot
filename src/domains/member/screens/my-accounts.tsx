import { Box, styled, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Authentication } from "@/domains/authentication";
import { useMember } from "@/domains/member/hooks/use-member";
import { LogoutButton, MyAccount } from "@/domains/member/screens/my-accounts.styles";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";

const { useAppAuth } = Authentication;

export default function MyAccountScreen() {
	const auth = useAppAuth();
	const member = useMember();
	const navigate = useNavigate();

	const fullName = `${member.data?.firstName} ${member.data?.lastName}`;

	if (member.isLoading) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenMainContent>
					<Typography variant="h1" color="neutral.100">
						...loading
					</Typography>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (member.isError) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenMainContent>
					<Typography variant="h1" color="red.400">
						Ops, something has happend
					</Typography>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout>
			<MyAccountDisplay>
				<Typography data-ui="title" variant="h2" textTransform="uppercase" color="black.400">
					My Account
				</Typography>
			</MyAccountDisplay>

			<MyAccount>
				<Box>
					<Typography variant="label" color="teal.500">
						User
					</Typography>
					<Typography variant="caption" color="neutral.100" component="p">
						{member.data?.nickName}
					</Typography>
				</Box>

				<Box>
					<Typography variant="label" color="teal.500">
						Full name
					</Typography>
					<Typography variant="caption" color="neutral.100" component="p">
						{fullName}
					</Typography>
				</Box>

				<Box>
					<Typography variant="label" color="teal.500">
						Email
					</Typography>
					<Typography variant="caption" color="neutral.100" component="p">
						{member.data?.email}
					</Typography>
				</Box>

				<LogoutButton
					slotProps={{
						root: {
							onClick: async () => {
								console.log("logout");
								await auth.logout();
								navigate({ to: "/login" });
							},
						},
					}}
				>
					Logout
				</LogoutButton>
			</MyAccount>
		</AuthenticatedScreenLayout>
	);
}

const MyAccountDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	width: "fit-content",
	gap: theme.spacing(2),
	padding: theme.spacing(3.5),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.borderRadius.medium,
	minWidth: "300px",
}));
