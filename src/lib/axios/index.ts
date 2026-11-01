import axios from "axios";

import { API_TIMEOUT_MS, JSON_HEADERS } from "@/constants/client";
import { environment } from "@/constants/environment";

import { toAppError } from "./toAppError";

export { toAppError };

export const apiClient = axios.create({
  baseURL: environment.appBaseUrl,
  timeout: API_TIMEOUT_MS,
  headers: JSON_HEADERS,
});

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  return config;
});

if (environment.enableLogging) {
  apiClient.interceptors.request.use((config) => {
    console.info("[api]", config.method?.toUpperCase(), config.url);

    return config;
  });
}
