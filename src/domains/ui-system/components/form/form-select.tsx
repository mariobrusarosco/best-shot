import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import {
	type Control,
	Controller,
	type ControllerRenderProps,
	type FieldError,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

interface SelectOption {
	value: string | number;
	label: string;
	disabled?: boolean;
}

interface AppFormSelectProps<T extends FieldValues> {
	name: FieldPath<T>;
	control: Control<T>;
	label?: string;
	options: SelectOption[];
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	helperText?: string;
}

// Extracted components to reduce complexity
const FormLabel = ({
	label,
	required,
	hasError,
}: {
	label: string;
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

const SelectField = <T extends FieldValues>({
	field,
	fieldState,
	disabled,
	placeholder,
	options,
}: {
	field: ControllerRenderProps<T, FieldPath<T>>;
	fieldState: { error?: FieldError };
	disabled: boolean;
	placeholder: string;
	options: SelectOption[];
}) => (
	<FormControl fullWidth error={!!fieldState.error}>
		<Select
			{...field}
			disabled={disabled}
			displayEmpty
			sx={{
				backgroundColor: "black.800",
				"& .MuiOutlinedInput-notchedOutline": {
					borderColor: fieldState.error ? "error.main" : "black.400",
				},
				"&:hover .MuiOutlinedInput-notchedOutline": {
					borderColor: fieldState.error ? "error.main" : "black.300",
				},
				"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
					borderColor: fieldState.error ? "error.main" : "primary.main",
					boxShadow: `0 0 0 2px ${fieldState.error ? "rgba(244, 67, 54, 0.1)" : "rgba(25, 118, 210, 0.1)"}`,
				},
				"& .MuiSelect-select": {
					color: field.value ? "neutral.100" : "neutral.400",
					fontSize: "0.875rem",
				},
				"&.Mui-disabled": {
					backgroundColor: "black.600",
					"& .MuiSelect-select": {
						color: "neutral.500",
					},
				},
			}}
			MenuProps={{
				PaperProps: {
					sx: {
						backgroundColor: "black.800",
						border: "1px solid",
						borderColor: "neutral.600",
						"& .MuiMenuItem-root": {
							color: "neutral.100",
							backgroundColor: "transparent",
							"&:hover": {
								backgroundColor: "black.700",
							},
							"&.Mui-selected": {
								backgroundColor: "teal.500",
								color: "neutral.100",
								"&:hover": {
									backgroundColor: "teal.600",
								},
							},
							"&.Mui-disabled": {
								color: "neutral.500",
							},
						},
					},
				},
			}}
		>
			<MenuItem value="" disabled>
				<Typography color="neutral.400" sx={{ fontStyle: "italic" }}>
					{placeholder}
				</Typography>
			</MenuItem>

			{options.map((option) => (
				<MenuItem key={option.value} value={option.value} disabled={option.disabled}>
					{option.label}
				</MenuItem>
			))}
		</Select>
	</FormControl>
);

const HelperText = ({
	fieldState,
	helperText,
}: {
	fieldState: { error?: FieldError };
	helperText?: string;
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

export const AppFormSelect = <T extends FieldValues>({
	name,
	control,
	label,
	options,
	placeholder = "Select an option...",
	disabled = false,
	required = false,
	helperText,
}: AppFormSelectProps<T>) => (
	<Controller
		name={name}
		control={control}
		render={({ field, fieldState }) => (
			<Box sx={{ mb: 2 }}>
				{label && <FormLabel label={label} required={required} hasError={!!fieldState.error} />}

				<SelectField
					field={field}
					fieldState={fieldState}
					disabled={disabled}
					placeholder={placeholder}
					options={options}
				/>

				<HelperText fieldState={fieldState} helperText={helperText} />
			</Box>
		)}
	/>
);
