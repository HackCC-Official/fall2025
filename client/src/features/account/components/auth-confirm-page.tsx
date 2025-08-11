'use client'

import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { Homebg } from "@/features/home-page/components/homebg";
import { EmailOtpType } from "@supabase/supabase-js"
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation"
import Logo from "../../../../public/Logo.webp"
import HotAirBalloon from "../../../../public/Hot Air Balloon.webp"
import { DarkCard } from "@/components/dark-card";
import { AuthButton } from "@/features/auth/components/auth-btn";
import { useEffect, useState } from "react";
import { FrontPagePrimaryLayout } from "@/layouts/front-page-layout";

export function ConfirmContent() {
  const [init, setInit] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
      const checkAuth = async () => {
        const supabase = await getBrowserClient()
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            redirect('/')
          }

          if (searchParams) {
            const token_hash = searchParams.get('token_hash')
            const type = searchParams.get('type') as EmailOtpType | null
            const redirect_to = searchParams.get('redirect_to') ?? '/'
            if (!token_hash || !type || !redirect_to) {
              redirect('/')
            }
          }

          setInit(true);
      };

      checkAuth();
  }, [searchParams]);

  async function confirmUser() {
    if (searchParams) {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type') as EmailOtpType | null
      const redirect_to = searchParams.get('redirect_to') ?? '/'

      if (token_hash && type && redirect_to) {
        const supabase = await getBrowserClient()
        const { error } = await supabase.auth.verifyOtp({
          type,
          token_hash,
        })
        
        if (!error) {
          // redirect user to specified redirect URL or root of app
          redirect(redirect_to)
        }
      }
    }
  }

  if (!init) {
    return (
      <FrontPagePrimaryLayout />
    )
  }
  

  return (
    <FrontPagePrimaryLayout>
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="relative flex">
            <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
            <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
        </div>
        <div className="z-10 mt-4 mb-8 font-bagel text-white text-3xl md:text-4xl text-center">
          <h1>Confirm your Account</h1>
        </div>
        <DarkCard>
          <p className="font-mont text-white">Just one last step! <br/> Please click the {'"confirm"'} button below to proceed</p>
          <AuthButton
            className="mt-4"
            type='button'
            onClick={confirmUser}
            text="Confirm"
            loadingText="Confirming account..."
            isLoading={false}
          />
        </DarkCard>
      </div>
    </FrontPagePrimaryLayout>
  )
}