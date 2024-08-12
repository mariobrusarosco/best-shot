import "./App.css";
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AppRouter } from "./app-router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			retry: 0,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			console.error("Error happened: ", error);
		},
	}),
});

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<AppRouter />
			</QueryClientProvider>
		</>
	);
}

export default App;
