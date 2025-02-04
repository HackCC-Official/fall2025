import { EventDTO } from "../types/event-dto";
import { qrClient } from "../../../api/qr-client";

export async function getEvents(): Promise<EventDTO[]> {
  return (await qrClient.request({
    method: 'GET',
    url: 'events'
  })).data
}

export async function createEvent(eventDTO: EventDTO): Promise<EventDTO> {
  return (await qrClient.request({
    method: 'POST',
    url: 'events',
    data: eventDTO
  })).data
}