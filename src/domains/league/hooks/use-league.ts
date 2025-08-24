import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { getLeague } from "../server-side/fetchers";
import { inviteToLeague } from "../server-side/mutations";
import { useLeaguePerformance } from "./use-league-performance";

const route = getRouteApi("/_auth/leagues/$leagueId/");

export const useLeague = () => {
	const { leagueId } = route.useParams() as { leagueId: string };
	const queryClient = useQueryClient();
	const [editMode, setEditMode] = useState(false);
	const [guestIdInput, setGuestIdInput] = useState("");

	const league = useQuery({
		queryKey: ["leagues", { leagueId }],
		queryFn: getLeague,
		enabled: !!leagueId,
	});

	const handleGuestIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGuestIdInput(e.target.value);
	};

	const inviteToLeagueMutation = useMutation({
		mutationFn: inviteToLeague,
		onSuccess: () => {
			alert("Invitation sent successfully");
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
		},
	});

	const handleLeagueInvite = () => {
		const inviteInput = {
			leagueId: league?.data?.id || "",
			guestId: guestIdInput,
		};

		inviteToLeagueMutation.mutate(inviteInput, {
			onSettled: () => {
				setGuestIdInput("");
			},
			// TODO Type App's error object
			onError: (error: unknown) => {
				const errorData = error as { response?: { data?: unknown } };
				console.log(errorData?.response?.data);
				alert(errorData?.response?.data);
			},
		});
	};

	const { mutation, performance } = useLeaguePerformance();

	return {
		league,
		mutation,
		performance,
		setEditMode,
		editMode,
		inputs: {
			guestIdInput,
			handleGuestIdInput,
			handleLeagueInvite,
		},
	};
};
