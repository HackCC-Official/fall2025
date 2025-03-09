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
        <div className="flex justify-center items-center bg-gradient-to-br from-navyblue to-royalpurple p-4 min-h-screen">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-none">
                    <CardHeader className="flex flex-col items-center space-y-1 text-center">
                        <div className="mb-2 w-20 h-20">
                            <LogoIcon />
                        </div>
                        <CardTitle className="font-bold text-royalpurple text-2xl">
                            Admin Login
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-sm">
                            HackCC Administration Portal
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 mb-4 p-3 border border-red-200 rounded-md text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
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
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <a
                                            href="#"
                                            className="text-lightpurple hover:text-royalpurple text-xs transition"
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
                                    className="bg-royalpurple hover:bg-hoverpurple w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4 animate-pulse">
                                <div className="space-y-2">
                                    <div className="bg-gray-200 rounded w-24 h-5"></div>
                                    <div className="bg-gray-200 rounded-md h-10"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="bg-gray-200 rounded w-24 h-5"></div>
                                        <div className="bg-gray-200 rounded w-28 h-4"></div>
                                    </div>
                                    <div className="bg-gray-200 rounded-md h-10"></div>
                                </div>
                                <div className="bg-gray-200 rounded-md h-10"></div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col">
                        <div className="w-full text-gray-500 text-xs text-center">
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
