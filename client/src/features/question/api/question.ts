import { applyClient } from "@/api/apply-client";
import { QuestionResponseDto } from "@/features/question/types/question-response.dto";

export async function getQuestions(): Promise<QuestionResponseDto[]> {
  return (await applyClient.request({
    method: 'GET',
    url: 'questions'
  })).data
}