import type { z } from "zod";
import type {
	AdminTournamentResponseSchema,
	AdminTournamentSchema,
	ExecutionJobSchema,
	TournamentExecutionJobSchema,
	TournamentExecutionJobsResponseSchema,
	TournamentMetadataSchema,
} from "./schemas";

export type ITournamentMetadata = z.infer<typeof TournamentMetadataSchema>;
export type IExecutionJob = z.infer<typeof ExecutionJobSchema>;
export type IAdminTournament = z.infer<typeof AdminTournamentSchema>;
export type IAdminTournamentResponse = z.infer<typeof AdminTournamentResponseSchema>;
export type ITournamentExecutionJob = z.infer<typeof TournamentExecutionJobSchema>;
export type ITournamentExecutionJobsResponse = z.infer<
	typeof TournamentExecutionJobsResponseSchema
>;
