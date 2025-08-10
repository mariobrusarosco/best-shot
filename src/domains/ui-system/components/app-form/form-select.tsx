import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

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
								color: field.value ? "text.primary" : "text.secondary",
								fontSize: "0.875rem",
							},
							"&.Mui-disabled": {
								backgroundColor: "black.600",
								"& .MuiSelect-select": {
									color: "text.disabled",
								},
							},
						}}
						MenuProps={{
							PaperProps: {
								sx: {
									backgroundColor: "black.700",
									border: "1px solid",
									borderColor: "black.400",
									"& .MuiMenuItem-root": {
										color: "text.primary",
										"&:hover": {
											backgroundColor: "black.600",
										},
										"&.Mui-selected": {
											backgroundColor: "primary.dark",
											"&:hover": {
												backgroundColor: "primary.main",
											},
										},
										"&.Mui-disabled": {
											color: "text.disabled",
										},
									},
								},
							},
						}}
					>
						<MenuItem value="" disabled>
							<Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
								{placeholder}
							</Typography>
						</MenuItem>
						
						{options.map((option) => (
							<MenuItem 
								key={option.value} 
								value={option.value}
								disabled={option.disabled}
							>
								{option.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>

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