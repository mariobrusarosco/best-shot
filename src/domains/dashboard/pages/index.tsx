import { useQuery } from "@tanstack/react-query";
import { tempQueryFn } from "../../demo/utils";

const Temp = () => {
	const { data: testing } = useQuery({
		queryKey: ["test"],
		queryFn: tempQueryFn,
	});

	return <p>temp: {testing}</p>;
};

const DashboardPage = () => {
	const { data: testing } = useQuery({
		queryKey: ["test"],
		queryFn: tempQueryFn,
	});

	return (
		<div>
			<h2>Dashboard {testing}</h2>
			<Temp />
		</div>
	);
};

export { DashboardPage };
