"use client";

import RegisterFormPage from "@/features/auth/components/register-form-page";
import { Suspense } from "react";

export default function RegisterPage() {
    return (
        <Suspense>
            <div className="overflow-y-hidden">
                <RegisterFormPage />
            </div>
        </Suspense>
    )
}
