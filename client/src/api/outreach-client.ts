import axios from "axios";

export const outreachClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_OUTREACH_SERVICE_URL,
});
