import { DarkCard } from "@/components/dark-card";
import { Logo } from "@/components/logo";
import { Homebg } from "@/features/home-page/components/homebg";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "../utils/auth";
import { AuthButton } from "./auth-btn";
import { AuthCardSkeletonDefault } from "./auth-card-skeleton";
import { AuthInput } from "./auth-input";
import Image from "next/image";
import HotAirBalloon from "../../../../public/Hot Air Balloon.webp";
import { FrontPagePrimaryLayout } from "@/layouts/front-page-layout";


export function LoginFormPage() {
    const searchParams = useSearchParams()
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

        const { error: authError } = await signInWithEmailAndPassword(
            { email, password }
        );

        if (authError) {
            // Handle specific auth errors you expect
            let message = "Invalid email or password";
            
            if (authError.message.includes("Email not confirmed")) {
                message = "Please verify your email first";
            }
            // Add more specific error cases as needed
            
            setError(message);
            return;
        }

        // Success case
        router.push(searchParams?.get('redirect') || '/');

        setIsLoading(false);
    };

    return (
        <FrontPagePrimaryLayout>
            <div className="flex justify-center items-center p-4 min-h-screen">
                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <div className="flex flex-col justify-center items-center mx-auto">
                        <div className="relative flex">
                            <Logo />
                            <Image
                                className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear"
                                src={HotAirBalloon}
                                alt="Hot Air Balloon"
                                sizes="(min-width: 1540px) 116px, (min-width: 780px) 104px, (min-width: 640px) 93px, 81px"
                            ></Image>
                        </div>
                        <div className="z-10 mt-4 mb-16 font-bagel text-white text-3xl md:text-4xl text-center">
                            <h1>Sign In</h1>
                            <p className="mt-4 font-mont text-lg md:text-xl">
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
                    <DarkCard>
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 mb-4 p-3 border border-red-200 rounded-md text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}
                        {isClient ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <AuthInput
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
                                    <div className="flex justify-end items-center w-full">
                                        <a
                                            href="/forgot-password"
                                            className="text-white hover:text-royalpurple text-xs transition"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <AuthButton
                                    type='submit'
                                    text="Sign In"
                                    loadingText="Signing In..."
                                    isLoading={isLoading}
                                />
                            </form>
                        ) : (
                            <AuthCardSkeletonDefault />
                        )}
                    </DarkCard>
                </div>
            </div>
        </FrontPagePrimaryLayout>
    );
}