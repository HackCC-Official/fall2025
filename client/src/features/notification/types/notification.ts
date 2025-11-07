import { AccountDTO } from "@/features/account/types/account-dto";
import { ResponseTeamDTO } from "@/features/team/type/team";

export interface RequestNotificationDTO {
  accountId: string;
  teamId: string;
}

export interface ResponseNotificationDTO {
  id: string;
  account: AccountDTO;
  team: ResponseTeamDTO,
}