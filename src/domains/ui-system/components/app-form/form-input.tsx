import { Box, TextField, Typography } from "@mui/material";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";
import { AppInput } from "@/domains/ui-system/components/app-input/input/app-input";

interface AppFormInputProps<T extends FieldValues> {
	name: FieldPath<T>;
	control: Control<T>;
	label?: string;
	placeholder?: string;
	type?: "text" | "email" | "password" | "number" | "tel" | "url";
	disabled?: boolean;
	required?: boolean;
	multiline?: boolean;
	rows?: number;
	helperText?: string;
}

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
				{label && (
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
						color={fieldState.error ? "error.main" : "text.primary"}
					>
						{label} {required && "*"}
					</Typography>
				)}

				{multiline ? (
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
									color: "text.primary",
									fontSize: "0.875rem",
									"&::placeholder": {
										color: "text.secondary",
										opacity: 0.7,
									},
								},
								"&.Mui-disabled": {
									backgroundColor: "black.600",
									"& .MuiInputBase-input": {
										color: "text.disabled",
										cursor: "not-allowed",
									},
								},
							},
						}}
					/>
				) : (
					<AppInput
						{...field}
						type={type}
						placeholder={placeholder}
						disabled={disabled}
						error={!!fieldState.error}
					/>
				)}

				{(fieldState.error?.message || helperText) && (
					<Typography
						variant="caption"
						color={fieldState.error ? "error.main" : "text.secondary"}
						sx={{
							mt: 0.5,
							display: "block",
							fontSize: "0.75rem",
						}}
					>
						{fieldState.error?.message || helperText}
					</Typography>
				)}
			</Box>
		)}
	/>
);
