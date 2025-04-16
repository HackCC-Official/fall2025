import { QuestionResponseDto } from "@/features/question/types/question-response.dto";

export interface SubmissionRequestDTO {
  id?: string;
  questionId: number;
  answer : string;
}

export interface SubmissionResponseDTO {
  id: string;
  question: QuestionResponseDto;
  answer : string;
}