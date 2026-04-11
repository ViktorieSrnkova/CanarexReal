import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("Session expired flow", () => {
  it("shows modal when session expires", async () => {
    render(<App />);

    await act(async () => {
      window.dispatchEvent(new Event("session-expired"));
    });

    expect(await screen.findByText(/Relace vypršela/i)).toBeInTheDocument();
  });
});
