import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { getLeague } from "@/domains/league/server-side/fetchers";
import { leagueQueryKey } from "@/domains/league/server-side/keys";
import { inviteToLeague } from "@/domains/league/server-side/mutations";

const route = getRouteApi("/_auth/leagues/$leagueId/");

export const useLeague = () => {
	const { leagueId } = route.useParams() as { leagueId: string };
	const queryClient = useQueryClient();
	const [editMode, setEditMode] = useState(false);
	const [guestIdInput, setGuestIdInput] = useState("");

	const query = useQuery({
		queryKey: leagueQueryKey(leagueId),
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
			leagueId: query.data?.id || "",
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

	console.log("------------query.data", query.data);
	return {
		league: {
			data: query.data,
			states: {
				editMode,
				guestIdInput,
				isPending: query.isPending,
				isError: query.isError,
			},
			handlers: {
				setEditMode,
				handleGuestIdInput,
				handleLeagueInvite,
			},
		},
	};
};
