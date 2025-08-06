/**
 * AppCard - Enhanced Base Card Component
 * 
 * Design system base card following our MUI architecture patterns.
 * This component serves as the foundation for all card variants across domains.
 */

import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

// Extended card props for our design system
export interface AppCardProps extends MuiCardProps {
	/**
	 * Card variant for different use cases
	 */
	variant?: 'default' | 'tournament' | 'match' | 'league' | 'aiInsight' | 'elevated' | 'flat';
	/**
	 * Whether the card should be interactive (hover effects)
	 */
	interactive?: boolean;
	/**
	 * Whether the card should have a loading state
	 */
	loading?: boolean;
}

// Enhanced styled card with design system improvements
const StyledCard = styled(MuiCard)<AppCardProps>(({ theme, interactive, loading }) => ({
	// Design system base styles (handled by theme overrides)
	// Additional component-specific styles
	
	...(interactive && {
		cursor: 'pointer',
		transition: theme.transitions.create([
			'transform',
			'box-shadow',
			'border-color'
		], {
			duration: theme.transitions.duration.short,
		}),
		
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: theme.shadows[4],
		},
		
		'&:active': {
			transform: 'translateY(0)',
			boxShadow: theme.shadows[2],
		},
	}),
	
	...(loading && {
		opacity: 0.7,
		pointerEvents: 'none',
		
		'&::after': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: `linear-gradient(90deg, transparent, ${theme.palette.action.hover}, transparent)`,
			animation: 'shimmer 2s infinite',
		},
	}),
	
	// Focus styles for accessibility when interactive
	...(interactive && {
		'&:focus-visible': {
			outline: `2px solid ${theme.palette.primary.main}`,
			outlineOffset: '2px',
		},
	}),
}));

/**
 * AppCard Component
 * 
 * Enhanced card component that serves as the base for all cards
 * in the Best Shot application. Includes different variants, interactive
 * states, and loading states following our design system patterns.
 * 
 * @example
 * ```tsx
 * <AppCard variant="tournament" interactive>
 *   <CardContent>
 *     <Typography variant="h6">Premier League</Typography>
 *     <Typography>Active tournament</Typography>
 *   </CardContent>
 * </AppCard>
 * 
 * <AppCard variant="match" loading>
 *   Loading match data...
 * </AppCard>
 * ```
 */
export const AppCard = forwardRef<HTMLDivElement, AppCardProps>(
	({ 
		children, 
		variant = 'default', 
		interactive = false, 
		loading = false, 
		tabIndex,
		...props 
	}, ref) => {
		return (
			<StyledCard
				ref={ref}
				variant={variant}
				interactive={interactive}
				loading={loading}
				tabIndex={interactive ? tabIndex || 0 : tabIndex}
				role={interactive ? 'button' : undefined}
				{...props}
			>
				{children}
			</StyledCard>
		);
	}
);

AppCard.displayName = 'AppCard';

// Export for backward compatibility
export { AppCard as default };