import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export type CronSchedule = "recurring" | "one_time";
export type CronStatus = "active" | "paused" | "retired";
export type CronRunStatus = "pending" | "running" | "succeeded" | "failed" | "canceled" | "skipped";
export type CronRunTrigger = "scheduled" | "manual" | "ad_hoc";

interface ICronApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	total?: number;
	limit?: number;
	offset?: number;
}

interface ICronJobDefinition {
	id: string;
	jobKey: string;
	version: number;
	target: string;
	payload: Record<string, unknown> | null;
	scheduleType: CronSchedule;
	cronExpression: string | null;
	runAt: string | null;
	timezone: string;
	status: CronStatus;
	pauseReason: string | null;
	supersedesJobId: string | null;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
}

interface ICronRun {
	id: string;
	jobDefinitionId: string;
	jobKey: string;
	jobVersion: number;
	target: string;
	payloadSnapshot: Record<string, unknown> | null;
	triggerType: CronRunTrigger;
	scheduledAt: string;
	startedAt: string | null;
	finishedAt: string | null;
	status: CronRunStatus;
	failureCode: string | null;
	failureMessage: string | null;
	failureDetails: Record<string, unknown> | null;
	runnerInstanceId: string | null;
	createdAt: string;
	updatedAt: string;
}

interface ICronNewVersionResult {
	previous: ICronJobDefinition | null;
	next: ICronJobDefinition;
}

interface IRunNowResult {
	outcome: "pending" | "skipped" | "duplicate";
	run: ICronRun | null;
}

export interface ICreateCronJobInput {
	jobKey: string;
	target: string;
	payload: Record<string, unknown> | null;
	scheduleType: CronSchedule;
	cronExpression: string | null;
	runAt: string | null;
	timezone: string;
}

export interface ICreateCronJobVersionInput {
	target: string;
	payload: Record<string, unknown> | null;
	scheduleType: CronSchedule;
	cronExpression: string | null;
	runAt: string | null;
	timezone: string;
}

export interface IAdminCronJob {
	id: string;
	jobKey: string;
	versions: number;
	status: CronStatus;
	schedule: CronSchedule;
	cronOrRunAt: string;
	target: string;
	raw: ICronJobDefinition;
}

export interface IAdminCronRun {
	runId: string;
	jobId: string;
	jobKey: string;
	jobVersion: number;
	target: string;
	status: CronRunStatus;
	scheduledAt: string;
	startedAt: string | null;
	finishedAt: string | null;
	durationMs: number | null;
	trigger: CronRunTrigger;
	raw: ICronRun;
}

export interface IAdminCronRunsFilters {
	jobDefinitionId?: string;
	jobKey?: string;
	status?: CronRunStatus;
	triggerType?: CronRunTrigger;
	target?: string;
	limit?: number;
	page?: number;
}

const baseURL = import.meta.env.VITE_BEST_SHOT_API_V2;

const getErrorMessage = (responseData: unknown, fallback: string): string => {
	if (!responseData || typeof responseData !== "object") return fallback;

	const candidateMessage = (responseData as { message?: unknown }).message;
	if (typeof candidateMessage === "string" && candidateMessage.trim()) {
		return candidateMessage;
	}

	return fallback;
};

const mapToCronJob = (definition: ICronJobDefinition): IAdminCronJob => {
	return {
		id: definition.id,
		jobKey: definition.jobKey,
		versions: definition.version,
		status: definition.status,
		schedule: definition.scheduleType,
		cronOrRunAt:
			definition.scheduleType === "recurring"
				? definition.cronExpression || ""
				: definition.runAt || "",
		target: definition.target,
		raw: definition,
	};
};

