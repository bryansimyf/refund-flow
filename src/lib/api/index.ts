import type { AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/axios";

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  const response = await apiClient.get<T>(url, config);

  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await apiClient.post<T>(url, data, config);

  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await apiClient.put<T>(url, data, config);

  return response.data;
}

export async function apiPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const response = await apiClient.patch<T>(url, data, config);

  return response.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
  const response = await apiClient.delete<T>(url, config);

  return response.data;
}
