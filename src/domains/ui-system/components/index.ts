/**
 * UI System Components Index
 * 
 * Centralized exports for all enhanced base components following
 * the Best Shot design system architecture.
 */

// Enhanced Base Components
export { AppButton } from './app-button/app-button';
export type { AppButtonProps } from './app-button/app-button';

export { AppCard } from './app-card/app-card';
export type { AppCardProps } from './app-card/app-card';

export { AppTextField } from './app-text-field/app-text-field';
export type { AppTextFieldProps } from './app-text-field/app-text-field';

// Existing Components (for backward compatibility)
export { AppIcon } from './icon/icon';
export { AppSurface } from './surface/surface';

// Re-export existing legacy components during transition
// TODO: Gradually migrate these to the new architecture
// export { AppButton as LegacyButton } from './button/button';

// Component Collections
export const BaseComponents = {
	AppButton,
	AppCard, 
	AppTextField,
} as const;

export const UIComponents = {
	AppIcon,
	AppSurface,
} as const;