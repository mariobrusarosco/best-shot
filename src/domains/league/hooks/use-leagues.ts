import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getLeagues } from "../server-side/fetchers";
import { createLeague } from "../server-side/mutations";

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

	const [labelInput, setLabelInput] = useState("");
	const [descriptionInput, setDescriptionInput] = useState("");

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

	return {
		leagues,
		handleNewLeague,
		inputs: {
			labelInput,
			descriptionInput,
			handleLabelChange,
			handleDescriptionChange,
		},
	};
};
