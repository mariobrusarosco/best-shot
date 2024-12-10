import { createFileRoute } from "@tanstack/react-router";

import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { Typography } from "@mui/material";

export default function MyAccountScreen() {
	const member = useMember();

	console.log({ member });

	if (member.isFetching) {
		return (
			<ScreenLayout>
				<Typography variant="h1" color="neutral.100">
					...loading
				</Typography>
			</ScreenLayout>
		);
	}

	if (member.isError) {
		return (
			<ScreenLayout>
				<Typography variant="h1" color="red.400">
					Ops, something has happend
				</Typography>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout>
			<ScreenHeading title="my account" />

			<div>
				<Typography variant="h1" color="neutral.100">
					{member.data?.nickName}
				</Typography>
			</div>
		</ScreenLayout>
	);
}

export const Route = createFileRoute("/_auth/my-account")({
	component: MyAccountScreen,
});
