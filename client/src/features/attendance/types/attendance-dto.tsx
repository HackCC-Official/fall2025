export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT'
}

export interface AttendanceDTO {
  status: AttendanceStatus;
  id: string;
  account_id: string;
  event_id: string;
  checkedInAt: string;
}