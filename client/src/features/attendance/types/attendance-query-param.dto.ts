import { AttendanceStatus } from "./attendance-dto";

export class AttendanceQueryParamDTO {
  status?: AttendanceStatus;
  event_id?: string;
}