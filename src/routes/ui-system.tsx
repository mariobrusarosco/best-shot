import { AppButton } from "@/domains/ui-system/components/button/button";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { BORDER_RADIUS, COLORS, PADDING } from "@/theming/theme";
import { useTheme } from "@mui/system";
import Box from "@mui/system/Box";
import { createFileRoute } from "@tanstack/react-router";

const UiSystemScreen = () => {
	const theme = useTheme();

	console.log({ theme });

	return (
		<AuthenticatedScreenLayout>
			<Box data-ui="test">
				<h2>AppButton</h2>

				<p>spacing="small" roundness="small"</p>
				<AppButton
					sx={{
						backgroundColor: "teal.500",
					}}
					spacing="small"
					roundness="small"
					color="teal.500"
				>
					save
				</AppButton>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					{Array.from({ length: 8 }).map((_, i) => (
						<li key={i}>
							<AppButton
								sx={{
									backgroundColor: COLORS.teal[500],
									color: COLORS.neutral[100],
									padding: PADDING.small,
									borderColor: COLORS.neutral[100],
									borderRadius: BORDER_RADIUS.small,
								}}
							>
								{i}
							</AppButton>
						</li>
					))}
				</Box>
			</Box>
		</AuthenticatedScreenLayout>
	);
};

export const Route = createFileRoute("/ui-system")({
	component: UiSystemScreen,
});
