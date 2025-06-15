import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import axios, { InternalAxiosRequestConfig } from "axios";

if (!process.env.NEXT_PUBLIC_OUTREACH_SERVICE_URL) {
    throw new Error(
        "NEXT_PUBLIC_OUTREACH_SERVICE_URL environment variable is not defined"
    );
}

export const outreachClient = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_OUTREACH_SERVICE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const supabase = getBrowserClient();

outreachClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const { data: session } = await supabase.auth.getSession();
        const accessToken = session?.session?.access_token;

        if (accessToken && !config.headers.get("Authorization")) {
            config.headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return config;
    },
    (error: Error) => Promise.reject(error)
);
