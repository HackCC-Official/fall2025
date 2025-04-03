import { ConfirmContent } from "@/features/account/components/auth-confirm-page";
import { Suspense } from "react";

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  )
}