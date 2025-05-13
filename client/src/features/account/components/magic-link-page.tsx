import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { Homebg } from "@/features/home-page/components/homebg";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function MagicLinkPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter()

  useEffect(() => {
    // Extract the magic link code from the URL query parameters
    const code = searchParams ? searchParams.get('code') : null;
    const email = searchParams ? searchParams.get('email') : null;
    if (!code || !email) return;
    
    handleMagicLink(code, email);
  }, [searchParams]);

  const handleMagicLink = async (code: string, email: string) => {
    const supabase = getBrowserClient();
    // Verify the magic link code
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email: email,
      type: 'email',
      token: code,
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