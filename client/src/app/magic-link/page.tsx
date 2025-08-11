// app/onboard/page.tsx
'use client'; // Mark this as a Client Component
import { Suspense } from 'react';
import { MagicLinkPageContent } from '@/features/account/components/magic-link-page';


export default function MagicLinkPage() {
  return (
    <Suspense>
      <div className="overflow-y-hidden">
        <MagicLinkPageContent />
      </div>
    </Suspense>
  )
}