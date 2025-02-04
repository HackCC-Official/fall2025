import axios from 'axios'

export const qrClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QR_SERVICE_URL
})