const mapToCronRun = (run: ICronRun): IAdminCronRun => {
	const startedDate = run.startedAt ? new Date(run.startedAt) : null;
	const finishedDate = run.finishedAt ? new Date(run.finishedAt) : null;
	const durationMs =
		startedDate &&
		finishedDate &&
		!Number.isNaN(startedDate.getTime()) &&
		!Number.isNaN(finishedDate.getTime())
			? Math.max(0, finishedDate.getTime() - startedDate.getTime())
			: null;

	return {
		runId: run.id,
		jobId: run.jobDefinitionId,
		jobKey: run.jobKey,
		jobVersion: run.jobVersion,
		target: run.target,
		status: run.status,
		scheduledAt: run.scheduledAt,
		startedAt: run.startedAt,
		finishedAt: run.finishedAt,
		durationMs,
		trigger: run.triggerType,
		raw: run,
	};
};

const fetchCronJobs = async (): Promise<IAdminCronJob[]> => {
	const response = await api.get<ICronApiResponse<ICronJobDefinition[]>>("/admin/cron/jobs", {
		baseURL,
		params: {
			limit: 100,
			offset: 0,
		},
	});

	if (!response.data.success) {
		throw new Error(getErrorMessage(response.data, "Failed to fetch cron jobs"));
	}

	const jobs = Array.isArray(response.data.data) ? response.data.data : [];
	return jobs.map(mapToCronJob);
};

const fetchCronJob = async (jobId: string): Promise<IAdminCronJob> => {
	const response = await api.get<ICronApiResponse<ICronJobDefinition>>(
		`/admin/cron/jobs/${jobId}`,
		{
			baseURL,
		}
	);

	if (!response.data.success || !response.data.data) {
		throw new Error(getErrorMessage(response.data, "Failed to fetch cron job"));
	}

	return mapToCronJob(response.data.data);
};

const fetchCronRuns = async (filters: IAdminCronRunsFilters = {}): Promise<{ data: IAdminCronRun[]; total: number }> => {
	const {
		jobDefinitionId,
		jobKey,
		status,
		triggerType,
		target,
		limit = 10,
		page = 1,
	} = filters;

	const offset = (page - 1) * limit;

	const params: Record<string, string | number> = {
		limit,
		offset,
	};

	if (jobDefinitionId?.trim()) {
		params.jobDefinitionId = jobDefinitionId.trim();
	}

	if (jobKey?.trim()) {
		params.jobKey = jobKey.trim();
	}

	if (status) {
		params.status = status;
	}

	if (triggerType) {
		params.triggerType = triggerType;
	}

	if (target?.trim()) {
		params.target = target.trim();
	}

	const response = await api.get<ICronApiResponse<ICronRun[]>>("/admin/cron/runs", {
		baseURL,
		params,
	});

	if (!response.data.success) {
		throw new Error(getErrorMessage(response.data, "Failed to fetch cron runs"));
	}

	const runs = Array.isArray(response.data.data) ? response.data.data : [];
	return {
		data: runs.map(mapToCronRun),
		total: response.data.total ?? 0,
	};
};

const fetchCronRun = async (runId: string): Promise<IAdminCronRun> => {
	const response = await api.get<ICronApiResponse<ICronRun>>(`/admin/cron/runs/${runId}`, {
		baseURL,
	});

	if (!response.data.success || !response.data.data) {
		throw new Error(getErrorMessage(response.data, "Failed to fetch cron run"));
	}

	return mapToCronRun(response.data.data);
};

const createCronJob = async (input: ICreateCronJobInput): Promise<IAdminCronJob> => {
	const response = await api.post<ICronApiResponse<ICronJobDefinition>>("/admin/cron/jobs", input, {
		baseURL,
	});

	if (!response.data.success || !response.data.data) {
		throw new Error(getErrorMessage(response.data, "Failed to create cron job"));
	}

	return mapToCronJob(response.data.data);
};

const createCronJobVersion = async (
	jobId: string,
	input: ICreateCronJobVersionInput
): Promise<IAdminCronJob> => {
	const response = await api.post<ICronApiResponse<ICronNewVersionResult>>(
		`/admin/cron/jobs/${jobId}/new-version`,
		input,
		{ baseURL }
	);

	if (!response.data.success || !response.data.data?.next) {
		throw new Error(getErrorMessage(response.data, "Failed to create new job version"));
	}

	return mapToCronJob(response.data.data.next);
};

