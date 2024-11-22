import { createFileRoute } from "@tanstack/react-router";

import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { Typography } from "@mui/material";

export default function MyAccountScreen() {
	const member = useMember();

	console.log({ member });

	if (member.isFetching) {
		return (
			<div>
				<Typography variant="h1" color="neutral.100">
					...loading
				</Typography>
			</div>
		);
	}

	if (member.isError) {
		return (
			<div>
				<Typography variant="h1" color="red.400">
					Ops, something has happend
				</Typography>
			</div>
		);
	}

	return (
		<div>
			<ScreenHeading title="my account" />

			<div>
				<Typography variant="h1" color="neutral.100">
					{member.data?.nickName}
				</Typography>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/_auth/my-account")({
	component: MyAccountScreen,
});
