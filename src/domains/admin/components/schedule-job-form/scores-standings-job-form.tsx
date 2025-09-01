import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, styled } from "@mui/material";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useAdminTournaments } from "@/domains/admin/hooks/use-admin-tournaments";
import { useCreateScoresAndStandingsJob } from "@/domains/admin/hooks/use-create-scores-standings-job";
import { ScoresAndStandingsJobSchema } from "@/domains/admin/schemas";
import type { ITournament } from "@/domains/tournament/schemas";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppFormInput } from "@/domains/ui-system/components/form/form-input";
import { AppFormSelect } from "@/domains/ui-system/components/form/form-select";

type ScoresAndStandingsJobInput = z.infer<typeof ScoresAndStandingsJobSchema>;

const environmentOptions = [
	{ value: "demo", label: "Demo" },
	{ value: "staging", label: "Staging" },
	{ value: "production", label: "Production" },
];

interface ScoresAndStandingsJobFormProps {
	preselectedTournament?: ITournament;
}

export const ScoresAndStandingsJobForm = ({
	preselectedTournament,
}: ScoresAndStandingsJobFormProps) => {
	const { mutate: createJob, isPending, error } = useCreateScoresAndStandingsJob();
	const { data: tournaments, isLoading: isLoadingTournaments } = useAdminTournaments();

	const { control, handleSubmit, reset } = useForm<ScoresAndStandingsJobInput>({
		resolver: zodResolver(ScoresAndStandingsJobSchema),
		defaultValues: {
			jobType: "scores_and_standings",
			description: "Update scores 2.5h after match start",
			matchStartTime: new Date().toISOString(),
			tournamentId: preselectedTournament?.id || "",
		},
	});

	const tournamentOptions =
		tournaments?.map((tournament: ITournament) => ({
			value: tournament.id,
			label: tournament.label,
		})) || [];

	const onSubmit = (data: ScoresAndStandingsJobInput) => {
		createJob(data, {
			onSuccess: () => {
				reset();
			},
		});
	};

	return (
		<Container>
			<HeaderBox>
				<AppTypography variant="h6" color="neutral.100">
					Scores and Standings Job
				</AppTypography>
				<AppTypography variant="body2" color="neutral.400">
					Schedule a job to update scores and standings after match start
				</AppTypography>
			</HeaderBox>

			<form onSubmit={handleSubmit(onSubmit)}>
				<FormGrid>
					<AppFormSelect
						name="environment"
						label="Environment"
						options={environmentOptions}
						control={control}
						disabled={isPending}
						placeholder="Select environment (optional)"
					/>

					<AppFormSelect
						name="tournamentId"
						label="Tournament"
						options={tournamentOptions}
						control={control}
						disabled={isPending || isLoadingTournaments || !!preselectedTournament}
						placeholder={
							preselectedTournament
								? preselectedTournament.label
								: isLoadingTournaments
									? "Loading tournaments..."
									: "Select a tournament"
						}
					/>

					<AppFormInput
						name="matchStartTime"
						label="Match Start Time"
						type="datetime-local"
						control={control}
						disabled={isPending}
						placeholder="Enter match start time (ISO format)"
					/>

					<AppFormInput
						name="roundSlug"
						label="Round Slug"
						control={control}
						disabled={isPending}
						placeholder="Enter round slug (e.g., round-22)"
					/>

					<AppFormInput
						name="description"
						label="Description"
						control={control}
						disabled={isPending}
						placeholder="Enter job description"
					/>

					<ButtonContainer>
						<AppButton
							type="submit"
							variant="contained"
							disabled={isPending || isLoadingTournaments}
							loading={isPending}
							sx={{ minWidth: 140 }}
						>
							Create Job
						</AppButton>
					</ButtonContainer>
				</FormGrid>

				{error && (
					<Alert severity="error" sx={{ mt: 2 }}>
						{error.message || "Failed to create scores and standings job"}
					</Alert>
				)}
			</form>
		</Container>
	);
};

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.neutral[700]}`,
	marginBottom: theme.spacing(2),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

const FormGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr) auto",
	gap: theme.spacing(2),
	alignItems: "end",
	[theme.breakpoints.down(768)]: {
		gridTemplateColumns: "1fr",
		gap: theme.spacing(1.5),
	},
}));

const ButtonContainer = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
	gridColumn: "span 4",
	justifySelf: "start",
}));
