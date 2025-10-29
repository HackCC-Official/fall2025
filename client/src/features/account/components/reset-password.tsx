'use client'

import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { Homebg } from "@/features/home-page/components/homebg";
import { EmailOtpType } from "@supabase/supabase-js"
import Image from "next/image";
import { redirect, useRouter, useSearchParams } from "next/navigation"
import Logo from "../../../../public/Logo.webp"
import HotAirBalloon from "../../../../public/Hot Air Balloon.webp"
import { DarkCard } from "@/components/dark-card";
import { AuthButton } from "@/features/auth/components/auth-btn";
import { useEffect, useState } from "react";
import { FrontPagePrimaryLayout } from "@/layouts/front-page-layout";
import { AuthInput } from "@/features/auth/components/auth-input";
import { AlertCircle } from "lucide-react";

export function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter()
    
  const [init, setInit] = useState(false);
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [complete, setComplete] = useState<boolean>(false)
  const supabase = getBrowserClient()
    const [error, setError] = useState('')

  useEffect(() => {
      const checkAuth = async () => {
        if (searchParams) {
          const token_hash = searchParams.get('token_hash')
          if (!token_hash) {
            redirect('/')
          }

          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'recovery'
          })

          if (error) {
            redirect('/')
          }

        }

        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event !== "INITIAL_SESSION") {
            redirect('/')
          }
        })

        setInit(true);
      };

      checkAuth();
  }, []);


  if (!init) {
    return (
      <FrontPagePrimaryLayout />
    )
  }

  async function resetPassword() {
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password: password })
    if (!error) {
      setComplete(true);
    } else {
      setError(error.message)
    }

    setLoading(false);
  }
  

  return (
    <FrontPagePrimaryLayout>
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="relative flex">
            <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
            <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
        </div>
        <div className="z-10 mt-4 mb-8 font-bagel text-white text-3xl md:text-4xl text-center">
          <h1>Reset Password</h1>
        </div>
        <DarkCard>
            {error && (
              <div className="flex items-center gap-2 bg-red-50 mb-4 p-3 border border-red-200 rounded-md text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            {!complete &&
              <form className="space-y-4">
                <p className="font-mont text-white">Enter your new password</p>
                <div className="space-y-2 mt-4">
                  <AuthInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <AuthInput
                      id="confirmpassword"
                      type="password"
                      placeholder="Confirmed Password"
                      value={confirmPassword}
                      onChange={(e) =>
                          setConfirmPassword(e.target.value)
                      }
                      required
                  />
                </div>

                <AuthButton
                    type='submit'
                    onClick={resetPassword}
                    text="Reset Password"
                    loadingText="Resetting password..."
                    isLoading={loading}
                />
              </form>
            }
            {
              complete && 
              <>
                <div>You've successfully updated your password.</div>
                <AuthButton
                    type='button'
                    onClick={() => router.push('/')}
                    text="Go back home"
                    loadingText="Go back home"
                    isLoading={false}
                />
              </>
            }
        </DarkCard>
      </div>
    </FrontPagePrimaryLayout>
  )
}