import { useTheme } from "@mui/system";
import Box from "@mui/system/Box";
import { createFileRoute } from "@tanstack/react-router";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { BORDER_RADIUS, COLORS, PADDING } from "@/theming/theme";

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
					{[
						{ id: "demo-button-1", number: 1 },
						{ id: "demo-button-2", number: 2 },
						{ id: "demo-button-3", number: 3 },
						{ id: "demo-button-4", number: 4 },
						{ id: "demo-button-5", number: 5 },
						{ id: "demo-button-6", number: 6 },
						{ id: "demo-button-7", number: 7 },
						{ id: "demo-button-8", number: 8 },
					].map((item) => (
						<li key={item.id}>
							<AppButton
								sx={{
									backgroundColor: COLORS.teal[500],
									color: COLORS.neutral[100],
									padding: PADDING.small,
									borderColor: COLORS.neutral[100],
									borderRadius: BORDER_RADIUS.small,
								}}
							>
								{item.number}
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
