import { Box, Typography, TextField } from "@mui/material";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

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

export const AppFormScoreInput = <T extends FieldValues>({
	homeTeam,
	awayTeam,
	homeScoreName,
	awayScoreName,
	control,
	disabled = false,
	size = "medium",
}: AppFormScoreInputProps<T>) => {
	const sizeStyles = {
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
				{/* Home Team */}
				<Box sx={{ flex: 1, textAlign: "center" }}>
					{homeTeam.logo && (
						<Box
							component="img"
							src={homeTeam.logo}
							alt={`${homeTeam.name} logo`}
							sx={{
								width: size === "small" ? 24 : size === "medium" ? 32 : 40,
								height: size === "small" ? 24 : size === "medium" ? 32 : 40,
								mb: 0.5,
							}}
						/>
					)}
					
					<Typography
						variant="caption"
						sx={{
							...styles.teamName,
							display: "block",
							fontWeight: 500,
							color: "text.primary",
						}}
					>
						{homeTeam.name}
					</Typography>

					<Controller
						name={homeScoreName}
						control={control}
						render={({ field, fieldState }) => (
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
						)}
					/>
				</Box>

				{/* VS Separator */}
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

				{/* Away Team */}
				<Box sx={{ flex: 1, textAlign: "center" }}>
					{awayTeam.logo && (
						<Box
							component="img"
							src={awayTeam.logo}
							alt={`${awayTeam.name} logo`}
							sx={{
								width: size === "small" ? 24 : size === "medium" ? 32 : 40,
								height: size === "small" ? 24 : size === "medium" ? 32 : 40,
								mb: 0.5,
							}}
						/>
					)}
					
					<Typography
						variant="caption"
						sx={{
							...styles.teamName,
							display: "block",
							fontWeight: 500,
							color: "text.primary",
						}}
					>
						{awayTeam.name}
					</Typography>

					<Controller
						name={awayScoreName}
						control={control}
						render={({ field, fieldState }) => (
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
						)}
					/>
				</Box>
			</Box>

			{/* Error Messages */}
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

							return (
								<>
									{hasError && (
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
									)}
								</>
							);
						}}
					/>
				)}
			/>
		</Box>
	);
};