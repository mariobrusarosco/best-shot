import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import type { CreateTournamentSchema } from "@/domains/admin/schemas";
import { createAdminTournament } from "@/domains/admin/server-side/mutations";

export const useAdminCreateTournament = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof CreateTournamentSchema>) => createAdminTournament(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "tournaments"] });
		},
	});
};
