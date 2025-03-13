"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "@/features/auth/utils/auth";
import { AlertCircle } from "lucide-react";
import Logo from "../../../public/Logo.svg";
import HotAirBalloon from "../../../public/Hot Air Balloon.png";
import { Homebg } from "@/features/home-page/components/homebg";

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
                    authError.message ||
                        "Failed to login. Please check your credentials."
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
        <div className="relative flex flex-col w-screen h-screen overflow-hidden">
            <div className="absolute w-screen h-screen bg-bgpurple -z-20"></div>
            <Homebg></Homebg>
            <div className="flex justify-center items-center p-4 min-h-screen">
                <div className="w-full max-w-md flex flex-col items-center justify-center">
                    <div className="flex flex-col justify-center items-center mx-auto">
                        <div className="relative flex">
                            <Image
                                className="2xl:h-56 lg:h-48 md:h-48 sm:h-48 h-40 w-auto ml-[5%] z-10"
                                src={Logo}
                                alt="HackCC Logo"
                            ></Image>
                            <Image
                                className="2xl:h-40 md:h-36 sm:h-32 h-28 w-auto absolute 2xl:-right-80 md:-right-40 sm:-right-32 -right-12 bottom-1/4 animate-bobbing ease-linear z-10"
                                src={HotAirBalloon}
                                alt="Hot Air Balloon"
                            ></Image>
                        </div>
                        <div className="font-bagel mt-4 mb-16 text-center md:text-4xl text-3xl text-white z-10">
                            <p>Sign In</p>
                            <p className="md:text-xl text-lg mt-4 font-mont">
                                Don&apos;t have an account?{" "}
                                <a
                                    className="underline hover:no-underline"
                                    href="/register"
                                >
                                    Register→
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="sm:w-[350px] w-[275px] font-mont bg-black bg-opacity-20 px-7 py-7 rounded-3xl relative text-xl flex flex-col text-center z-10">
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
                                        className="w-full bg-white sm:mb-0 mb-3 sm:mr-3 md:mr-5 px-4 py-2 rounded-md text-center text-black"
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
                                        className="w-full bg-white sm:mb-0 mb-3 sm:mr-3 md:mr-5 px-4 py-2 rounded-md text-center text-black"
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <div className="flex w-full justify-end items-center">
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
                                    className="w-full text-nowrap text-center bg-navyblue hover:bg-hoverpurple cursor-pointer text-white py-2 rounded-md"
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
