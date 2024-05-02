import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Boilerplate", () => {
  it("renders properly", async () => {
    render(<App />);

    expect(screen.getByText(/bqest shot/i)).toBeInTheDocument();
  });
});
