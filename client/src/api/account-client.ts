import { getBrowserClient } from '@/features/auth/lib/supabase-client';
import axios, { InternalAxiosRequestConfig } from 'axios';

// Create the axios instance
export const accountClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ACCOUNT_SERVICE_URL
});

// Get the Supabase client
const supabase = getBrowserClient();

// Add a request interceptor to attach the access token
accountClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session?.session?.access_token;

    if (accessToken && !config.headers.get('Authorization')) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  },
  (error: Error) => Promise.reject(error)
);