import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { useTheme } from "@mui/system";
import { createFileRoute } from "@tanstack/react-router";
import Box from "@mui/system/Box";
import { Button } from "@/domains/ui-system/components/button/button";
import { BORDER_RADIUS, COLORS, PADDING } from "@/theming/theme";

const UiSystemScreen = () => {
	const theme = useTheme();

	console.log({ theme });

	return (
		<ScreenLayout>
			<Box data-ui="test">
				<h2>Button</h2>

				<p>spacing="small" roundness="small"</p>
				<Button
					sx={{
						backgroundColor: "teal.500",
					}}
					spacing="small"
					roundness="small"
					color="teal.500"
				>
					save
				</Button>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					{Array.from({ length: 8 }).map((_, i) => (
						<li key={i}>
							<Button
								sx={{
									backgroundColor: COLORS.teal[500],
									color: COLORS.neutral[100],
									padding: PADDING.small,
									borderColor: COLORS.neutral[100],
									borderRadius: BORDER_RADIUS.small,
								}}
							>
								{i}
							</Button>
						</li>
					))}
				</Box>
			</Box>
		</ScreenLayout>
	);
};

export const Route = createFileRoute("/ui-system")({
	component: UiSystemScreen,
});
