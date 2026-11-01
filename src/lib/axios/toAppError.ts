import axios from "axios";

import type { AppError } from "@/types/appError";
import { i18n } from "@/lib/i18n";

function readMessage(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  if ("message" in data && typeof data.message === "string") {
    return data.message;
  }

  return undefined;
}

function readTitle(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  if ("title" in data && typeof data.title === "string") {
    return data.title;
  }

  return undefined;
}

export function toAppError(error: unknown): AppError {
  if (!axios.isAxiosError(error)) {
    return { message: i18n.t("errors:http") };
  }

  if (error.code === "ERR_CANCELED") {
    return { code: "CANCELED", message: i18n.t("errors:canceled") };
  }

  if (error.code === "ECONNABORTED") {
    return { code: "TIMEOUT", message: i18n.t("errors:timeout") };
  }

  if (!error.response) {
    return { code: "NETWORK", message: i18n.t("errors:network") };
  }

  return {
    code: String(error.response.status),
    title: readTitle(error.response.data),
    message: readMessage(error.response.data) ?? i18n.t("errors:http"),
  };
}
