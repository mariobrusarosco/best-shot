import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

vi.mock("./app-router", () => ({
	AppRouter: () => <div>Best Shot</div>,
}));

vi.mock("./domains/authentication", () => ({
	Authentication: {
		AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		useAppAuth: () => ({
			isAuthenticated: false,
			isLoadingAuth: false,
			authId: null,
		}),
	},
}));

vi.mock("@/configuration/monitoring/components/SentryUserIdentifier", () => ({
	SentryUserIdentifier: () => null,
}));

vi.mock("@/utils/LaunchDarklyUserIdentifier", () => ({
	__esModule: true,
	default: () => null,
}));

describe("Boilerplate", () => {
	it("renders properly", () => {
		render(<App />);

		expect(screen.getByText(/best shot/i)).toBeInTheDocument();
	});
});
