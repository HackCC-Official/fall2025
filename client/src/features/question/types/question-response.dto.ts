import { QuestionType } from "./question-type.enum";

export interface QuestionResponseDto {
  id : number;
  prompt : string;
  description : string;
  possibleAnswers?: string[];
  type: QuestionType;
  isApplicationField?: boolean;
  applicationField?: string;
  group?: string;
  isSingleLabel: boolean;
  placeholder?: string;
  name?: string;
}
