import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, styled } from "@mui/material";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useAdminCreateTournament } from "@/domains/admin/hooks/use-admin-create-tournament";
import { CreateTournamentSchema } from "@/domains/admin/schemas";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppFormInput } from "@/domains/ui-system/components/form/form-input";
import { AppFormSelect } from "@/domains/ui-system/components/form/form-select";

interface CreateTournamentModalProps {
	onClose: () => void;
}

type CreateTournamentInput = z.infer<typeof CreateTournamentSchema>;

const providerOptions = [
	{ value: "sofa", label: "SofaScore" },
	{ value: "espn", label: "ESPN" },
	{ value: "api-football", label: "API-Football" },
];

const modeOptions = [
	{ value: "regular-season-and-knockout", label: "Regular Season + Knockout" },
	{ value: "regular-season", label: "Regular Season Only" },
	{ value: "knockout", label: "Knockout Only" },
	{ value: "group-stage", label: "Group Stage" },
];

const standingsModeOptions = [
	{ value: "multi-group", label: "Multi-Group" },
	{ value: "single-table", label: "Single Table" },
	{ value: "conference", label: "Conference" },
	{ value: "knockout-only", label: "Knockout Only" },
];

const StyledDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialog-paper": {
		backgroundColor: "#0a0a0a",
		border: `1px solid ${theme.palette.neutral[800]}`,
		borderRadius: 12,
		color: theme.palette.neutral[100],
	},
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
	padding: theme.spacing(3, 3, 0, 3),
	borderBottom: "none",
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
	padding: theme.spacing(2, 3, 0, 3),
	backgroundColor: "#0a0a0a",
	"&::-webkit-scrollbar": {
		width: "6px",
	},
	"&::-webkit-scrollbar-track": {
		background: theme.palette.black[800],
	},
	"&::-webkit-scrollbar-thumb": {
		background: theme.palette.neutral[600],
		borderRadius: "3px",
	},
}));

const IconContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: 48,
	height: 48,
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],
}));

const SectionContainer = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	padding: theme.spacing(2.5),
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(1.5),
	marginBottom: theme.spacing(2.5),
	paddingBottom: theme.spacing(1.5),
	borderBottom: `1px solid ${theme.palette.neutral[700]}`,
}));

const FormContainer = styled(Box)(({ theme }) => ({
	"& .MuiFormControl-root": {
		"& .MuiOutlinedInput-root": {
			backgroundColor: "#0a0a0a",
			color: theme.palette.neutral[100],
			"& fieldset": {
				borderColor: theme.palette.neutral[600],
			},
			"&:hover fieldset": {
				borderColor: theme.palette.neutral[500],
			},
			"&.Mui-focused fieldset": {
				borderColor: theme.palette.teal[500],
				boxShadow: `0 0 0 2px ${theme.palette.teal[500]}20`,
			},
			"& .MuiInputBase-input": {
				color: theme.palette.neutral[100],
				"&::placeholder": {
					color: theme.palette.neutral[400],
					opacity: 1,
				},
			},
		},
		"& .MuiSelect-select": {
			backgroundColor: "#0a0a0a",
			color: theme.palette.neutral[100],
		},
	},
	"& .MuiInputBase-input": {
		backgroundColor: "#0a0a0a",
		color: theme.palette.neutral[100],
		border: `1px solid ${theme.palette.neutral[600]}`,
		borderRadius: theme.shape.borderRadius,
		padding: theme.spacing(1.5),
		"&:hover": {
			borderColor: theme.palette.neutral[500],
		},
		"&:focus": {
			borderColor: theme.palette.teal[500],
			outline: "none",
			boxShadow: `0 0 0 2px ${theme.palette.teal[500]}20`,
		},
		"&::placeholder": {
			color: theme.palette.neutral[400],
			opacity: 1,
		},
	},
	"& .MuiTypography-root": {
		color: theme.palette.neutral[200],
		"&[variant='caption']": {
			color: theme.palette.neutral[300],
			fontWeight: 600,
		},
	},
	"& .MuiMenuItem-root": {
		color: theme.palette.neutral[100],
		backgroundColor: theme.palette.black[800],
		"&:hover": {
			backgroundColor: theme.palette.black[700],
		},
		"&.Mui-selected": {
			backgroundColor: theme.palette.teal[500],
			color: theme.palette.neutral[100],
			"&:hover": {
				backgroundColor: theme.palette.teal[600],
			},
		},
	},
	"& .MuiPaper-root": {
		backgroundColor: theme.palette.black[800],
		border: `1px solid ${theme.palette.neutral[600]}`,
	},
}));

