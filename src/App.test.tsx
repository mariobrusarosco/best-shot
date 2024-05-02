import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Boilerplate", () => {
	it("renders properly", async () => {
		render(<App />);

		screen.debug();
		screen.getByText("Best Shot");

		expect(
			screen.getByRole("heading", { name: /Best Shot/i })
		).toBeInTheDocument();
	});
});
