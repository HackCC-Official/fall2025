import { applyClient } from "@/api/apply-client";
import { ApplicationResponseDTO, ApplicationStatistics } from "../types/application";

export interface Document {
  resume: File | undefined;
  transcript: File | undefined;
}

export async function getApplicationById(id: string) : Promise<ApplicationResponseDTO> {
  // Make the POST request with formData
  return (
    await applyClient.request({
      method: "GET",
      url: "applications/" + id,
    })
  ).data;
}


export async function getApplicationsStats() : Promise<ApplicationStatistics> {
  return (
    await applyClient.request({
      method: "GET",
      url: "applications/stats",
    })
  ).data
}

export async function acceptApplication(applicationId: string) : Promise<ApplicationResponseDTO> {
  return (
    await applyClient.request({
      method: "PUT",
      url: "applications/" + applicationId + '/accept',
    })
  ).data
}

export async function denyApplication(applicationId: string) : Promise<ApplicationResponseDTO> {
  return (
    await applyClient.request({
      method: "PUT",
      url: "applications/" + applicationId + '/deny',
    })
  ).data
}