import { EventDTO } from "../types/event-dto";
import { qrClient } from "../../../api/qr-client";

export async function getEvents(): Promise<EventDTO[]> {
  return (await qrClient.request({
    method: 'GET',
    url: 'events'
  })).data
}

export async function getEventByID(eventId: string): Promise<EventDTO> {
  return (await qrClient.request({
    method: 'GET',
    url: 'events/' + eventId
  })).data
}

export async function createEvent(eventDTO: EventDTO): Promise<EventDTO> {
  return (await qrClient.request({
    method: 'POST',
    url: 'events',
    data: eventDTO
  })).data
}

export async function updateEvent(id: string, eventDTO: EventDTO): Promise<EventDTO> {
  return (await qrClient.request({
    method: 'PUT',
    url: 'events/' + id,
    data: eventDTO
  })).data
}