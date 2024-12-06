import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getLeagues } from "../server-side/fetchers";
import { createLeague, inviteToLeague } from "../server-side/mutations";

export const useLeagues = () => {
	const queryClient = useQueryClient();

	const leagues = useQuery({
		queryKey: ["leagues"],
		queryFn: getLeagues,
	});

	const createLeagueMutation = useMutation({
		mutationFn: createLeague,
		onSuccess: () => {
			alert("League created successfully");
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
		},
	});

	const inviteToLeagueMutation = useMutation({
		mutationFn: inviteToLeague,
		onSuccess: () => {
			alert("Invitation sent successfully");
			queryClient.invalidateQueries({ queryKey: ["leagues"] });
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
		};

		createLeagueMutation.mutate(createLeagueInput, {
			onSettled: () => {
				setLabelInput("");
				setDescriptionInput("");
			},
			onSuccess: () => {
				alert("League created!");
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
				setLabelInput("");
				setDescriptionInput("");
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
