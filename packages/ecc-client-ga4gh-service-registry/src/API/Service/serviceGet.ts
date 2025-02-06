import type { Service } from "../../components/services/services.js";

export async function fetchServices(
  baseURL: string,
  authToken?: string
): Promise<Service[]> {
  const headers: Record<string, string> = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${baseURL}/services`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await response.json();
  return data;
}

export async function createService(
  baseURL: string,
  service: Omit<Service, "id">,
  authToken?: string
): Promise<Service> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${baseURL}/services`, {
    method: "POST",
    headers,
    body: JSON.stringify(service),
  });

  if (!response.ok) {
    throw new Error("Failed to create service");
  }

  return response.json();
}
