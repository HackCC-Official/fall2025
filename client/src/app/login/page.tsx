"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "@/features/auth/utils/auth";
import { LogoIcon } from "@/components/logo-icon";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Sky } from "@/components/sky";
import Logo from "../../../public/Logo.svg"
import HotAirBalloon from "../../../public/Hot Air Balloon.png"
import { Homebg } from "@/features/home-page/components/homebg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AuthError } from "@supabase/supabase-js";



export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    // Use useEffect to ensure component only renders on client-side
    useEffect(() => {
        setIsClient(true);
    }, []);

    function returnErrorMessage({ message }: AuthError) {
        return {
            message: message || "Failed to login. Please check your credentials."
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const { data, error: authError } = await signInWithEmailAndPassword(
                { email, password }
            );

            if (authError) {
                setError(
                    returnErrorMessage(authError).message
                );
                console.error("Error logging in:", authError);
            } else {
                console.log("Logged in successfully:", data);
                router.push("/panel");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Homebg></Homebg>
            <div className="flex justify-center items-center p-4 min-h-screen">
                <div className="flex flex-col justify-center items-center w-full max-w-md">
                <div className="flex flex-col justify-center items-center mx-auto">
                <div className="relative flex">
                    <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
                    <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
                </div>
                <div className="z-10 mt-4 mb-16 font-bagel text-white text-3xl md:text-4xl text-center">
                    <p>Sign In</p>
                    <p className="mt-4 font-mont text-lg md:text-xl">Don't have an account? <a className="underline hover:no-underline" href="/register">Register→</a></p>
                </div>
                </div>
                <div className="relative flex flex-col bg-black bg-opacity-20 px-7 py-7 rounded-3xl w-[275px] sm:w-[350px] font-mont text-xl text-center">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 mb-4 p-3 border border-red-200 rounded-md text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}
                        {isClient ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <input
                                        className="bg-white sm:mr-3 md:mr-5 mb-3 sm:mb-0 px-4 py-2 rounded-md w-full text-black text-center"
                                        id="email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <input
                                        className="bg-white sm:mr-3 md:mr-5 mb-3 sm:mb-0 px-4 py-2 rounded-md w-full text-black text-center"
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <div className="flex justify-end items-center w-full">
                                        <a
                                            href="#"
                                            className="text-white hover:text-royalpurple text-xs transition"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-navyblue hover:bg-hoverpurple py-2 rounded-md w-full text-white text-center text-nowrap cursor-pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing In..." : "Sign In"}
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
        </div>
    );
}

                            // <div className="w-full text-gray-500 text-xs text-center">
                            //     <p>
                            //         © {new Date().getFullYear()} HackCC. All rights
                            //         reserved.
                            //     </p>
                            // </div>