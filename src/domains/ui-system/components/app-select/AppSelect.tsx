/**
 * AppSelect - Enhanced Base Select Component
 * 
 * Design system select component following our MUI architecture patterns.
 * This component serves as the foundation for all select components across domains.
 * 
 * Features:
 * - Consistent design system integration
 * - Loading and error states
 * - Multiple variants for different use cases
 * - Accessibility support built-in
 * - Theme token integration
 * 
 * Follows Static Styled Components pattern for optimal performance.
 */

import { FormControl, InputLabel, Select as MuiSelect, SelectProps as MuiSelectProps, FormHelperText, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

// Extended select props for our design system
export interface AppSelectProps extends Omit<MuiSelectProps, 'variant'> {
	/**
	 * Select variant for different use cases
	 */
	variant?: 'default' | 'tournament' | 'league' | 'compact';
	/**
	 * Loading state - shows loading indicator
	 */
	loading?: boolean;
	/**
	 * Error state and message
	 */
	error?: boolean;
	errorMessage?: string;
	/**
	 * Success state
	 */
	success?: boolean;
	/**
	 * Helper text for guidance
	 */
	helperText?: string;
	/**
	 * Options for the select (simplified usage)
	 */
	options?: Array<{ value: string | number; label: string; disabled?: boolean }>;
}

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

// Form control wrapper with consistent spacing
const StyledFormControl = styled(FormControl)<{ error?: boolean; success?: boolean }>(({ theme, error, success }) => ({
	width: '100%',
	marginBottom: theme.spacing(2),
	
	// Focus ring for accessibility
	'&:focus-within': {
		outline: `2px solid ${theme.palette.primary.main}`,
		outlineOffset: '2px',
		borderRadius: theme.spacing(1),
	},
	
	// Error state styling
	...(error && {
		'& .MuiInputLabel-root': {
			color: theme.palette.error.main,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.error.main,
		},
	}),
	
	// Success state styling
	...(success && {
		'& .MuiInputLabel-root': {
			color: theme.palette.success.main,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.success.main,
		},
	}),
}));

// Enhanced select with design system integration
const StyledSelect = styled(MuiSelect)<AppSelectProps>(({ theme, variant, loading }) => ({
	borderRadius: theme.spacing(1),
	
	// Loading state
	...(loading && {
		opacity: 0.7,
		pointerEvents: 'none',
	}),
	
	// Base styling
	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: theme.palette.divider,
		transition: theme.transitions.create(['border-color', 'box-shadow']),
	},
	
	'&:hover .MuiOutlinedInput-notchedOutline': {
		borderColor: theme.palette.primary.main,
	},
	
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderWidth: '2px',
		borderColor: theme.palette.primary.main,
	},
	
	// Variant-specific styles
	...(variant === 'tournament' && {
		backgroundColor: theme.palette.black[800],
		color: theme.palette.neutral[100],
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.primary.main,
		},
		'& .MuiSvgIcon-root': {
			color: theme.palette.neutral[100],
		},
	}),
	
	...(variant === 'league' && {
		backgroundColor: theme.palette.background.paper,
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: theme.palette.primary.main,
		},
	}),
	
	...(variant === 'compact' && {
		minHeight: '36px',
		'& .MuiSelect-select': {
			paddingTop: theme.spacing(1),
			paddingBottom: theme.spacing(1),
		},
	}),
	
	// Responsive behavior
	[theme.breakpoints.down('tablet')]: {
		fontSize: theme.typography.body2.fontSize,
	},
}));

// Enhanced input label with consistent styling
const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
	color: theme.palette.text.secondary,
	fontSize: theme.typography.body2.fontSize,
	fontWeight: theme.typography.fontWeightMedium,
	
	'&.Mui-focused': {
		color: theme.palette.primary.main,
	},
}));

// Helper text with consistent styling
const StyledHelperText = styled(FormHelperText)<{ error?: boolean; success?: boolean }>(({ theme, error, success }) => ({
	marginLeft: 0,
	marginTop: theme.spacing(0.5),
	fontSize: theme.typography.caption.fontSize,
	
	...(error && {
		color: theme.palette.error.main,
	}),
	
	...(success && {
		color: theme.palette.success.main,
	}),
}));

/**
 * AppSelect Component
 * 
 * Enhanced select component that serves as the base for all select components
 * in the Best Shot application. Includes loading states, variants, and follows
 * our design system patterns.
 * 
 * @example
 * ```tsx
 * <AppSelect 
 *   label="Tournament" 
 *   options={tournamentOptions}
 *   value={selectedTournament}
 *   onChange={handleChange}
 * />
 * 
 * <AppSelect
 *   variant="tournament"
 *   label="Select League"
 *   loading={isLoading}
 *   error={hasError}
 *   errorMessage="Please select a valid league"
 *   helperText="Choose from available leagues"
 * >
 *   <MenuItem value="1">Premier League</MenuItem>
 *   <MenuItem value="2">Champions League</MenuItem>
 * </AppSelect>
 * ```
 */
export const AppSelect = forwardRef<HTMLDivElement, AppSelectProps>(
	({ 
		children,
		label,
		variant = 'default',
		loading = false,
		error = false,
		errorMessage,
		success = false,
		helperText,
		options,
		...props 
	}, ref) => {
		
		// Determine helper text to display
		const displayHelperText = error && errorMessage ? errorMessage : helperText;
		
		return (
			<StyledFormControl 
				ref={ref}
				error={error}
				success={success}
				variant="outlined"
			>
				{label && (
					<StyledInputLabel id={`${props.id || 'select'}-label`}>
						{loading ? 'Loading...' : label}
					</StyledInputLabel>
				)}
				
				<StyledSelect
					labelId={`${props.id || 'select'}-label`}
					label={label}
					variant={variant}
					loading={loading}
					disabled={loading || props.disabled}
					{...props}
				>
					{/* Render options if provided */}
					{options ? (
						options.map((option) => (
							<MenuItem 
								key={option.value} 
								value={option.value}
								disabled={option.disabled}
							>
								{option.label}
							</MenuItem>
						))
					) : children}
				</StyledSelect>
				
				{displayHelperText && (
					<StyledHelperText error={error} success={success}>
						{displayHelperText}
					</StyledHelperText>
				)}
			</StyledFormControl>
		);
	}
);

AppSelect.displayName = 'AppSelect';

// Export for backward compatibility
export { AppSelect as default };