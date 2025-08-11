import { styled, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Link } from "@tanstack/react-router";
import { BestShotIcon } from "@/assets/best-shot-icon";
import { theme } from "@/domains/ui-system/theme";

export const AppNotFound = () => {
	return (
		<Wrapper data-iu="not-found-page">
			<BestShotIcon width={350} fill={theme.palette.black[500]} />

			<Stack textAlign="center" gap={2}>
				<Typography variant="h1" color={theme.palette.neutral[100]}>
					Not found
				</Typography>
				<Typography variant="paragraph" color={theme.palette.teal[500]}>
					This page doesn't exist. Please,{" "}
					<Link to="/dashboard" style={{ color: theme.palette.neutral[100] }}>
						<strong>click here</strong>
					</Link>{" "}
					and go back to dashboard
				</Typography>
			</Stack>
		</Wrapper>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	height: "100dvh",
	backgroundColor: theme.palette.black[800],
	display: "grid",
	placeContent: "center",
	placeItems: "center",
	borderTopLeftRadius: theme.spacing(4),
	borderTopRightRadius: theme.spacing(4),
	gap: theme.spacing(3),
	padding: theme.spacing(0, 2),
}));
