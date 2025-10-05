/**
 * UI System Components Index
 *
 * Centralized exports for all enhanced base components following
 * the Best Shot design system architecture.
 */

// Export centralized types
export type {
	AppBoxProps,
	AppButtonProps,
	AppCardProps,
	AppCheckboxProps,
	AppFormCheckboxProps,
	AppFormInputProps,
	AppFormSelectProps,
	AppSelectProps,
	AppTextFieldProps,
	AppTypographyProps,
	BaseComponentProps,
	ButtonVariant,
	CardVariant,
	CheckboxVariant,
	ErrorProps,
	HelperTextProps,
	LoadingProps,
	SelectVariant,
	SuccessProps,
	TextFieldVariant,
	TypographyVariant,
} from "@/types/ui-system";

// Enhanced Base Components
// Legacy component aliases (TRANSITIONAL - Remove after migration)
export { AppButton, AppButton as Button } from "./app-button/app-button";
export { AppCard, AppCard as Card } from "./app-card/AppCard";
export { AppCheckbox } from "./app-checkbox/AppCheckbox";
export type { AppContainerProps } from "./app-container/AppContainer";
export { AppContainer } from "./app-container/AppContainer";
export { AppSelect } from "./app-select/AppSelect";
export { AppTextField } from "./app-text-field/app-text-field";

// Existing Components (for backward compatibility)
export { AppIcon } from "./icon/icon";
export { Surface as AppSurface } from "./surface/surface";
export { AppTypography } from "./typography";

// TODO: Remove these aliases after migrating all imports to AppButton/AppCard

import { AppBox } from "./app-box/AppBox";
// Component Collections
import { AppButton } from "./app-button/app-button";
import { AppCard } from "./app-card/AppCard";
import { AppCheckbox } from "./app-checkbox/AppCheckbox";
import { AppContainer } from "./app-container/AppContainer";
import { AppSelect } from "./app-select/AppSelect";
import { AppTextField } from "./app-text-field/app-text-field";
import { AppIcon } from "./icon/icon";
import { Surface as AppSurface } from "./surface/surface";
import { AppTypography } from "./typography";

export const BaseComponents = {
	AppButton,
	AppCard,
	AppContainer,
	AppBox,
	AppTextField,
	AppSelect,
	AppCheckbox,
	AppTypography,
} as const;

export const UIComponents = {
	AppIcon,
	AppSurface,
} as const;
