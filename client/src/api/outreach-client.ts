import axios from "axios";

if (!process.env.NEXT_PUBLIC_OUTREACH_SERVICE_URL) {
    throw new Error(
        "NEXT_PUBLIC_OUTREACH_SERVICE_URL environment variable is not defined"
    );
}

export const outreachClient = axios.create({
    baseURL: "/outreach-service",
    headers: {
        "Content-Type": "application/json",
    },
});

outreachClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
