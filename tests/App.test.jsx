import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import App from "../src/App";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

vi.mock("@react-oauth/google", () => ({
  useGoogleLogin: vi.fn(),
  googleLogout: vi.fn(),
}));

vi.mock("axios");
vi.mock("file-saver", () => ({ saveAs: vi.fn() }));
vi.mock("material-ui-confirm", () => ({
  useConfirm: () => vi.fn().mockResolvedValue(true),
}));

describe("App Component", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays the sign-in button when not signed in", () => {
    useGoogleLogin.mockReturnValue(vi.fn());
    render(<App />);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("displays the data grid after successful sign-in", async () => {
    const mockLogin = vi.fn();
    useGoogleLogin.mockReturnValue(mockLogin);

    // Mock the axios request for user info
    axios.get.mockResolvedValue({
      data: {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User",
      },
    });

    // Mock the Google Drive API call to list files
    const mockListFiles = {
      result: {
        files: [
          {
            id: "1",
            name: "Test File",
            modifiedTime: "2023-08-01T12:34:56.789Z",
            mimeType: "application/pdf",
          },
        ],
      },
    };
    global.gapi = {
      client: {
        drive: {
          files: {
            list: vi.fn().mockResolvedValue(mockListFiles),
          },
        },
      },
    };

    render(<App />);

    // Simulate user clicking on the Sign In button
    const signInButton = screen.getByText(/sign in with Google/i);
    fireEvent.click(signInButton);

    // Simulate a successful login
    const successCallback = useGoogleLogin.mock.calls[0][0].onSuccess;
    successCallback({ access_token: "test-access-token" });

    await waitFor(() => {
      expect(screen.getByText(/Test File/)).toBeInTheDocument();
    });

    expect(screen.getByTestId("ag-grid")).toBeInTheDocument();
  });
});
