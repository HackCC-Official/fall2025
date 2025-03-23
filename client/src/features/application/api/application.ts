import { applyClient } from "@/api/apply-client";
import { ApplicationRequestDTO } from "../types/application";
import { ApplicationStatus } from "../types/status.enum";

export interface Document {
  resume: File | undefined;
  transcript: File | undefined;
}

export async function createApplication(applicationDTO: ApplicationRequestDTO, document: Document): Promise<ApplicationRequestDTO> {
  // Create a new FormData object
  const formData = new FormData();

  // Append all fields from applicationDTO to formData
  Object.entries(applicationDTO).forEach(([key, value]) => {
    if (key === "submissions") {
      // Handle submissions array separately
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value as string);
    }
  });

  // Append files from document to formData
  formData.append("resume", document.resume as File);
  formData.append("transcript", document.transcript as File);

  // Make the POST request with formData
  return (
    await applyClient.request({
      method: "POST",
      url: "applications",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type for file uploads
      },
    })
  ).data;
}

export async function getApplicationByUserId(userId: string) : Promise<{ status: ApplicationStatus }> {
    // Make the POST request with formData
    return (
      await applyClient.request({
        method: "GET",
        url: "applications/user/" + userId,
      })
    ).data;
}