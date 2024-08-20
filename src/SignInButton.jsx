import React from "react";
import GoogleIcon from "@mui/icons-material/Google";

export function SignInButton({ onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex" }}>
      Sign in with Google <GoogleIcon style={{ marginLeft: "5px" }} />
    </button>
  );
}
