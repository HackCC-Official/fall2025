import { qrClient } from "@/api/qr-client";
import { WorkshopRequestDTO, WorkshopResponseDTO } from "../types/workshop";

export async function getWorkshops() : Promise<WorkshopResponseDTO[]> {
  return (
    await qrClient.request({
      method: "GET",
      url: "workshops",
    })
  ).data
}

export async function getWorkshopById(workshopId: string) : Promise<WorkshopResponseDTO> {
  return (
    await qrClient.request({
      method: "GET",
      url: "workshops/" + workshopId,
    })
  ).data
}


export async function createWorkshop(workshopDTO: WorkshopRequestDTO) : Promise<WorkshopResponseDTO> {
  return (
    await qrClient.request({
      method: "POST",
      url: "workshops",
      data: workshopDTO
    })
  ).data
}

export async function updateWorkshop(workshopId: string, workshopDTO: WorkshopRequestDTO) : Promise<WorkshopResponseDTO> {
  return (
    await qrClient.request({
      method: "PUT",
      url: "workshops/" + workshopId,
      data: workshopDTO
    })
  ).data
}

export async function deleteWorkshop(workshopId: string) : Promise<WorkshopRequestDTO> {
  return (
    await qrClient.request({
      method: "DELETE",
      url: "workshops/" + workshopId,
    })
  ).data
}