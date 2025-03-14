"use server"

import { getServerClient } from '../lib/supabase-server';

export async function signInWithEmailAndPassword(data: {
    email: string;
    password: string;
}) {
    const supabase = await getServerClient();
    const result = await supabase.auth.signInWithPassword({ email: data.email, password: data.password});
    return result;
}

export async function signUpWithEmailAndPassword(data: {
    email: string;
    password: string;
}) {
    const supabase = await getServerClient();
    const result = await supabase.auth.signUp({ email: data.email, password: data.password, options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login?redirect=apply`
    }});

    return result;
}