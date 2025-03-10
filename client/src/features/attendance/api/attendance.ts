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