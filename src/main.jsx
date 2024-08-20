import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfirmProvider } from "material-ui-confirm";
import { DISCOVERY_DOC } from "./constants";
import App from "./App.jsx";
import "./index.css";

const apiKey = import.meta.env.VITE_GDRIVE_API_KEY;
const clientId = import.meta.env.VITE_GDRIVE_CLIENT_ID;

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey,
    discoveryDocs: [DISCOVERY_DOC],
  });
}

gapi.load("client", initializeGapiClient);

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <ConfirmProvider>
      <App />
    </ConfirmProvider>
  </GoogleOAuthProvider>
);
