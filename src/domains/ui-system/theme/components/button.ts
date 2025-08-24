/**
 * MUI Button Component Overrides
 *
 * Global styling overrides for MUI Button component following
 * Best Shot design system patterns.
 */

import type { Components, Theme } from "@mui/material/styles";
import "../../../../types/mui-overrides";

export const buttonOverrides: Components<Theme>["MuiButton"] = {
	styleOverrides: {
		root: ({ theme }) => ({
			// Remove text transform (keep original casing)
			textTransform: "none",

			// Enhanced border radius
			borderRadius: theme.spacing(1), // 8px

			// Font weight
			fontWeight: theme.typography.fontWeightMedium,

			// Padding improvements
			padding: theme.spacing(1.5, 3), // 12px 24px

			// Transition for smooth interactions
			transition: theme.transitions.create(
				["background-color", "border-color", "box-shadow", "transform"],
				{
					duration: theme.transitions.duration.short,
				}
			),

			// Focus states
			"&:focus-visible": {
				outline: `2px solid ${theme.palette.primary.main}`,
				outlineOffset: "2px",
			},
		}),

		// Size variants
		sizeSmall: ({ theme }) => ({
			padding: theme.spacing(1, 2), // 8px 16px
			fontSize: theme.typography.pxToRem(14),
		}),

		sizeMedium: ({ theme }) => ({
			padding: theme.spacing(1.5, 3), // 12px 24px
			fontSize: theme.typography.pxToRem(16),
		}),

		sizeLarge: ({ theme }) => ({
			padding: theme.spacing(2, 4), // 16px 32px
			fontSize: theme.typography.pxToRem(18),
		}),

		// Variant styles
		contained: ({ theme }) => ({
			boxShadow: theme.shadows[2],

			"&:hover": {
				boxShadow: theme.shadows[4],
				transform: "translateY(-1px)",
			},

			"&:active": {
				boxShadow: theme.shadows[1],
				transform: "translateY(0)",
			},
		}),

		outlined: () => ({
			borderWidth: "2px",

			"&:hover": {
				borderWidth: "2px",
				transform: "translateY(-1px)",
			},
		}),

		text: ({ theme }) => ({
			"&:hover": {
				backgroundColor: theme.palette.action.hover,
			},
		}),
	},

	defaultProps: {
		// Default button props
		disableElevation: false,
		disableRipple: false,
	},

	variants: [
		// Custom variant: Tournament Card Action
		{
			props: { variant: "tournament" as any },
			style: ({ theme }) => ({
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.primary.contrastText,
				border: `2px solid transparent`,

				"&:hover": {
					backgroundColor: theme.palette.primary.dark,
					borderColor: theme.palette.primary.light,
					transform: "translateY(-2px)",
				},
			}),
		},

		// Custom variant: AI Prediction Button
		{
			props: { variant: "aiPrediction" as any },
			style: ({ theme }) => ({
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.common.white,
				minWidth: "100px",
				gap: theme.spacing(0.5),

				"&:hover": {
					backgroundColor: theme.palette.primary.dark,
				},

				"&:disabled": {
					backgroundColor: theme.palette.action.disabled,
					opacity: 0.5,
				},
			}),
		},
	],
};
