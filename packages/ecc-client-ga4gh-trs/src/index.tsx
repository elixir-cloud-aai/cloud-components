import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";

import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);
root.render(
  <NextUIProvider>
    <App />
  </NextUIProvider>
);
