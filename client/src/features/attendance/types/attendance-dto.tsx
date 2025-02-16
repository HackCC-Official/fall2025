import { AccountDTO } from "@/features/account/types/account-dto";

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT'
}

export interface AttendanceDTO {
  status: AttendanceStatus;
  id: string;
  account: AccountDTO;
  event_id: string;
  checkedInAt: string;
}