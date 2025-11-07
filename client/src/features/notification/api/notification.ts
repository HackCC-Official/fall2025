import { accountClient } from "@/api/account-client";
import { RequestNotificationDTO, ResponseNotificationDTO } from "../types/notification";

export async function sendNotification(notificationDTO: RequestNotificationDTO) : Promise<ResponseNotificationDTO> {
  return (await accountClient.request({
    method: 'POST',
    url: 'notification',
    data: notificationDTO
  })).data
}

export async function getAllNotification() : Promise<ResponseNotificationDTO[]> {
  return (await accountClient.request({
    method: 'GET',
    url: 'notification',
  })).data
}

export async function acceptNotification(notificationId: string) : Promise<ResponseNotificationDTO> {
  return (await accountClient.request({
    method: 'POST',
    url: 'notification/' + notificationId + '/accept',
  })).data
}

export async function denyNotification(notificationId: string) : Promise<ResponseNotificationDTO> {
  return (await accountClient.request({
    method: 'POST',
    url: 'notification/' + notificationId + '/deny',
  })).data
}