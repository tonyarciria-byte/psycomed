import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./i18n";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>}>
      <App />
    </Suspense>
  </StrictMode>
);