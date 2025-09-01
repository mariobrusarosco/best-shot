import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, styled } from "@mui/material";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useAdminTournaments } from "@/domains/admin/hooks/use-admin-tournaments";
import { useCreateKnockoutRoundsJob } from "@/domains/admin/hooks/use-create-knockout-rounds-job";
import { KnockoutRoundsJobSchema } from "@/domains/admin/schemas";
import type { ITournament } from "@/domains/tournament/schemas";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppFormInput } from "@/domains/ui-system/components/form/form-input";
import { AppFormSelect } from "@/domains/ui-system/components/form/form-select";

type KnockoutRoundsJobInput = z.infer<typeof KnockoutRoundsJobSchema>;

const environmentOptions = [
	{ value: "demo", label: "Demo" },
	{ value: "staging", label: "Staging" },
	{ value: "production", label: "Production" },
];

interface KnockoutRoundsJobFormProps {
	preselectedTournament?: ITournament;
}

export const KnockoutRoundsJobForm = ({ preselectedTournament }: KnockoutRoundsJobFormProps) => {
	const { mutate: createJob, isPending, error } = useCreateKnockoutRoundsJob();
	const { data: tournaments, isLoading: isLoadingTournaments } = useAdminTournaments();

	const { control, handleSubmit, reset } = useForm<KnockoutRoundsJobInput>({
		resolver: zodResolver(KnockoutRoundsJobSchema),
		defaultValues: {
			jobType: "knockout_rounds",
			description: "Scrape knockout rounds every 2 days",
			tournamentId: preselectedTournament?.id || "",
		},
	});

	const tournamentOptions =
		tournaments?.map((tournament: ITournament) => ({
			value: tournament.id,
			label: tournament.label,
		})) || [];

	const onSubmit = (data: KnockoutRoundsJobInput) => {
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
					Knockout Rounds Job
				</AppTypography>
				<AppTypography variant="body2" color="neutral.400">
					Schedule a recurring job to scrape knockout rounds
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
						{error.message || "Failed to create knockout rounds job"}
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
	gridTemplateColumns: "1fr 1fr 2fr auto",
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
}));
