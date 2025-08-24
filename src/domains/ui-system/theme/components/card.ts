/**
 * MUI Card Component Overrides
 * 
 * Global styling overrides for MUI Card component following
 * Best Shot design system patterns.
 */

import type { Components, Theme } from '@mui/material/styles';
import '../../../../types/mui-overrides';

export const cardOverrides: Components<Theme>['MuiCard'] = {
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
			transition: theme.transitions.create([
				'box-shadow',
				'transform',
				'border-color'
			], {
				duration: theme.transitions.duration.short,
			}),
			
			// Interactive hover state
			'&:hover': {
				boxShadow: theme.shadows[4],
				transform: 'translateY(-2px)',
				borderColor: theme.palette.primary.light,
			},
			
			// Focus state for accessibility
			'&:focus-within': {
				outline: `2px solid ${theme.palette.primary.main}`,
				outlineOffset: '2px',
			},
		}),
	},
	
	variants: [
		// Tournament Card variant
		{
			props: { variant: 'tournament' as any },
			style: ({ theme }) => ({
				backgroundColor: theme.palette.black?.[800] || theme.palette.grey[800],
				color: theme.palette.common.white,
				border: 'none',
				
				'&:hover': {
					backgroundColor: theme.palette.black?.[700] || theme.palette.grey[700],
					transform: 'translateY(-4px)',
				},
			}),
		},
		
		// Match Card variant
		{
			props: { variant: 'match' as any },
			style: ({ theme }) => ({
				minHeight: '200px',
				padding: theme.spacing(3),
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				
				'&:hover': {
					transform: 'translateY(-3px)',
					boxShadow: theme.shadows[6],
				},
			}),
		},
		
		// League Card variant
		{
			props: { variant: 'league' as any },
			style: ({ theme }) => ({
				padding: theme.spacing(2.5),
				borderRadius: theme.spacing(2), // 16px for more modern look
				
				'&:hover': {
					borderColor: theme.palette.primary.main,
					boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`, // 20% opacity
				},
			}),
		},
		
		// AI Insight Card variant
		{
			props: { variant: 'aiInsight' as any },
			style: ({ theme }) => ({
				background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`,
				borderColor: theme.palette.primary.main,
				
				'&:hover': {
					background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`,
				},
			}),
		},
		
		// Elevated card for important content
		{
			props: { variant: 'elevated' as any },
			style: ({ theme }) => ({
				boxShadow: theme.shadows[8],
				border: 'none',
				
				'&:hover': {
					boxShadow: theme.shadows[12],
					transform: 'translateY(-6px)',
				},
			}),
		},
		
		// Flat card for subtle content
		{
			props: { variant: 'flat' as any },
			style: ({ theme }) => ({
				boxShadow: 'none',
				backgroundColor: theme.palette.background.default,
				
				'&:hover': {
					backgroundColor: theme.palette.action.hover,
					transform: 'none',
				},
			}),
		},
	],
	
	defaultProps: {
		elevation: 0, // Use custom shadows instead
	},
};