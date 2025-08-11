import { ConfirmContent } from "@/features/account/components/auth-confirm-page";
import { Suspense } from "react";

export default function ConfirmPage() {
  return (
    <Suspense>
        <div className="overflow-y-hidden"> 
          <ConfirmContent />
        </div>
    </Suspense>
  )
}