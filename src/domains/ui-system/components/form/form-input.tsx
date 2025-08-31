import { Box, TextField, Typography } from "@mui/material";
import {
	Controller,
	type ControllerRenderProps,
	type FieldError,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";
import { AppInput } from "@/domains/ui-system/components/input/input";
import type { AppFormInputProps } from "@/types/ui-system";
import "@/types/mui-overrides.d";

// Helper components to reduce complexity
const FormLabel = ({
	label,
	required,
	hasError,
}: {
	label: React.ReactNode;
	required: boolean;
	hasError: boolean;
}) => (
	<Typography
		variant="caption"
		sx={{
			mb: 0.5,
			display: "block",
			fontWeight: 500,
			textTransform: "uppercase",
			fontSize: "0.75rem",
			letterSpacing: "0.5px",
		}}
		color={hasError ? "error.main" : "neutral.200"}
	>
		{label} {required && "*"}
	</Typography>
);

const MultilineInput = <T extends FieldValues>({
	field,
	fieldState,
	placeholder,
	disabled,
	rows,
}: {
	field: ControllerRenderProps<T, FieldPath<T>>;
	fieldState: { error?: FieldError };
	placeholder?: string;
	disabled?: boolean;
	rows?: number;
}) => (
	<TextField
		{...field}
		placeholder={placeholder}
		disabled={disabled}
		multiline
		rows={rows}
		error={!!fieldState.error}
		fullWidth
		sx={{
			"& .MuiOutlinedInput-root": {
				backgroundColor: "black.800",
				"& fieldset": {
					borderColor: fieldState.error ? "error.main" : "black.400",
				},
				"&:hover fieldset": {
					borderColor: fieldState.error ? "error.main" : "black.300",
				},
				"&.Mui-focused fieldset": {
					borderColor: fieldState.error ? "error.main" : "primary.main",
					boxShadow: `0 0 0 2px ${fieldState.error ? "rgba(244, 67, 54, 0.1)" : "rgba(25, 118, 210, 0.1)"}`,
				},
				"& .MuiInputBase-input": {
					color: "neutral.100",
					fontSize: "0.875rem",
					"&::placeholder": {
						color: "neutral.400",
						opacity: 0.7,
					},
				},
				"&.Mui-disabled": {
					backgroundColor: "black.600",
					"& .MuiInputBase-input": {
						color: "neutral.500",
						cursor: "not-allowed",
					},
				},
			},
		}}
	/>
);

const SingleLineInput = <T extends FieldValues>({
	field,
	type,
	placeholder,
	disabled,
	fieldState,
}: {
	field: ControllerRenderProps<T, FieldPath<T>>;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	fieldState: { error?: FieldError };
}) => (
	<AppInput
		{...field}
		type={type}
		placeholder={placeholder}
		disabled={disabled}
		error={!!fieldState.error}
	/>
);

const FormHelperText = ({
	fieldState,
	helperText,
}: {
	fieldState: { error?: FieldError };
	helperText?: React.ReactNode;
}) => {
	if (!fieldState.error?.message && !helperText) return null;

	return (
		<Typography
			variant="caption"
			color={fieldState.error ? "error.main" : "neutral.400"}
			sx={{
				mt: 0.5,
				display: "block",
				fontSize: "0.75rem",
			}}
		>
			{fieldState.error?.message || helperText}
		</Typography>
	);
};

const FormFieldContent = <T extends FieldValues>({
	field,
	fieldState,
	multiline,
	type,
	placeholder,
	disabled,
	rows,
}: {
	field: ControllerRenderProps<T, FieldPath<T>>;
	fieldState: { error?: FieldError };
	multiline?: boolean;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	rows?: number;
}) => {
	if (multiline) {
		return (
			<MultilineInput
				field={field}
				fieldState={fieldState}
				placeholder={placeholder}
				disabled={disabled}
				rows={rows}
			/>
		);
	}
	return (
		<SingleLineInput
			field={field}
			type={type}
			placeholder={placeholder}
			disabled={disabled}
			fieldState={fieldState}
		/>
	);
};

export const AppFormInput = <T extends FieldValues>({
	name,
	control,
	label,
	placeholder,
	type = "text",
	disabled = false,
	required = false,
	multiline = false,
	rows = 1,
	helperText,
}: AppFormInputProps<T>) => (
	<Controller
		name={name}
		control={control}
		render={({ field, fieldState }) => (
			<Box sx={{ mb: 2 }}>
				{label && <FormLabel label={label} required={required} hasError={!!fieldState.error} />}

				<FormFieldContent
					field={field}
					fieldState={fieldState}
					multiline={multiline}
					type={type}
					placeholder={placeholder}
					disabled={disabled}
					rows={rows}
				/>

				<FormHelperText fieldState={fieldState} helperText={helperText} />
			</Box>
		)}
	/>
);
