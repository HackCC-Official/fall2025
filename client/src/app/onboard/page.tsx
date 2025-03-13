// app/onboard/page.tsx
'use client'; // Mark this as a Client Component

import { getBrowserClient } from '@/features/auth/lib/supabase-client';
import { Homebg } from '@/features/home-page/components/homebg';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from "../../../public/Logo.svg"
import HotAirBalloon from "../../../public/Hot Air Balloon.png"
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { resetPassword } from '@/features/auth/utils/auth-browser';

interface TokenParams {
  access_token: string;
  refresh_token: string;
  expires_in?: string;
  token_type?: string;
  type?: string;
}

export default function OnboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter()
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Extract tokens from the URL hash
    const hashParams = window.location.hash.substring(1); // Remove the '#' character
    if (!hashParams) return;

    const params: TokenParams = hashParams
      .split('&')
      .reduce<TokenParams>((acc, param) => {
        const [key, value] = param.split('=');
        acc[key as keyof TokenParams] = value;
        return acc;
      }, {} as TokenParams);

    const { access_token, refresh_token } = params;

    if (access_token && refresh_token) {
      handleInvite(access_token, refresh_token);
    }
  }, [searchParams]);

  // Use useEffect to ensure component only renders on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInvite = async (accessToken: string, refreshToken: string) => {
    // Set the session using the tokens
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error('Error setting session:', error);
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (password !== confirmPassword) {
      setError('Password doesn\'t match, please try again')
      return;
    }

      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
          const { error: authError } = await resetPassword(password);

          if (authError) {
              setError(
                  authError.message ||
                      "Failed to onboard. Contact the administrators"
              );
              console.error("Error onboarding in:", authError);
          }
          // Redirect the user to a protected page or dashboard
          router.push('/panel')
      } catch (err) {
          setError("An unexpected error occurred. Please try again.");
          console.error("Onboarding error:", err);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Homebg />
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="relative flex">
            <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
            <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
        </div>
        <div className="z-10 mt-4 mb-8 font-bagel text-white text-3xl md:text-4xl text-center">
          <h1>Onboard</h1>
        </div>
          <div className="relative flex flex-col bg-black bg-opacity-20 px-7 py-7 rounded-3xl w-[275px] sm:w-[350px] font-mont text-xl text-center">
              {error && (
                  <div className="flex items-center gap-2 bg-red-50 mb-4 p-3 border border-red-200 rounded-md text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                  </div>
              )}
                  {isClient ? (
                      <form className="space-y-4">
                          <div className="space-y-2">
                              <input
                                  className="bg-white sm:mr-3 md:mr-5 mb-3 sm:mb-0 px-4 py-2 rounded-md w-full text-black text-center"
                                  id="password"
                                  type="password"
                                  placeholder="Password"
                                  value={password}
                                  onChange={(e) =>
                                      setPassword(e.currentTarget.value)
                                  }
                                  required
                              />
                          </div>

                          <div className="space-y-2">
                              <input
                                  className="bg-white sm:mr-3 md:mr-5 mb-3 sm:mb-0 px-4 py-2 rounded-md w-full text-black text-center"
                                  id="confirmedpassword"
                                  type="password"
                                  placeholder="Confirmed Password"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                      setConfirmPassword(e.target.value)
                                  }
                                  required
                              />
                          </div>

                          <button
                              type='button'
                              onClick={handleSubmit}
                              className="bg-navyblue hover:bg-hoverpurple py-2 rounded-md w-full text-white text-center text-nowrap cursor-pointer"
                              disabled={isLoading}
                          >
                              {isLoading ? "Onboarding..." : "Set password"}
                          </button>
                      </form>
                  ) : (
                      <div className="space-y-4 animate-pulse">
                          <div className="space-y-2">
                              <div className="bg-gray-200 rounded-md h-10"></div>
                          </div>
                          <div className="space-y-2">
                              <div className="bg-gray-200 rounded-md h-10"></div>
                              <div className="flex justify-end">
                                  <div className="bg-gray-200 rounded w-28 h-4"></div>
                              </div>
                          </div>
                          <div className="bg-gray-200 rounded-md h-10"></div>
                      </div>
                  )}
          </div>
      </div>
    </div>
  );
}