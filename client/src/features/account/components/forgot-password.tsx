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
import { useState } from "react";
import { FrontPagePrimaryLayout } from "@/layouts/front-page-layout";
import { AuthInput } from "@/features/auth/components/auth-input";

export function ForgotPasswordContent() {
  const [email, setEmail] = useState<string>("")
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const supabase = getBrowserClient()

  async function resetPassword() {
    const { data, error } = await supabase.auth
    .resetPasswordForEmail(email, {
      redirectTo: `${process.env.MAIN_HOSTNAME}?email=${encodeURIComponent(email)}`
    })
    setEmailSent(true);
  }
  return (
    <FrontPagePrimaryLayout>
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="relative flex">
            <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
            <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
        </div>
        <div className="z-10 mt-4 mb-8 font-bagel text-white text-3xl md:text-4xl text-center">
          <h1>Forgot Password</h1>
        </div>
        <DarkCard>
          {
            !emailSent &&
            <>
              <p className="font-mont text-white">If you've forgotten your password or wish to reset it, please enter your email below.</p>
              <AuthInput
                className="mt-4"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                required
              />
              <AuthButton
                className="mt-4"
                type='button'
                onClick={resetPassword}
                text="Reset Password"
                loadingText="Loading..."
                isLoading={emailSent}
              />
            </>
          }
          {
            emailSent &&
            <p className="font-mont text-white">We’ve sent you an email with instructions to reset your password. Please check your inbox and follow the link to create a new password.</p>
          }
        </DarkCard>
      </div>
    </FrontPagePrimaryLayout>
  )
}