export const CreateTournamentModal = ({ onClose }: CreateTournamentModalProps) => {
	const createTournament = useAdminCreateTournament();

	const { control, handleSubmit, watch } = useForm<CreateTournamentInput>({
		resolver: zodResolver(CreateTournamentSchema),
		defaultValues: {
			tournamentPublicId: "",
			baseUrl: "",
			label: "",
			slug: "",
			provider: "sofa",
			season: new Date().getFullYear().toString(),
			mode: "regular-season-and-knockout",
			logoUrl: "",
			standingsMode: "multi-group",
		},
	});

	const label = watch("label");

	// Auto-generate slug from label
	const generateSlug = (value: string) => {
		return value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	};

	const onSubmit = async (data: CreateTournamentInput) => {
		try {
			// Auto-generate slug if empty
			const finalData = {
				...data,
				slug: data.slug || generateSlug(data.label),
			};

			await createTournament.mutateAsync(finalData);
			onClose();
		} catch (error) {
			console.error("Failed to create tournament:", error);
		}
	};

	return (
		<StyledDialog
			open
			onClose={onClose}
			maxWidth="laptop"
			fullWidth
			slotProps={{
				backdrop: {
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.75)",
					},
				},
			}}
		>
			<StyledDialogTitle>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
					<IconContainer>
						<AppIcon name="Plus" size="medium" />
					</IconContainer>
					<Box>
						<AppTypography variant="h5" color="neutral.100" fontWeight="bold">
							Create New Tournament
						</AppTypography>
						<AppTypography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
							Add a new tournament to the admin dashboard for data provider management
						</AppTypography>
					</Box>
				</Box>
			</StyledDialogTitle>

			<StyledDialogContent>
				<FormContainer>
					<Box component="form" onSubmit={handleSubmit(onSubmit)}>
						{/* Basic Information */}
						<SectionContainer>
							<SectionHeader>
								<AppIcon name="Users" size="small" color="teal.500" />
								<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
									Basic Information
								</AppTypography>
							</SectionHeader>

							<AppFormInput
								name="label"
								control={control}
								label="Tournament Name"
								placeholder="e.g., Conmebol Libertadores 25"
								required
							/>

							<AppFormInput
								name="slug"
								control={control}
								label="Tournament Slug"
								placeholder={label ? generateSlug(label) : "e.g., conmebol-libertadores-25"}
								helperText="Leave empty to auto-generate from tournament name"
							/>

							<AppFormInput
								name="season"
								control={control}
								label="Season"
								placeholder="e.g., 2025"
								required
							/>
						</SectionContainer>

						{/* Data Provider Configuration */}
						<SectionContainer>
							<SectionHeader>
								<AppIcon name="LayoutDashboard" size="small" color="teal.500" />
								<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
									Data Provider Configuration
								</AppTypography>
							</SectionHeader>

							<AppFormSelect
								name="provider"
								control={control}
								label="Data Provider"
								options={providerOptions}
								required
							/>

							<AppFormInput
								name="tournamentPublicId"
								control={control}
								label="Tournament Public ID"
								placeholder="e.g., 384"
								helperText="The unique identifier from the data provider"
								required
							/>

							<AppFormInput
								name="baseUrl"
								control={control}
								label="Base URL"
								placeholder="e.g., https://www.sofascore.com/api/v1/unique-tournament/384/season/70083"
								helperText="The API endpoint for this tournament"
								required
							/>
						</SectionContainer>

						{/* Tournament Configuration */}
						<SectionContainer>
							<SectionHeader>
								<AppIcon name="Trophy" size="small" color="teal.500" />
								<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
									Tournament Configuration
								</AppTypography>
							</SectionHeader>

							<AppFormSelect
								name="mode"
								control={control}
								label="Tournament Mode"
								options={modeOptions}
								required
							/>

							<AppFormSelect
								name="standingsMode"
								control={control}
								label="Standings Mode"
								options={standingsModeOptions}
								required
							/>

							<AppFormInput
								name="logoUrl"
								control={control}
								label="Logo URL"
								placeholder="e.g., https://img.sofascore.com/api/v1/unique-tournament/384/image"
								helperText="URL to the tournament logo image"
								required
							/>
						</SectionContainer>

						{/* Preview */}
						{label && (
							<SectionContainer sx={{ backgroundColor: "black.700" }}>
								<SectionHeader>
									<AppIcon name="ClockFilled" size="small" color="teal.500" />
									<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
										Tournament Preview
									</AppTypography>
								</SectionHeader>
								<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
									<AppTypography variant="h6" color="neutral.100" fontWeight="bold">
										{label} ({watch("season")})
									</AppTypography>
									<AppTypography variant="body2" color="text.secondary">
										Provider: <span style={{ color: "#26a69a" }}>{watch("provider")}</span> | Mode:{" "}
										<span style={{ color: "#26a69a" }}>{watch("mode")}</span>
									</AppTypography>
									<AppTypography variant="body2" color="text.secondary">
										Standings: <span style={{ color: "#26a69a" }}>{watch("standingsMode")}</span>
									</AppTypography>
								</Box>
							</SectionContainer>
						)}
					</Box>
				</FormContainer>
			</StyledDialogContent>

			<DialogActions
				sx={{
					p: 3,
					pt: 1,
					backgroundColor: "black.900",
					borderTop: "1px solid",
					borderColor: "neutral.700",
				}}
			>
				<AppButton
					variant="outlined"
					onClick={onClose}
					sx={{
						borderColor: "neutral.600",
						color: "neutral.300",
						"&:hover": {
							borderColor: "neutral.500",
							backgroundColor: "neutral.800",
						},
					}}
				>
					Cancel
				</AppButton>
				<AppButton
					variant="contained"
					onClick={handleSubmit(onSubmit)}
					loading={createTournament.isPending}
					sx={{
						backgroundColor: "teal.500",
						color: "neutral.100",
						"&:hover": {
							backgroundColor: "teal.600",
						},
						"&:disabled": {
							backgroundColor: "neutral.700",
							color: "neutral.500",
						},
					}}
				>
					Create Tournament
				</AppButton>
			</DialogActions>
		</StyledDialog>
	);
};
