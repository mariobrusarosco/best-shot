import { render } from "@testing-library/react";
import { Display } from "./DisplayCopy2";

describe("Display", () => {
	it("should render the Display component", () => {
		const { getByText } = render(<Display />);
		const headerElement = getByText(/two/i);
		expect(headerElement).toBeInTheDocument();
	});
});
