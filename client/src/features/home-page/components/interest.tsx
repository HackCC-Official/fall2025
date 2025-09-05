"use client";
import { useState, useEffect, useRef } from "react";
import { createInterestedUser } from "@/features/outreach/api/outreach";
import type { AddInterestedUser } from "@/features/outreach/types/interested-users.dto";
import axios, { AxiosError } from "axios";
import {
    FiMail,
    FiSend,
    FiCheckCircle,
    FiAlertCircle,
    FiLoader,
    FiInfo,
} from "react-icons/fi";

export const Interest = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hovered, setHovered] = useState(false);

    // 3D effect states
    const containerRef = useRef<HTMLDivElement>(null);
    const [tiltStyle, setTiltStyle] = useState({});
    const [isHovering, setIsHovering] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log("Interest component mounted");
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !isHovering) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // Calculate cursor position relative to the container
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element

        // Calculate rotation based on cursor position
        // We want more subtle rotation, so we divide by larger values
        const rotateX = ((y - rect.height / 2) / rect.height) * 10; // -5 to 5 degrees
        const rotateY = ((rect.width / 2 - x) / rect.width) * 10; // -5 to 5 degrees

        // Apply transformation
        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
            transition: "transform 0.05s ease",
        });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        // Reset transform when mouse leaves
        setTiltStyle({
            transform:
                "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
            transition: "transform 0.5s ease",
        });
    };

    const isValidEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmitEmail = async () => {
        console.log("handleSubmitEmail called");

        // Reset states
        setIsDuplicate(false);
        setSuccess(false);

        // Don't allow multiple submissions
        if (isSubmitting) {
            console.log("Already submitting, ignoring click");
            return;
        }

        // Validate email
        if (!email || !isValidEmail(email)) {
            console.log("Email validation failed:", email);
            setStatus("Please enter a valid email address. 📧");
            return;
        }

        // Set submitting state
        setIsSubmitting(true);
        setStatus("Submitting...");
        console.log("Submitting email:", email);

        try {
            // Create the interested user DTO
            const addInterestedUserDto: AddInterestedUser = {
                email: email,
            };

            // Call the createInterestedUser API function
            console.log("Calling createInterestedUser");
            await createInterestedUser(addInterestedUserDto);

            // Set success status
            console.log("Registration successful");
            setStatus(
                "You have been added to the list to receive updates about the event!"
            );
            setEmail("");
            setSuccess(true);
        } catch (error) {
            console.error("Error during submission:", error);
            // Handle API errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{
                    message: string;
                    error: string;
                    statusCode: number;
                }>;

                // Check for 409 Conflict (email already registered)
                if (
                    axiosError.response?.status === 409 ||
                    (axiosError.response?.data &&
                        axiosError.response.data.statusCode === 409)
                ) {
                    console.log("Duplicate email detected:", email);
                    setStatus("");
                    setIsDuplicate(true);
                } else {
                    setStatus(
                        `Error: ${axiosError.response?.data?.message || axiosError.message}`
                    );
                }
            } else if (error instanceof Error) {
                setStatus(`Error: ${error.message}`);
            } else {
                setStatus(
                    "An unexpected error occurred. Please try again later."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle key press in the input field (submit on Enter)
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            console.log("Enter key pressed");
            e.preventDefault(); // Prevent form submission
            handleSubmitEmail();
        }
    };

    // Try again after duplicate detection
    const handleTryAgain = () => {
        setIsDuplicate(false);
        setEmail("");
    };

    // Loading spinner animation
    const LoadingSpinner = () => (
        <div className="relative flex flex-col items-center py-6 animate-fadeIn">
            <div className="relative mb-4 text-hoverpurple text-4xl animate-spin">
                <FiLoader />
                <div className="absolute inset-0 bg-hoverpurple opacity-20 rounded-full animate-ping"></div>
            </div>
            <p className="font-medium text-white">Processing your request...</p>
            <p className="mt-1 text-white/80 text-sm">
                This will just take a moment
            </p>

            <div className="flex justify-center space-x-1 mt-4">
                <div
                    className="bg-white/80 rounded-full w-2 h-2 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="bg-white/80 rounded-full w-2 h-2 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="bg-white/80 rounded-full w-2 h-2 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
        </div>
    );

    // Duplicate email component
    const DuplicateEmail = () => {
        const [buttonHovered, setButtonHovered] = useState(false);

        return (
            <div className="relative flex flex-col items-center py-4 animate-fadeIn">
                <div className="mb-3 text-yellow-400 text-4xl animate-pulse">
                    <FiInfo />
                </div>
                <p className="font-medium text-white">
                    This email is already registered!
                </p>
                <p className="mt-1 mb-4 text-white/80 text-sm">
                    You&apos;ll receive updates about the event at {email}
                </p>

                <button
                    onClick={handleTryAgain}
                    onMouseEnter={() => setButtonHovered(true)}
                    onMouseLeave={() => setButtonHovered(false)}
                    className={`mt-2 px-6 py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                        buttonHovered
                            ? "bg-hoverpurple scale-105"
                            : "bg-navyblue"
                    } text-white shadow-lg border border-white/10 backdrop-blur-sm`}
                >
                    <span>Use a different email</span>
                    <span className="ml-2">
                        {buttonHovered ? <FiMail /> : <FiMail />}
                    </span>
                    <span
                        className={`absolute inset-0 rounded-lg bg-white/10 ${buttonHovered ? "opacity-20" : "opacity-0"} transition-opacity duration-300`}
                    ></span>
                </button>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="z-10 relative flex flex-col bg-black bg-opacity-20 shadow-lg backdrop-blur-sm px-7 py-8 border border-white/10 rounded-3xl w-[300px] sm:w-[400px] md:w-[450px] 2xl:w-[550px] font-mont md:text-md text-sm 2xl:text-lg text-center transition-all duration-300"
            style={{
                ...tiltStyle,
                boxShadow: isHovering
                    ? "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(128, 128, 255, 0.2)"
                    : "0 10px 15px -10px rgba(0, 0, 0, 0.3)",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl ${isHovering ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
            ></div>

            {isSubmitting && <LoadingSpinner />}

            {isDuplicate && !isSubmitting && <DuplicateEmail />}

            {!isSubmitting && !success && !isDuplicate && (
                <div className="relative animate-fadeIn">
                    <p className="mb-3 font-semibold text-white/90 text-lg">
                        Sign up to receive updates{" "}
                        <br className="sm:hidden inline" /> about the event
                    </p>
                    <div className="relative flex sm:flex-row flex-col items-center pt-2">
                        <div className="group relative w-full sm:w-2/3">
                            <div className="top-1/2 left-3 absolute text-navyblue -translate-y-1/2 transform">
                                <FiMail />
                            </div>
                            <input
                                name="email"
                                className="bg-white/90 shadow-sm mb-3 sm:mb-0 px-10 py-3 rounded-lg outline-none focus:ring-2 focus:ring-hoverpurple w-full text-black transition-all duration-300 placeholder-gray-500"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        <div className="sm:ml-3 md:ml-4 w-full sm:w-1/3">
                            <button
                                type="button"
                                className={`w-full text-nowrap text-center py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                                    hovered
                                        ? "bg-hoverpurple scale-105"
                                        : "bg-navyblue"
                                } text-white shadow-md`}
                                onClick={() => {
                                    console.log("Button clicked");
                                    handleSubmitEmail();
                                }}
                                disabled={isSubmitting}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                <span>Get Notified</span>
                                <span className="ml-2">
                                    <FiSend />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!isSubmitting && success && !isDuplicate && (
                <div className="relative flex flex-col items-center py-4 animate-fadeIn">
                    <div className="mb-3 text-green-400 text-4xl">
                        <FiCheckCircle />
                    </div>
                    <p className="font-medium text-white">
                        Thank you for your interest!
                    </p>
                    <p className="mt-1 text-white/80 text-sm">
                        You&apos;ll receive updates about our event
                    </p>
                </div>
            )}
            {status && !success && !isSubmitting && !isDuplicate && (
                <div
                    className={`mt-4 flex flex-col md:text-md text-sm lg:text-base text-center relative ${status.includes("Error") ? "text-red-300" : "text-white/80"}`}
                >
                    {status.includes("Error") ? (
                        <div className="flex justify-center items-center">
                            <span className="mr-2 text-red-300">
                                <FiAlertCircle />
                            </span>
                            <p>{status}</p>
                        </div>
                    ) : (
                        <p>{status}</p>
                    )}
                </div>
            )}
        </div>
    );
};

/*
<div>
            <form onSubmit={handleSubmit}>
            <div>
                <input 
                name="email" 
                className="my-3 md:my-5 mr-3 md:mr-5 px-4 py-2 rounded-md" 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <button type='submit' className="bg-pink-300 hover:bg-pink-400 px-6 py-2 rounded-md text-white cursor-pointer">Get Notified</button>
            </div>
        </form>
        {status && <p className="flex flex-col md:text-md text-sm lg:text-lg text-center">{status}</p>}
        </div>
        */
