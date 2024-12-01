import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-q4agaai48h3lxu2p.us.auth0.com"
      clientId="kt2Lb3wnc6lYDWMpL055xEZfckWuTj3L"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
);
