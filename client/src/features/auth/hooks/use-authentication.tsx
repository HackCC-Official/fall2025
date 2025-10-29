import { useEffect, useState } from "react";
import { getBrowserClient } from "../lib/supabase-client";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

export function useAuthentication({ redirect = true } : { redirect?: boolean } = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [authCheck, setAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getBrowserClient()

  useEffect(() => {
      const checkAuth = async () => {
          const { data: { session } } = await supabase.auth.getSession();

          if (!session) {
              if (redirect) {
                // Capture the current URL path to use as redirect_to
                const redirectTo = encodeURIComponent(pathname || '');
                router.push(`/register?redirect_to=${redirectTo}`);
              }
          } else {
              setAuthChecked(true);
              setUser(session.user)
          }
      };

      checkAuth()
  }, [router, pathname, supabase.auth]);

  return {
    user,
    setUser,
    authCheck,
    setAuthChecked
  }
}