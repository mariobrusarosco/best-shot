import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/system";
import { TextField } from "@mui/material";
import { Dayjs } from "dayjs";

interface AppDatePickerProps {
	label?: string;
	value?: Dayjs | null;
	onChange?: (value: Dayjs | null) => void;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	placeholder?: string;
	fullWidth?: boolean;
	variant?: "outlined" | "filled" | "standard";
	size?: "small" | "medium";
	minDate?: Dayjs;
	maxDate?: Dayjs;
	disablePast?: boolean;
	disableFuture?: boolean;
	format?: string;
}

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
	"& .MuiInputBase-root": {
		borderRadius: theme.shape.borderRadius,
	},
	"& .MuiOutlinedInput-root": {
		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.primary.main,
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: theme.palette.primary.main,
		},
	},
}));

export const AppDatePicker = ({
	label = "Select Date",
	value = null,
	onChange,
	disabled = false,
	error = false,
	helperText,
	placeholder,
	fullWidth = true,
	variant = "outlined",
	size = "medium",
	minDate,
	maxDate,
	disablePast = false,
	disableFuture = false,
	format = "DD/MM/YYYY",
	...props
}: AppDatePickerProps) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<StyledDatePicker
				label={label}
				value={value}
				onChange={onChange}
				disabled={disabled}
				minDate={minDate}
				maxDate={maxDate}
				disablePast={disablePast}
				disableFuture={disableFuture}
				format={format}
				enableAccessibleFieldDOMStructure={false}
				slots={{
					textField: TextField,
				}}
				slotProps={{
					textField: {
						error,
						helperText,
						placeholder,
						fullWidth,
						variant,
						size,
					},
				}}
				{...props}
			/>
		</LocalizationProvider>
	);
};