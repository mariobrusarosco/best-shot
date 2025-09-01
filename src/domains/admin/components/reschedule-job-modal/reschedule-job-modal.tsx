import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppFormInput } from "@/domains/ui-system/components/form/form-input";
import { AppFormSelect } from "@/domains/ui-system/components/form/form-select";
import { RescheduleJobSchema } from "../../schemas";

interface RescheduleJobModalProps {
	jobId: string;
	onClose: () => void;
}

type RescheduleJobInput = z.infer<typeof RescheduleJobSchema>;

const commonCronExpressions = [
	{ value: "0 */6 * * *", label: "Every 6 hours" },
	{ value: "0 */12 * * *", label: "Every 12 hours" },
	{ value: "0 0 * * *", label: "Daily at midnight" },
	{ value: "0 0 */2 * *", label: "Every 2 days" },
	{ value: "0 0 * * 1", label: "Weekly on Monday" },
	{ value: "0 0 1 * *", label: "Monthly on 1st" },
];

const timezones = [
	{ value: "UTC", label: "UTC" },
	{ value: "America/New_York", label: "Eastern Time" },
	{ value: "America/Chicago", label: "Central Time" },
	{ value: "America/Denver", label: "Mountain Time" },
	{ value: "America/Los_Angeles", label: "Pacific Time" },
	{ value: "Europe/London", label: "London" },
	{ value: "Europe/Paris", label: "Paris" },
	{ value: "Asia/Tokyo", label: "Tokyo" },
];

export const RescheduleJobModal = ({ jobId, onClose }: RescheduleJobModalProps) => {
	const { control, handleSubmit, watch, setValue } = useForm<RescheduleJobInput>({
		resolver: zodResolver(RescheduleJobSchema),
		defaultValues: {
			jobId,
			cronExpression: "",
			timezone: "UTC",
		},
	});

	const cronExpression = watch("cronExpression");

	const onSubmit = (_data: RescheduleJobInput) => {
		try {
			// await rescheduleJob.mutateAsync(data);
			onClose();
		} catch (error) {
			console.error("Failed to reschedule job:", error);
		}
	};

	const handleQuickSelect = (expression: string) => {
		setValue("cronExpression", expression);
	};

	return (
		<Dialog open onClose={onClose} maxWidth="tablet" fullWidth>
			<DialogTitle>
				<AppTypography variant="h6" color="neutral.100">
					Reschedule Scraper Job
				</AppTypography>
			</DialogTitle>

			<DialogContent sx={{ pb: 2 }}>
				<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
					<Box sx={{ mb: 3 }}>
						<AppTypography variant="subtitle2" sx={{ mb: 2, color: "neutral.100" }}>
							Quick Select Common Schedules
						</AppTypography>
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
							{commonCronExpressions.map((option) => (
								<AppButton
									key={option.value}
									variant="outlined"
									size="small"
									onClick={() => handleQuickSelect(option.value)}
									sx={{
										bgcolor: cronExpression === option.value ? "primary.main" : "transparent",
									}}
								>
									{option.label}
								</AppButton>
							))}
						</Box>
					</Box>

					<AppFormInput
						name="cronExpression"
						control={control}
						label="Cron Expression"
						placeholder="0 */6 * * * (every 6 hours)"
						required
					/>

					<Box sx={{ mt: 2 }}>
						<AppTypography variant="caption" color="text.secondary">
							Cron format: minute hour day month weekday
						</AppTypography>
						<AppTypography variant="caption" display="block" color="text.secondary">
							Examples: "0 */6 * * *" (every 6 hours), "0 0 * * 1" (weekly on Monday)
						</AppTypography>
					</Box>

					<Box sx={{ mt: 3 }}>
						<AppFormSelect name="timezone" control={control} label="Timezone" options={timezones} />
					</Box>

					{cronExpression && (
						<Box
							sx={{
								mt: 3,
								p: 2,
								backgroundColor: "black.700",
								borderRadius: 1,
							}}
						>
							<AppTypography variant="caption" color="text.secondary">
								Schedule Preview
							</AppTypography>
							<AppTypography variant="body2" color="neutral.100">
								{cronExpression}
							</AppTypography>
						</Box>
					)}
				</Box>
			</DialogContent>

			<DialogActions sx={{ p: 3, pt: 0 }}>
				<AppButton variant="outlined" onClick={onClose}>
					Cancel
				</AppButton>
				<AppButton
					variant="contained"
					onClick={handleSubmit(onSubmit)}
					// loading={rescheduleJob.isPending}
				>
					Reschedule Job
				</AppButton>
			</DialogActions>
		</Dialog>
	);
};
