import { DarkCard } from "@/components/dark-card";
import { Logo } from "@/components/logo";
import { createAccount } from "@/features/account/api/account";
import { AccountDTO, AccountRoles } from "@/features/account/types/account-dto";
import { FrontPagePrimaryLayout } from "@/layouts/front-page-layout";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthButton } from "./auth-btn";
import { AuthCardSkeletonExtra } from "./auth-card-skeleton";
import { AuthInput } from "./auth-input";
import HotAirBalloon from "../../../../public/Hot Air Balloon.webp";
import Image from "next/image";

export default function RegisterFormPage() {
    const searchParams = useSearchParams();
    const queryClient = useQueryClient()
    const accountMutation = useMutation({
        mutationFn: (accountDTO: AccountDTO) => createAccount({ accountDTO }),
        onSettled: () => {
            queryClient.invalidateQueries({
            queryKey: ['accounts']
            })
            }
        })
    
    const [registerDone, setRegisterDone] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Use useEffect to ensure component only renders on client-side
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Password doesn\'t match, please try again')
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            // Get the redirect_to query parameter
            const redirectTo = searchParams?.get('redirect_to') || '';

            const data = await accountMutation.mutateAsync({
                email, 
                password,
                id: '',
                firstName: "",
                lastName: "",
                roles: [AccountRoles.USER],
                redirectTo: redirectTo // Use the captured redirect_to parameter
            });

            console.log("Registered in successfully:", data);
            setRegisterDone(true)
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
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
                                <h1>Register for an Account</h1>
                                <p className="mt-4 font-mont text-lg md:text-xl">
                                    Already have an account?{' '}
                                    <a
                                        className="underline hover:no-underline"
                                        href="/login"
                                    >
                                        Sign in→
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
                            {
                                !isClient &&
                                <AuthCardSkeletonExtra />
                            }
                            {!registerDone && isClient && (
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
                                    </div>

                                    <div className="space-y-2">
                                        <AuthInput
                                            id="password"
                                            type="password"
                                            placeholder="Re-enter password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <AuthButton
                                        type='submit'
                                        text="Register"
                                        loadingText="Creating Account..."
                                        isLoading={isLoading}
                                    />
                                </form>
                                )
                            }
                            {
                                registerDone && isClient &&
                                <>
                                    <p className="text-white text-base">
                                        Thanks for signing up! Please check your inbox for a confirmation email (and your spam folder just in case). 
                                    </p>
                                    <p className="mt-4 font-semibold text-white text-2xl">
                                        Welcome to HackCC!
                                    </p>
                                </>
                            }
                        </DarkCard>
                    </div>
                </div>
        </FrontPagePrimaryLayout>
    );
}

// <div className="w-full text-gray-500 text-xs text-center">
//     <p>
//         © {new Date().getFullYear()} HackCC. All rights
//         reserved.
//     </p>
// </div>