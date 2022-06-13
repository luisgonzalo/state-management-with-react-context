import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { worker } from "./server/server";

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: "bypass" });

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

start();
