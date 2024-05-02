import { render } from "@testing-library/react";
import { Display } from "./display";

describe("Display", () => {
	it("should render the Display component", () => {
		const { getByText } = render(<Display />);
		const headerElement = getByText(/Display/i);
		expect(headerElement).toBeInTheDocument();
	});
});
