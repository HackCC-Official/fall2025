import { qrClient } from "@/api/qr-client";
import { AttendanceDTO } from "../types/attendance-dto";
import { AttendanceQueryParamDTO } from "../types/attendance-query-param.dto";

export async function getAttendances(query?: AttendanceQueryParamDTO): Promise<AttendanceDTO[]> {
  return (await qrClient.request({
    method: 'GET',
    url: 'attendances',
    params: query
  })).data
}

export async function takeAttendance(attendanceDTO : { event_id: string, account_id: string }): Promise<AttendanceDTO[]> {
  return (await qrClient.request({
    method: 'POST',
    url: 'attendances',
    data: attendanceDTO
  })).data
}

