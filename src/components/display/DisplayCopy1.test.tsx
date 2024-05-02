import { render } from "@testing-library/react";
import { Display } from "./DisplayCopy1";

describe("Display", () => {
	it("should render the Display component", () => {
		const { getByText } = render(<Display />);
		const headerElement = getByText(/one/i);
		expect(headerElement).toBeInTheDocument();
	});
});
