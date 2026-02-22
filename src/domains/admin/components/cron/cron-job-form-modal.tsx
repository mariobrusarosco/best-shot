import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
	styled,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { AppTypography } from "@/domains/ui-system/components";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";

export type CronScheduleType = "recurring" | "one_time";
export type CronFormMode = "create" | "new-version";

export interface ICronJobFormValues {
	jobKey: string;
	scheduleType: CronScheduleType;
	cronExpression: string;
	runAt: string;
	timezone: string;
	target: string;
	payloadJson: string;
}

interface CronJobFormModalProps {
	open: boolean;
	mode: CronFormMode;
	initialValues?: Partial<ICronJobFormValues>;
	isSaving?: boolean;
	onCancel: () => void;
	onSave: (values: ICronJobFormValues) => Promise<void> | void;
}

type FormErrors = Partial<Record<keyof ICronJobFormValues, string>>;

const getDefaultValues = (): ICronJobFormValues => ({
	jobKey: "",
	scheduleType: "recurring",
	cronExpression: "",
	runAt: "",
	timezone: "UTC",
	target: "",
	payloadJson: '{"mode":"full"}',
});

const buildInitialValues = (values?: Partial<ICronJobFormValues>): ICronJobFormValues => ({
	...getDefaultValues(),
	...values,
});

const validateForm = (values: ICronJobFormValues): FormErrors => {
	const errors: FormErrors = {};

	if (!values.jobKey.trim()) {
		errors.jobKey = "Job key is required";
	}

	if (!values.target.trim()) {
		errors.target = "Target is required";
	}

	if (values.scheduleType === "recurring" && !values.cronExpression.trim()) {
		errors.cronExpression = "Cron expression is required for recurring jobs";
	}

	if (values.scheduleType === "one_time") {
		if (!values.runAt.trim()) {
			errors.runAt = "run_at is required for one-time jobs";
		} else if (Number.isNaN(new Date(values.runAt).getTime())) {
			errors.runAt = "run_at must be a valid date/time";
		}
	}

	if (!values.payloadJson.trim()) {
		errors.payloadJson = "Payload is required";
	} else {
		try {
			JSON.parse(values.payloadJson);
		} catch {
			errors.payloadJson = "Payload must be valid JSON";
		}
	}

	return errors;
};

