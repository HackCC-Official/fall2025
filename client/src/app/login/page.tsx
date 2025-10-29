"use client";

import { LoginFormPage } from "@/features/auth/components/login-form-page";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <Suspense>
            <div className="overflow-y-hidden"> 
                <LoginFormPage />
            </div>
        </Suspense>
    )
}

// <div className="w-full text-gray-500 text-xs text-center">
//     <p>
//         © {new Date().getFullYear()} HackCC. All rights
//         reserved.
//     </p>
// </div>
