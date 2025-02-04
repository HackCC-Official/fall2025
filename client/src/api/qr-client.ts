import axios from 'axios'

export const qrClient = axios.create({
  baseURL: process.env.QR_SERVICE_URL
})