import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";

interface AppFormCheckboxProps<T extends FieldValues> {
	name: FieldPath<T>;
	control: Control<T>;
	label: string;
	disabled?: boolean;
	helperText?: string;
}

export const AppFormCheckbox = <T extends FieldValues>({
	name,
	control,
	label,
	disabled = false,
	helperText,
}: AppFormCheckboxProps<T>) => (
	<Controller
		name={name}
		control={control}
		render={({ field, fieldState }) => (
			<Box sx={{ mb: 2 }}>
				<FormControlLabel
					control={
						<Checkbox
							{...field}
							checked={field.value || false}
							disabled={disabled}
							sx={{
								color: fieldState.error ? "error.main" : "primary.main",
								"&.Mui-checked": {
									color: fieldState.error ? "error.main" : "primary.main",
								},
								"&.Mui-disabled": {
									color: "text.disabled",
								},
								"& .MuiSvgIcon-root": {
									fontSize: "1.25rem",
								},
							}}
						/>
					}
					label={
						<Typography
							sx={{
								color: fieldState.error ? "error.main" : "text.primary",
								fontSize: "0.875rem",
								fontWeight: 400,
								userSelect: "none",
							}}
						>
							{label}
						</Typography>
					}
					sx={{
						alignItems: "flex-start",
						margin: 0,
						"& .MuiFormControlLabel-label": {
							paddingLeft: 1,
						},
					}}
				/>

				{(fieldState.error?.message || helperText) && (
					<Typography
						variant="caption"
						color={fieldState.error ? "error.main" : "text.secondary"}
						sx={{
							mt: 0.5,
							ml: 4,
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
