import { useAppAuth } from "@/domains/authentication/hooks/use-app-auth";

export default function MyAccountScreen() {
	const { auth } = useAppAuth();

	console.log({ auth });
	return (
		<div>
			<h1>My Account</h1>
		</div>
	);
}
