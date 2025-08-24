/**
 * AppTextField - Enhanced Base Text Field Component
 * 
 * Design system base text field following our MUI architecture patterns.
 * This component serves as the foundation for all text input variants across domains.
 */

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

// Extended text field props for our design system
export interface AppTextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
	/**
	 * Whether the field should show a loading state
	 */
	loading?: boolean;
	/**
	 * Enhanced error state with better visual feedback
	 */
	hasError?: boolean;
	/**
	 * Success state for validation feedback
	 */
	hasSuccess?: boolean;
	/**
	 * Variant override - defaults to outlined
	 */
	variant?: 'outlined' | 'filled' | 'standard';
}

// Enhanced styled text field with design system improvements
const StyledTextField = styled(MuiTextField)<AppTextFieldProps>(({ 
	theme, 
	loading, 
	hasError, 
	hasSuccess 
}) => ({
	// Design system base styles (handled by theme overrides)
	
	'& .MuiOutlinedInput-root': {
		// Enhanced border radius
		borderRadius: theme.spacing(1), // 8px
		
		// Loading state
		...(loading && {
			opacity: 0.7,
			pointerEvents: 'none',
			backgroundColor: theme.palette.action.disabled,
		}),
		
		// Error state
		...(hasError && {
			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.palette.error.main,
				borderWidth: '2px',
			},
			
			'&:hover .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.palette.error.dark,
			},
		}),
		
		// Success state
		...(hasSuccess && {
			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.palette.success.main,
				borderWidth: '2px',
			},
			
			'&:hover .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.palette.success.dark,
			},
		}),
		
		// Enhanced focus state
		'&.Mui-focused': {
			'& .MuiOutlinedInput-notchedOutline': {
				borderWidth: '2px',
				borderColor: hasError 
					? theme.palette.error.main 
					: hasSuccess 
						? theme.palette.success.main 
						: theme.palette.primary.main,
			},
		},
		
		// Accessibility improvements
		'&:focus-within': {
			outline: hasError 
				? `2px solid ${theme.palette.error.main}20`
				: hasSuccess 
					? `2px solid ${theme.palette.success.main}20`
					: `2px solid ${theme.palette.primary.main}20`,
			outlineOffset: '2px',
		},
	},
	
	// Label styling
	'& .MuiInputLabel-root': {
		...(hasError && {
			color: theme.palette.error.main,
		}),
		
		...(hasSuccess && {
			color: theme.palette.success.main,
		}),
		
		'&.Mui-focused': {
			color: hasError 
				? theme.palette.error.main 
				: hasSuccess 
					? theme.palette.success.main 
					: theme.palette.primary.main,
		},
	},
	
	// Helper text styling
	'& .MuiFormHelperText-root': {
		marginLeft: theme.spacing(0.5),
		
		...(hasError && {
			color: theme.palette.error.main,
		}),
		
		...(hasSuccess && {
			color: theme.palette.success.main,
		}),
	},
}));

/**
 * AppTextField Component
 * 
 * Enhanced text field component that serves as the base for all text inputs
 * in the Best Shot application. Includes validation states, loading states,
 * and follows our design system patterns.
 * 
 * @example
 * ```tsx
 * <AppTextField
 *   label="Tournament Name"
 *   placeholder="Enter tournament name"
 *   required
 * />
 * 
 * <AppTextField
 *   label="Email"
 *   type="email"
 *   hasError={!!errors.email}
 *   helperText={errors.email?.message}
 * />
 * 
 * <AppTextField
 *   label="Username"
 *   hasSuccess={isUsernameValid}
 *   helperText="Username is available"
 * />
 * ```
 */
export const AppTextField = forwardRef<HTMLDivElement, AppTextFieldProps>(
	({ 
		loading = false, 
		hasError = false, 
		hasSuccess = false,
		disabled,
		error,
		...props 
	}, ref) => {
		// Combine error states
		const isError = hasError || error;
		
		return (
			<StyledTextField
				ref={ref}
				disabled={disabled || loading}
				error={isError}
				loading={loading}
				hasError={isError}
				hasSuccess={hasSuccess && !isError}
				variant="outlined"
				{...props}
			/>
		);
	}
);

AppTextField.displayName = 'AppTextField';

// Export for backward compatibility
export { AppTextField as default };