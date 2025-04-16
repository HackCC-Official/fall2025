import { SubmissionRequestDTO } from "@/features/submission/types/submission-request.dto";
import { ApplicationStatus } from "./status.enum";
import { AccountDTO } from "@/features/account/types/account-dto";

export interface ApplicationRequestDTO {
  userId: string;
  status: ApplicationStatus;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  school: string;
  submissions: SubmissionRequestDTO[];
}

export interface ApplicationResponseDTO {
  id: string;
  user: AccountDTO;
  status: ApplicationStatus;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  school: string;
  transcriptUrl: string;
  resumeUrl: string;
  submissions: SubmissionRequestDTO[];
}