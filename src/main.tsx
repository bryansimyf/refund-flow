import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppProviders } from "@/app/providers/AppProviders";

import { environment } from "@/constants/environment";
import { i18n } from "@/lib/i18n";

import App from "./App";

import "./index.css";

async function bootstrap() {
  if (environment.enableMockApi) {
    await import("@/lib/axiosMock");
  }

  const root = document.getElementById("root");

  if (!root) {
    throw new Error("Root element was not found");
  }

  createRoot(root).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  );
}

void i18n;
void bootstrap();
