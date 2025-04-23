import { AccountDTO } from "@/features/account/types/account-dto";

export interface WorkshopRequestDTO {
  name: string;
  description: string;
  location: string;
  organizers: string[];
}

export interface WorkshopResponseDTO {
  name: string;
  description: string;
  location: string;
  organizers: AccountDTO[];
}