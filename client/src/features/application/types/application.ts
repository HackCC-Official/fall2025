import { SubmissionRequestDTO } from "@/features/submission/types/submission-request.dto";
import { ApplicationStatus } from "./status.enum";

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