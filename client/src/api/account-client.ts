import axios from 'axios'

export const qrClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ACCOUNT_SERVICE_URL
})