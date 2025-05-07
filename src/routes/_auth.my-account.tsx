import { Authentication } from "@/domains/authentication";
import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { styled, Typography } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

const { useAppAuth } = Authentication;

export default function MyAccountScreen() {
	const auth = useAppAuth();
	const member = useMember();
	const navigate = useNavigate();

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
			<ScreenHeading title="my account" />

			<MyAccount>
				<Typography variant="topic" color="neutral.100">
					{member.data?.id}
				</Typography>
				<Typography variant="h1" color="neutral.100">
					{member.data?.nickName}
				</Typography>
				<Typography variant="paragraph" color="neutral.100">
					{member.data?.email}
				</Typography>

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

const MyAccount = styled(ScreenMainContent)(({ theme }) => ({
	flexDirection: "column",
	gap: theme.spacing(4),
}));

const LogoutButton = styled(AppButton)(({ theme }) => ({
	display: "block",
	padding: theme.spacing(2, 4),
	borderRadius: theme.spacing(1),
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
	maxWidth: "fit-content",
}));

export const Route = createFileRoute("/_auth/my-account")({
	component: MyAccountScreen,
});
