"use client";

import { ForgotPasswordContent } from "@/features/account/components/forgot-password";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
    return (
        <Suspense>
            <div className="overflow-y-hidden"> 
                <ForgotPasswordContent />
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
