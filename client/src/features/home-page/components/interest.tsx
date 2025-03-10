"use client";
import { useState, useEffect, useRef } from "react";
import {
    createInterestedUser,
    sendEmail,
} from "@/features/outreach/api/outreach";
import type { AddInterestedUser } from "@/features/outreach/types/interested-users.dto";
import type { SendEmailDto } from "@/features/outreach/types/email.dto";
import axios, { AxiosError } from "axios";
import { renderThankYouEmail } from "@/emails/render-thank-you-email";
import {
    FiMail,
    FiSend,
    FiCheckCircle,
    FiAlertCircle,
    FiLoader,
} from "react-icons/fi";

export const Interest = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState(false);
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

    /**
     * Sends a thank you email to the user
     * @param recipientEmail - The email address of the user
     */
    const sendThankYouEmail = async (recipientEmail: string): Promise<void> => {
        try {
            // Render the thank you email HTML
            const emailHtml = await renderThankYouEmail({
                recipientEmail,
            });

            // Create the email DTO
            const emailDto: SendEmailDto = {
                from: "tiffanyn@hackcc.net",
                to: [{ email: recipientEmail }],
                subject: "Thank you for your interest in HackCC!",
                html: emailHtml,
            };

            // Send the email
            await sendEmail(emailDto);
        } catch (error) {
            // Just log the error but don't show to user as the interest registration was successful
            console.error("Failed to send thank you email:", error);
        }
    };

    const handleSubmitEmail = async () => {
        console.log("handleSubmitEmail called");

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

            // Send thank you email
            console.log("Sending thank you email");
            await sendThankYouEmail(addInterestedUserDto.email);
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
                if (axiosError.response?.status === 409) {
                    setStatus(
                        "You have already been added to the list to receive updates about the event!"
                    );
                    setSuccess(true);
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

    // Loading spinner animation
    const LoadingSpinner = () => (
        <div className="animate-fadeIn flex flex-col items-center py-6 relative">
            <div className="animate-spin text-hoverpurple text-4xl mb-4 relative">
                <FiLoader />
                <div className="absolute inset-0 rounded-full animate-ping bg-hoverpurple opacity-20"></div>
            </div>
            <p className="text-white font-medium">Processing your request...</p>
            <p className="text-white/80 text-sm mt-1">
                This will just take a moment
            </p>

            <div className="flex justify-center space-x-1 mt-4">
                <div
                    className="w-2 h-2 bg-white/80 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="w-2 h-2 bg-white/80 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="w-2 h-2 bg-white/80 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="2xl:w-[550px] md:w-[450px] sm:w-[400px] w-[300px] font-mont bg-black bg-opacity-20 backdrop-blur-sm px-7 py-8 rounded-3xl relative 2xl:text-lg md:text-md text-sm flex flex-col text-center z-10 shadow-lg border border-white/10 transition-all duration-300"
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

            {!isSubmitting && !success && (
                <div className="animate-fadeIn relative">
                    <p className="font-semibold text-white/90 mb-3">
                        Sign up to receive updates{" "}
                        <br className="sm:hidden inline" /> about the event
                    </p>
                    <div className="flex sm:flex-row flex-col items-center pt-3 md:pt-4 relative">
                        <div className="sm:w-2/3 w-full relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navyblue">
                                <FiMail />
                            </div>
                            <input
                                name="email"
                                className="w-full bg-white/90 sm:mb-0 mb-3 px-10 py-3 rounded-lg text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-hoverpurple transition-all duration-300 shadow-sm"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        <div className="sm:w-1/3 w-full sm:ml-3 md:ml-4">
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
            {!isSubmitting && success && (
                <div className="animate-fadeIn flex flex-col items-center py-4 relative">
                    <div className="text-green-400 text-4xl mb-3">
                        <FiCheckCircle />
                    </div>
                    <p className="text-white font-medium">
                        Thank you for your interest!
                    </p>
                    <p className="text-white/80 text-sm mt-1">
                        You&apos;ll receive updates about our event
                    </p>
                </div>
            )}
            {status && !success && !isSubmitting && (
                <div
                    className={`mt-4 flex flex-col md:text-md text-sm lg:text-base text-center relative ${status.includes("Error") ? "text-red-300" : "text-white/80"}`}
                >
                    {status.includes("Error") ? (
                        <div className="flex items-center justify-center">
                            <span className="text-red-300 mr-2">
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
