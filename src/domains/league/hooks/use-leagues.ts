import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getUserToken } from "../../demo/utils";
import { getLeagues } from "../server-side/fetchers";
import { createLeague, inviteToLeague } from "../server-side/mutations";

export const useLeagues = () => {
	const memberId = getUserToken();
	const queryClient = useQueryClient();

	const leagues = useQuery({
		queryKey: ["league", { memberId }],
		queryFn: getLeagues,
	});

	const createLeagueMutation = useMutation({
		mutationFn: createLeague,
		onSuccess: () => {
			alert("League created successfully");
			queryClient.invalidateQueries({ queryKey: ["league", { memberId }] });
		},
	});

	const inviteToLeagueMutation = useMutation({
		mutationFn: inviteToLeague,
		onSuccess: () => {
			alert("Invitation sent successfully");
			queryClient.invalidateQueries({ queryKey: ["league", { memberId }] });
		},
	});

	const [labelInput, setLabelInput] = useState("");
	const [descriptionInput, setDescriptionInput] = useState("");
	const [guestIdInput, setGuestIdInput] = useState("");
	const [leagueInput, setLeagueInput] = useState("");

	const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLabelInput(e.target.value);
	};

	const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDescriptionInput(e.target.value);
	};

	const handleNewLeague = () => {
		const createLeagueInput = {
			label: labelInput,
			description: descriptionInput,
			founderId: memberId,
		};

		createLeagueMutation.mutate(createLeagueInput, {
			onSettled: () => {
				setLabelInput("");
				setDescriptionInput("");
			},
		});
	};

	const handleLeagueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLeagueInput(e.target.value);
	};

	const handleGuestIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGuestIdInput(e.target.value);
	};

	const handleLeagueInvite = () => {
		const inviteInput = {
			leagueId: leagueInput,
			guestId: guestIdInput,
		};

		inviteToLeagueMutation.mutate(inviteInput, {
			onSettled: () => {
				// setLabelInput("");
				// setDescriptionInput("");
			},
		});
	};

	return {
		leagues,
		handleNewLeague,
		handleLeagueInvite,
		inputs: {
			labelInput,
			descriptionInput,
			handleLabelChange,
			handleDescriptionChange,
			guestIdInput,
			leagueInput,
			handleLeagueInput,
			handleGuestIdInput,
		},
	};
};
