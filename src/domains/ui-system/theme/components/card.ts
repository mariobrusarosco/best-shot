/**
 * MUI Card Component Overrides
 *
 * Global styling overrides for MUI Card component following
 * Best Shot design system patterns.
 */

import type { Components, Theme } from "@mui/material/styles";
import "../../../../types/mui-overrides";

export const cardOverrides: Components<Theme>["MuiCard"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			// Enhanced border radius
			borderRadius: theme.spacing(1.5), // 12px

			// Default background
			backgroundColor: theme.palette.background.paper,

			// Subtle border for definition
			border: `1px solid ${theme.palette.divider}`,

			// Enhanced shadow
			boxShadow: theme.shadows[2],

			// Smooth transitions
			transition: theme.transitions.create(["box-shadow", "transform", "border-color"], {
				duration: theme.transitions.duration.short,
			}),

			// Interactive hover state
			"&:hover": {
				boxShadow: theme.shadows[4],
				transform: "translateY(-2px)",
				borderColor: theme.palette.primary.light,
			},

			// Focus state for accessibility
			"&:focus-within": {
				outline: `2px solid ${theme.palette.primary.main}`,
				outlineOffset: "2px",
			},
		}),
	},

	variants: [
		// Tournament Card variant
		{
			props: { variant: "tournament" as "tournament" },
			style: ({ theme }) => ({
				backgroundColor: theme.palette.black?.[800] || theme.palette.grey[800],
				border: `1px solid ${theme.palette.neutral[700]}`,
				borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(2),
				transition: "all 0.2s ease-in-out",

				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: theme.shadows[8],
					borderColor: theme.palette.primary.main,
				},
			}),
		},

		// Match Card variant
		{
			props: { variant: "match" as "match" },
			style: ({ theme }) => ({
				minHeight: "200px",
				backgroundColor: theme.palette.black[800],
				border: `1px solid ${theme.palette.neutral[700]}`,
				borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(2),
				transition: "all 0.2s ease-in-out",

				"&:hover": {
					transform: "translateY(-1px)",
					boxShadow: theme.shadows[4],
					borderColor: theme.palette.primary.main,
				},
			}),
		},

		// League Card variant
		{
			props: { variant: "league" as "league" },
			style: ({ theme }) => ({
				padding: theme.spacing(2.5),
				backgroundColor: theme.palette.black[800],
				border: `1px solid ${theme.palette.neutral[700]}`,
				borderRadius: theme.shape.borderRadius,
				transition: "all 0.2s ease-in-out",

				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: theme.shadows[6],
					borderColor: theme.palette.primary.main,
				},
			}),
		},

		// AI Insight Card variant
		{
			props: { variant: "aiInsight" as "aiInsight" },
			style: ({ theme }) => ({
				background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`,
				border: `1px solid ${theme.palette.primary.main}20`,
				borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(2),
				position: "relative",
				overflow: "hidden",

				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "2px",
					background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
				},

				"&:hover": {
					transform: "translateY(-1px)",
					boxShadow: theme.shadows[4],
				},
			}),
		},

		// Elevated card for important content
		{
			props: { variant: "elevated" as "elevated" },
			style: ({ theme }) => ({
				boxShadow: theme.shadows[8],
				backgroundColor: theme.palette.black[800],
				border: `1px solid ${theme.palette.neutral[700]}`,
				borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(2),
				transition: "all 0.2s ease-in-out",

				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: theme.shadows[12],
				},
			}),
		},

		// Flat card for subtle content
		{
			props: { variant: "flat" as "flat" },
			style: ({ theme }) => ({
				boxShadow: "none",
				backgroundColor: theme.palette.black[800],
				border: `1px solid ${theme.palette.neutral[800]}`,
				borderRadius: theme.shape.borderRadius,
				padding: theme.spacing(2),
				transition: "all 0.2s ease-in-out",

				"&:hover": {
					borderColor: theme.palette.neutral[700],
				},
			}),
		},
	],

	defaultProps: {
		elevation: 0, // Use custom shadows instead
	},
};
