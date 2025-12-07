import { Box, TextField, Typography } from "@mui/material";
import {
	type Control,
	Controller,
	type ControllerRenderProps,
	type FieldError,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

interface Team {
	id: string;
	name: string;
	logo?: string;
}

interface AppFormScoreInputProps<T extends FieldValues> {
	homeTeam: Team;
	awayTeam: Team;
	homeScoreName: FieldPath<T>;
	awayScoreName: FieldPath<T>;
	control: Control<T>;
	disabled?: boolean;
	size?: "small" | "medium" | "large";
}

interface SizeStyles {
	teamName: { fontSize: string; mb: number };
	input: { minWidth: string; textAlign: "center" };
	vs: { fontSize: string; mx: number };
}

// Extracted components to reduce complexity
const TeamLogo = ({
	logo,
	name,
	size,
}: {
	logo?: string;
	name: string;
	size: "small" | "medium" | "large";
}) => {
	if (!logo) return null;

	const logoSize = size === "small" ? 24 : size === "medium" ? 32 : 40;

	return (
		<Box
			component="img"
			src={logo}
			alt={`${name} logo`}
			sx={{
				width: logoSize,
				height: logoSize,
				mb: 0.5,
			}}
		/>
	);
};

const TeamName = ({ name, styles }: { name: string; styles: SizeStyles }) => (
	<Typography
		variant="caption"
		sx={{
			...styles.teamName,
			display: "block",
			fontWeight: 500,
			color: "text.primary",
		}}
	>
		{name}
	</Typography>
);

// Extracted TextField styling to reduce complexity
const ScoreTextField = <T extends FieldValues>({
	field,
	fieldState,
	disabled,
	styles,
	size,
}: {
	field: ControllerRenderProps<T, FieldPath<T>>;
	fieldState: { error?: FieldError };
	disabled: boolean;
	styles: SizeStyles;
	size: "small" | "medium" | "large";
}) => (
	<TextField
		{...field}
		type="number"
		disabled={disabled}
		error={!!fieldState.error}
		inputProps={{
			min: 0,
			max: 20,
			step: 1,
		}}
		sx={{
			...styles.input,
			"& .MuiOutlinedInput-root": {
				backgroundColor: "black.800",
				"& fieldset": {
					borderColor: fieldState.error ? "error.main" : "black.400",
					borderWidth: "2px",
				},
				"&:hover fieldset": {
					borderColor: fieldState.error ? "error.main" : "black.300",
				},
				"&.Mui-focused fieldset": {
					borderColor: fieldState.error ? "error.main" : "primary.main",
					boxShadow: `0 0 0 2px ${fieldState.error ? "rgba(244, 67, 54, 0.1)" : "rgba(25, 118, 210, 0.1)"}`,
				},
				"& .MuiInputBase-input": {
					padding: size === "small" ? 1 : size === "medium" ? 1.5 : 2,
					fontSize: size === "small" ? "1rem" : size === "medium" ? "1.25rem" : "1.5rem",
					fontWeight: "bold",
					color: "text.primary",
					textAlign: "center",
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
);

const ScoreInput = <T extends FieldValues>({
	name,
	control,
	disabled,
	styles,
	size,
}: {
	name: FieldPath<T>;
	control: Control<T>;
	disabled: boolean;
	styles: SizeStyles;
	size: "small" | "medium" | "large";
}) => (
	<Controller
		name={name}
		control={control}
		render={({ field, fieldState }) => (
			<ScoreTextField
				field={field}
				fieldState={fieldState}
				disabled={disabled}
				styles={styles}
				size={size}
			/>
		)}
	/>
);

const TeamSection = <T extends FieldValues>({
	team,
	scoreName,
	control,
	disabled,
	styles,
	size,
}: {
	team: Team;
	scoreName: FieldPath<T>;
	control: Control<T>;
	disabled: boolean;
	styles: SizeStyles;
	size: "small" | "medium" | "large";
}) => (
	<Box sx={{ flex: 1, textAlign: "center" }}>
		<TeamLogo logo={team.logo} name={team.name} size={size} />
		<TeamName name={team.name} styles={styles} />
		<ScoreInput
			name={scoreName}
			control={control}
			disabled={disabled}
			styles={styles}
			size={size}
		/>
	</Box>
);

const VSSeparator = ({ styles }: { styles: SizeStyles }) => (
	<Box sx={{ display: "flex", alignItems: "center", ...styles.vs }}>
		<Typography
			variant="h6"
			sx={{
				color: "text.secondary",
				fontWeight: "bold",
				fontSize: styles.vs.fontSize,
			}}
		>
			VS
		</Typography>
	</Box>
);

const ErrorDisplay = <T extends FieldValues>({
	homeScoreName,
	awayScoreName,
	control,
}: {
	homeScoreName: FieldPath<T>;
	awayScoreName: FieldPath<T>;
	control: Control<T>;
}) => {
	return (
		<Controller
			name={homeScoreName}
			control={control}
			render={({ fieldState: homeFieldState }) => (
				<Controller
					name={awayScoreName}
					control={control}
					render={({ fieldState: awayFieldState }) => {
						const hasError = homeFieldState.error || awayFieldState.error;
						const errorMessage = homeFieldState.error?.message || awayFieldState.error?.message;

						if (!hasError) return null;

						return (
							<Typography
								variant="caption"
								color="error.main"
								sx={{
									mt: 1,
									display: "block",
									textAlign: "center",
									fontSize: "0.75rem",
								}}
							>
								{errorMessage}
							</Typography>
						);
					}}
				/>
			)}
		/>
	);
};

export const AppFormScoreInput = <T extends FieldValues>({
	homeTeam,
	awayTeam,
	homeScoreName,
	awayScoreName,
	control,
	disabled = false,
	size = "medium",
}: AppFormScoreInputProps<T>) => {
	const sizeStyles: Record<"small" | "medium" | "large", SizeStyles> = {
		small: {
			teamName: { fontSize: "0.75rem", mb: 0.5 },
			input: { minWidth: "60px", textAlign: "center" as const },
			vs: { fontSize: "0.875rem", mx: 1 },
		},
		medium: {
			teamName: { fontSize: "0.875rem", mb: 1 },
			input: { minWidth: "80px", textAlign: "center" as const },
			vs: { fontSize: "1rem", mx: 2 },
		},
		large: {
			teamName: { fontSize: "1rem", mb: 1 },
			input: { minWidth: "100px", textAlign: "center" as const },
			vs: { fontSize: "1.25rem", mx: 2 },
		},
	};

	const styles = sizeStyles[size];

	return (
		<Box sx={{ mb: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
				<TeamSection
					team={homeTeam}
					scoreName={homeScoreName}
					control={control}
					disabled={disabled}
					styles={styles}
					size={size}
				/>
				<VSSeparator styles={styles} />
				<TeamSection
					team={awayTeam}
					scoreName={awayScoreName}
					control={control}
					disabled={disabled}
					styles={styles}
					size={size}
				/>
			</Box>
			<ErrorDisplay homeScoreName={homeScoreName} awayScoreName={awayScoreName} control={control} />
		</Box>
	);
};
