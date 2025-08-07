import { useEffect, useState } from "react";
import { getBrowserClient } from "../lib/supabase-client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  const [authCheck, setAuthChecked] = useState(false);
  const router = useRouter();
  const supabase = getBrowserClient()

  useEffect(() => {
      const checkAuth = async () => {
          const { data: { session } } = await supabase.auth.getSession();

          if (!session) {
              router.push('/register');
          } else {
              setAuthChecked(true);
              setUser(session.user)
          }
      };

      checkAuth();
  }, [router, supabase.auth]);

  return {
    user,
    setUser,
    authCheck,
    setAuthChecked
  }
}