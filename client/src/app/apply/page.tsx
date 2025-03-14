"use client";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { ApplicationFormPage } from "@/features/application/components/application-form-page";

export default function ApplyPage() {
    const router = useRouter()

    useEffect(() => {
    // Function to check if user is logged in
    const checkAuth = async () => {
        const supabase = getBrowserClient()
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // User is logged in, redirect to a protected route
            router.push('/register'); // Replace with your desired route
        }
    };

    checkAuth();
    }, [router]); // Add navigate to the dependency array

    return (
        <Suspense>
            <ApplicationFormPage />
        </Suspense>
    )
}
