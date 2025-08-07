import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { Homebg } from "@/features/home-page/components/homebg";
import { FrontPagePrimaryLayout } from "@/layouts/front-page-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function MagicLinkPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter()

  useEffect(() => {
    // Extract the magic link code from the URL query parameters
    const token = searchParams ? searchParams.get('token') : null;
    const email = searchParams ? searchParams.get('email') : null;
    if (!token || !email) return;

    handleMagicLink(token, email);
  }, [searchParams]);

  const handleMagicLink = async (token: string, email: string) => {
    const supabase = getBrowserClient();

    // Verify the magic link code
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      type: 'email',
      token
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
    <FrontPagePrimaryLayout />
  );
}