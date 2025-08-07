/**
 * UI System Components Index
 * 
 * Centralized exports for all enhanced base components following
 * the Best Shot design system architecture.
 */

// Enhanced Base Components
export { AppButton } from './app-button/app-button';
export type { AppButtonProps } from './app-button/app-button';

export { AppCard } from './app-card/AppCard';
export type { AppCardProps } from './app-card/AppCard';

export { AppContainer } from './app-container/AppContainer';
export type { AppContainerProps } from './app-container/AppContainer';

export { AppBox } from './app-box/AppBox';
export type { AppBoxProps } from './app-box/AppBox';

export { AppTextField } from './app-text-field/app-text-field';
export type { AppTextFieldProps } from './app-text-field/app-text-field';

export { AppSelect } from './app-select/AppSelect';
export type { AppSelectProps } from './app-select/AppSelect';

export { AppCheckbox } from './app-checkbox/AppCheckbox';
export type { AppCheckboxProps } from './app-checkbox/AppCheckbox';

// Existing Components (for backward compatibility)
export { AppIcon } from './icon/icon';
export { Surface as AppSurface } from './surface/surface';

// Legacy component aliases (TRANSITIONAL - Remove after migration)
export { AppButton as Button } from './app-button/app-button';  // Legacy alias
export { AppCard as Card } from './app-card/AppCard';           // Legacy alias

// TODO: Remove these aliases after migrating all imports to AppButton/AppCard

// Component Collections  
import { AppButton } from './app-button/app-button';
import { AppCard } from './app-card/AppCard';
import { AppContainer } from './app-container/AppContainer';
import { AppBox } from './app-box/AppBox';
import { AppTextField } from './app-text-field/app-text-field';
import { AppSelect } from './app-select/AppSelect';
import { AppCheckbox } from './app-checkbox/AppCheckbox';
import { AppIcon } from './icon/icon';
import { Surface as AppSurface } from './surface/surface';

export const BaseComponents = {
	AppButton,
	AppCard,
	AppContainer,
	AppBox,
	AppTextField,
	AppSelect,
	AppCheckbox,
} as const;

export const UIComponents = {
	AppIcon,
	AppSurface,
} as const;