export const CronJobFormModal = ({
	open,
	mode,
	initialValues,
	isSaving = false,
	onCancel,
	onSave,
}: CronJobFormModalProps) => {
	const [values, setValues] = useState<ICronJobFormValues>(buildInitialValues(initialValues));
	const [errors, setErrors] = useState<FormErrors>({});

	useEffect(() => {
		if (open) {
			setValues(buildInitialValues(initialValues));
			setErrors({});
		}
	}, [initialValues, open]);

	const title = useMemo(() => {
		return mode === "create" ? "Create Cron Job" : "Create New Version";
	}, [mode]);

	const setValue = <K extends keyof ICronJobFormValues>(key: K, value: ICronJobFormValues[K]) => {
		setValues((current) => ({ ...current, [key]: value }));
		setErrors((current) => ({ ...current, [key]: undefined }));
	};

	const handleSave = async () => {
		const formErrors = validateForm(values);
		setErrors(formErrors);

		if (Object.keys(formErrors).length > 0) {
			return;
		}

		await onSave(values);
	};

	return (
		<StyledDialog open={open} onClose={onCancel} maxWidth="laptop" fullWidth>
			<DialogTitle>
				<AppTypography variant="h6" color="neutral.100">
					{title}
				</AppTypography>
			</DialogTitle>

			<DialogContent>
				<FormGrid>
					<FormRow>
						<LabelText>job_key*</LabelText>
						<FormField
							size="small"
							value={values.jobKey}
							onChange={(event) => setValue("jobKey", event.target.value)}
							placeholder="rounds_update"
							error={Boolean(errors.jobKey)}
							helperText={errors.jobKey}
						/>
					</FormRow>

					<FormRow>
						<LabelText>schedule_type*</LabelText>
						<RadioGroup
							row
							value={values.scheduleType}
							onChange={(event) =>
								setValue("scheduleType", event.target.value as ICronJobFormValues["scheduleType"])
							}
						>
							<FormControlLabel value="recurring" control={<Radio size="small" />} label="recurring" sx={{ color: "neutral.100" }} />
							<FormControlLabel value="one_time" control={<Radio size="small" />} label="one_time" sx={{ color: "neutral.100" }} />
						</RadioGroup>
					</FormRow>

					<FormRow>
						<LabelText>cron_expression</LabelText>
						<FormField
							size="small"
							value={values.cronExpression}
							onChange={(event) => setValue("cronExpression", event.target.value)}
							placeholder="*/5 * * * *"
							disabled={values.scheduleType === "one_time"}
							error={Boolean(errors.cronExpression)}
							helperText={errors.cronExpression}
						/>
					</FormRow>

					<FormRow>
						<LabelText>run_at</LabelText>
						<FormField
							size="small"
							type="datetime-local"
							value={values.runAt}
							sx={{
								color: "neutral.100",
							}}
							onChange={(event) => setValue("runAt", event.target.value)}
							disabled={values.scheduleType !== "one_time"}
							error={Boolean(errors.runAt)}
							helperText={errors.runAt || "Enabled only for one_time"}
							InputLabelProps={{ shrink: true }}
						/>
					</FormRow>

					<FormRow>
						<LabelText>timezone</LabelText>
						<FormField
							size="small"
							value={values.timezone}
							onChange={(event) => setValue("timezone", event.target.value)}
							placeholder="UTC"
						/>
					</FormRow>

					<FormRow>
						<LabelText>target*</LabelText>
						<FormField
							size="small"
							value={values.target}
							onChange={(event) => setValue("target", event.target.value)}
							placeholder="rounds.sync"
							error={Boolean(errors.target)}
							helperText={errors.target}
						/>
					</FormRow>

					<FormRow alignTop>
						<LabelText>payload (json)</LabelText>
						<FormField
							size="small"
							multiline
							minRows={3}
							value={values.payloadJson}
							onChange={(event) => setValue("payloadJson", event.target.value)}
							placeholder='{"mode":"full"}'
							error={Boolean(errors.payloadJson)}
							helperText={errors.payloadJson}
						/>
					</FormRow>
				</FormGrid>
			</DialogContent>

			<DialogActions sx={{ p: 3, pt: 1 }}>
				<AppButton variant="outlined" onClick={onCancel} disabled={isSaving}>
					Cancel
				</AppButton>
				<AppButton variant="contained" onClick={() => void handleSave()} loading={isSaving}>
					Save
				</AppButton>
			</DialogActions>
		</StyledDialog>
	);
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialog-paper": {
		backgroundColor: theme.palette.black[800],
		border: `1px solid ${theme.palette.neutral[700]}`,
		borderRadius: theme.shape.borderRadius,
	},
}));

const FormGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gap: theme.spacing(1.5),
	paddingTop: theme.spacing(1),
}));

const FormRow = styled(Box, {
	shouldForwardProp: (prop) => prop !== "alignTop",
})<{ alignTop?: boolean }>(({ theme, alignTop = false }) => ({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: theme.spacing(1),
	alignItems: alignTop ? "start" : "center",
	[theme.breakpoints.up("tablet")]: {
		gridTemplateColumns: "220px 1fr",
	},
}));

const LabelText = styled(AppTypography)(({ theme }) => ({
	color: theme.palette.neutral[100],
	fontFamily: "monospace",
	fontSize: "0.85rem",
}));

const FormField = styled(TextField)(({ theme }) => ({
	"& .MuiInputBase-root": {
		backgroundColor: theme.palette.black[700],
		color: theme.palette.neutral[100],
	},
	"& .MuiOutlinedInput-notchedOutline": {
		borderColor: theme.palette.neutral[700],
	},
	"& .MuiInputBase-input::placeholder": {
		color: theme.palette.neutral[500],
		opacity: 1,
	},
	"& .MuiFormHelperText-root": {
		marginLeft: 0,
		color: theme.palette.neutral[100],
	},
}));

