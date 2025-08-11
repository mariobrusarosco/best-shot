import { Box, css, styled } from "@mui/material";

export const appShimmerEffect = () => ({
	overflow: "hidden",

	"&::after": {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		transform: "translateX(-100%)",
		backgroundImage: `linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.1) 20%,
			rgba(255, 255, 255, 0.2) 60%,
			rgba(255, 255, 255, 0) 100%
			)`,
		animation: "shimmer 2s infinite",
		content: '""',
	},
});

export const appShimmerEffectNew = css`
	position: relative;
	overflow: hidden;
	&::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transform: translateX(-100%);
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.1) 20%,
			rgba(255, 255, 255, 0.2) 60%,
			rgba(255, 255, 255, 0) 100%
		);
		animation: shimmer 2s infinite;
		content: "";
	}
`;

export const AppTypographySkeleton = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		position: "relative",
		backgroundColor: "black.800",
		borderRadius: 2,
		...appShimmerEffect(),
	})
);
