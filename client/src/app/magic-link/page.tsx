// app/onboard/page.tsx
'use client'; // Mark this as a Client Component

import { getBrowserClient } from '@/features/auth/lib/supabase-client';
import { Homebg } from '@/features/home-page/components/homebg';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MagicLinkPage() {
  const router = useRouter()

  useEffect(() => {
    // Extract the magic link code from the URL query parameters
    const code = ''
    if (!code) return;

    handleMagicLink(code);
  }, []);

  const handleMagicLink = async (code: string) => {
    const supabase = getBrowserClient();

    // Verify the magic link code
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      type: 'email',
      token_hash: code
    });

    if (error) {
      console.error('Error verifying magic link:', error);
      return;
    }

    if (session) {
      // Redirect the user to a protected page or dashboard
      router.push('/panel')
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Homebg />
    </div>
  );
}