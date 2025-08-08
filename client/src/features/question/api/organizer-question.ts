import { applyClient } from "@/api/apply-client";
import { QuestionResponseDto } from "@/features/question/types/question-response.dto";

export async function getOrganizerQuestions(): Promise<QuestionResponseDto[]> {
  return (await applyClient.request({
    method: 'GET',
    url: 'questions/organizer'
  })).data
}