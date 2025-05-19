import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./styles/global.module.scss";

const remoteElement = document.getElementById("root");
if (!remoteElement) {
  throw new Error("Root element not found");
}

const root = createRoot(remoteElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
