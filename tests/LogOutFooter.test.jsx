import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LogOutFooter } from "../src/LogOutFooter";

describe("LogOutFooter", () => {
  it("renders log out button", () => {
    render(<LogOutFooter />);

    const buttonElement = screen.getByText(/log out/i);
    expect(buttonElement).toBeInTheDocument();
  });
});
