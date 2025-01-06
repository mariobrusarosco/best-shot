import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 0,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			console.error("Error happened: ", error);
		},
	}),
});

const AppQueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export { AppQueryProvider };
