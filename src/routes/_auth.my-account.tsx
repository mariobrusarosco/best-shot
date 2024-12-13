import { createFileRoute } from "@tanstack/react-router";

import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { Typography } from "@mui/material";

export default function MyAccountScreen() {
	const member = useMember();

	if (member.isLoading) {
		return (
			<ScreenLayout>
				<ScreenMainContent>
					<Typography variant="h1" color="neutral.100">
						...loading
					</Typography>
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (member.isError) {
		return (
			<ScreenLayout>
				<ScreenMainContent>
					<Typography variant="h1" color="red.400">
						Ops, something has happend
					</Typography>
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout>
			<ScreenHeading title="my account" />

			<ScreenMainContent>
				<Typography variant="h1" color="neutral.100">
					{member.data?.nickName}
				</Typography>
			</ScreenMainContent>
		</ScreenLayout>
	);
}

export const Route = createFileRoute("/_auth/my-account")({
	component: MyAccountScreen,
});
