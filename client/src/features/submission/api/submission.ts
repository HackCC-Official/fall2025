import { applyClient } from "@/api/apply-client";
import { SubmissionResponseDTO } from "../types/submission-request.dto";

export async function getSubmissionById(id: string): Promise<SubmissionResponseDTO> {
  return (await applyClient.request({
    method: 'GET',
    url: 'submissions/hackathon' + id
  })).data
}