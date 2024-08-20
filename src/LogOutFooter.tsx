import React from "react";

export function LogOutFooter({ onClick }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        margin: "6px 0 0 0",
        gap: "16px",
      }}
    >
      <button onClick={onClick}>Log out</button>
    </div>
  );
}
