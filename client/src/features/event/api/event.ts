import { EventDTO } from "../types/event-dto";
import { qrClient } from "../../../api/qr-client";

export async function getEvents(): Promise<EventDTO[]> {
  return (await qrClient.request({
    method: 'GET',
    url: '/events'
  })).data
}