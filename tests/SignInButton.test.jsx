import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SignInButton } from "../src/SignInButton";

describe("SignInButton", () => {
  it("renders button with correct text", () => {
    render(<SignInButton />);

    const buttonElement = screen.getByText(/sign in with Google/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it("renders Google icon", () => {
    render(<SignInButton />);

    const iconElement = screen.getByTestId("GoogleIcon");
    expect(iconElement).toBeInTheDocument();
  });
});
