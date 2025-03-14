import { OnboardPageContent } from "@/features/account/components/onboard-page";
import { Suspense } from "react";

export default function OnboardPage() {
  return (
    <Suspense>
      <OnboardPageContent />
    </Suspense>
  )
}