import { getBrowserClient } from "../lib/supabase-client";

export async function resetPassword(password: string) {
    const supabase = getBrowserClient()
    const result = await supabase.auth.updateUser({ password })
    console.log("RESULT", result)
    return result;
}