const pauseCronJob = async (jobId: string, reason: string): Promise<IAdminCronJob> => {
	const response = await api.patch<ICronApiResponse<ICronJobDefinition>>(
		`/admin/cron/jobs/${jobId}/pause`,
		{ reason },
		{ baseURL }
	);

	if (!response.data.success || !response.data.data) {
		throw new Error(getErrorMessage(response.data, "Failed to pause cron job"));
	}

	return mapToCronJob(response.data.data);
};

const resumeCronJob = async (jobId: string): Promise<IAdminCronJob> => {
	const response = await api.patch<ICronApiResponse<ICronJobDefinition>>(
		`/admin/cron/jobs/${jobId}/resume`,
		{},
		{ baseURL }
	);

	if (!response.data.success || !response.data.data) {
		throw new Error(getErrorMessage(response.data, "Failed to resume cron job"));
	}

	return mapToCronJob(response.data.data);
};

const runCronJobNow = async (
	jobId: string,
	payload?: Record<string, unknown> | null
): Promise<IRunNowResult> => {
	const response = await api.post<ICronApiResponse<IRunNowResult>>(
		`/admin/cron/jobs/${jobId}/run-now`,
		payload === undefined ? {} : { payload },
		{ baseURL }
	);

	if (!response.data.success || !response.data.data) {
		throw new Error(getErrorMessage(response.data, "Failed to run cron job now"));
	}

	return response.data.data;
};

export const useAdminCronJobs = () => {
	return useQuery({
		queryKey: ["admin", "cron", "jobs"],
		queryFn: fetchCronJobs,
		refetchInterval: 60_000,
		staleTime: 30_000,
	});
};

export const useAdminCronJob = (jobId: string) => {
	return useQuery({
		queryKey: ["admin", "cron", "job", jobId],
		queryFn: () => fetchCronJob(jobId),
		enabled: Boolean(jobId),
		staleTime: 30_000,
	});
};

export const useAdminCronJobRuns = (jobId: string, limit = 10) => {
	return useQuery({
		queryKey: ["admin", "cron", "job", jobId, "runs", limit],
		queryFn: async () =>
			fetchCronRuns({
				jobDefinitionId: jobId,
				limit,
				page: 1,
			}).then((res) => res.data),
		enabled: Boolean(jobId),
		staleTime: 15_000,
		refetchInterval: 30_000,
	});
};

export const useAdminCronRuns = (filters: IAdminCronRunsFilters = {}) => {
	return useQuery({
		queryKey: ["admin", "cron", "runs", filters],
		queryFn: () => fetchCronRuns(filters),
		staleTime: 15_000,
		refetchInterval: 30_000,
		placeholderData: keepPreviousData,
	});
};

export const useAdminCronRun = (runId: string) => {
	return useQuery({
		queryKey: ["admin", "cron", "run", runId],
		queryFn: () => fetchCronRun(runId),
		enabled: Boolean(runId),
		staleTime: 15_000,
		refetchInterval: 30_000,
	});
};

export const useAdminCreateCronJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCronJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "cron"] });
		},
	});
};

export const useAdminCreateCronJobVersion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ jobId, data }: { jobId: string; data: ICreateCronJobVersionInput }) =>
			createCronJobVersion(jobId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "cron"] });
		},
	});
};

type RunNowMutationInput =
	| string
	| {
			jobId: string;
			payload?: Record<string, unknown> | null;
	  };

export const useAdminRunCronJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: RunNowMutationInput) => {
			const normalizedInput = typeof input === "string" ? { jobId: input } : input;
			return runCronJobNow(normalizedInput.jobId, normalizedInput.payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "cron"] });
		},
	});
};

export const useAdminToggleCronJobStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			jobId,
			currentStatus,
			reason = "Paused from admin UI",
		}: {
			jobId: string;
			currentStatus: CronStatus;
			reason?: string;
		}) => {
			if (currentStatus === "active") {
				return pauseCronJob(jobId, reason);
			}

			if (currentStatus === "paused") {
				return resumeCronJob(jobId);
			}

			throw new Error("Retired jobs cannot be resumed or paused");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "cron"] });
		},
	});
};
