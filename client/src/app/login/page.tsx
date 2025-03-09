"use client";

import { useState, useEffect } from "react";
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navyblue to-royalpurple p-4">
            <div className="w-full max-w-md">
                <Card className="border-none shadow-xl">
                    <CardHeader className="space-y-1 flex flex-col items-center text-center">
                        <div className="w-20 h-20 mb-2">
                            <LogoIcon />
                        </div>
                        <CardTitle className="text-2xl font-bold text-royalpurple">
                            Admin Login
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                            HackCC Administration Portal
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        {isClient ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <a
                                            href="#"
                                            className="text-xs text-lightpurple hover:text-royalpurple transition"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-royalpurple hover:bg-hoverpurple"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4 animate-pulse">
                                <div className="space-y-2">
                                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                                    <div className="h-10 bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 rounded-md"></div>
                                </div>
                                <div className="h-10 bg-gray-200 rounded-md"></div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col">
                        <div className="text-center text-xs text-gray-500 w-full">
                            <p>
                                © {new Date().getFullYear()} HackCC. All rights
                                reserved.
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
