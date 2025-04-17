import { AccountDTO } from "@/features/account/types/account-dto";

export interface RequestTeamDTO {
  name: string;
  account_ids: string[];
}

export interface ResponseTeamDTO {
  id: string;
  name: string;
  accounts: AccountDTO[];
  createdAt: string;
}