import { render } from "@testing-library/react";
import { Display } from "./DisplayCopy3";

describe("Display", () => {
	it("should render the Display component", () => {
		const { getByText } = render(<Display />);
		const headerElement = getByText(/Display/i);
		expect(headerElement).toBeInTheDocument();
	});
});
