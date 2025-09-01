import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, styled } from "@mui/material";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateDailyUpdateJob } from "@/domains/admin/hooks/use-create-daily-update-job";
import { DailyUpdateJobSchema } from "@/domains/admin/schemas";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppFormInput } from "@/domains/ui-system/components/form/form-input";
import { AppFormSelect } from "@/domains/ui-system/components/form/form-select";

type DailyUpdateJobInput = z.infer<typeof DailyUpdateJobSchema>;

const environmentOptions = [
	{ value: "demo", label: "Demo" },
	{ value: "staging", label: "Staging" },
	{ value: "production", label: "Production" },
];

export const DailyUpdateJobForm = () => {
	const { mutate: createJob, isPending, error } = useCreateDailyUpdateJob();

	const { control, handleSubmit, reset } = useForm<DailyUpdateJobInput>({
		resolver: zodResolver(DailyUpdateJobSchema),
		defaultValues: {
			jobType: "daily_update",
			description: "Daily match scheduling routine",
		},
	});

	const onSubmit = (data: DailyUpdateJobInput) => {
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
					Daily Update Job
				</AppTypography>
				<AppTypography variant="body2" color="neutral.400">
					Schedule a daily update job for match scheduling
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
							disabled={isPending}
							loading={isPending}
							sx={{ minWidth: 140 }}
						>
							Create Job
						</AppButton>
					</ButtonContainer>
				</FormGrid>

				{error && (
					<Alert severity="error" sx={{ mt: 2 }}>
						{error.message || "Failed to create daily update job"}
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
	gridTemplateColumns: "1fr 2fr auto",
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
