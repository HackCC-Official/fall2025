import { qrClient } from "@/api/qr-client";
import { QrCodeDTO } from "../types/qr-code";

export async function getQrCode(account_id: string): Promise<QrCodeDTO> {
  return (await qrClient.get(`/qr-codes/${account_id}`)).data
}