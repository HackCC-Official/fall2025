import * as React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Logo from "../../../public/Logo.svg";
import BGImage from "../../../public/BG Image.png";
import { Socials } from "@/components/socials";
import {
    MailIcon,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Home,
    AlertTriangle,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteInterestedUser } from "@/features/outreach/api/outreach";
import { motion, AnimatePresence } from "framer-motion";

interface UnsubscribePageProps {
    email?: string;
}

/**
 * Unsubscribe page component that handles email unsubscription requests
 * Accessed via /mailing/unsubscribe?email={email}
 */
export default function UnsubscribePage({
    email: initialEmail,
}: UnsubscribePageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isUnsubscribed, setIsUnsubscribed] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    // Get email from query parameters
    const email = (router.query.email as string) || initialEmail;

    /**
     * Handles the unsubscribe action by removing the user from interested users list
     */
    const handleUnsubscribe = async () => {
        if (!email) {
            toast.error("No email address provided");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Use the outreach API to delete the interested user by email
            await deleteInterestedUser(email);

            setIsUnsubscribed(true);
            toast.success("Successfully unsubscribed from mailing list");
        } catch (error) {
            console.error("Unsubscribe error:", error);
            setError("Failed to unsubscribe. Please try again later.");
            toast.error("Failed to unsubscribe. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
        exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeIn" },
        },
    };

    const iconVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                duration: 0.5,
            },
        },
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.98, transition: { duration: 0.1 } },
    };

    const floatingElementVariants = {
        animate: {
            y: [0, 15, 0],
            opacity: [0.6, 1, 0.6],
            transition: {
                y: {
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                },
                opacity: {
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                },
            },
        },
    };

    const renderContent = () => {
        // If no email is provided, show an error
        if (!email) {
            return (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                >
                    <Card className="bg-opacity-80 backdrop-blur-sm border-purple-300 border-2 shadow-xl rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent pointer-events-none rounded-xl" />
                        <CardHeader className="pb-3 sm:pb-4">
                            <motion.div
                                className="flex justify-center mb-2 sm:mb-3"
                                variants={iconVariants}
                            >
                                <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-red-400" />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <CardTitle className="text-center text-red-400 font-bagel text-xl sm:text-2xl">
                                    Invalid Request
                                </CardTitle>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <CardDescription className="text-center text-white/80 text-sm sm:text-base mt-1">
                                    We couldn&apos;t process your unsubscribe
                                    request
                                </CardDescription>
                            </motion.div>
                        </CardHeader>
                        <CardContent className="text-center px-4 sm:px-6">
                            <motion.p
                                className="mb-4 text-white text-base sm:text-lg"
                                variants={itemVariants}
                            >
                                No email address was provided with your request.
                            </motion.p>
                        </CardContent>
                        <CardFooter className="flex justify-center pb-5 sm:pb-6">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div
                                            variants={buttonVariants}
                                            initial="initial"
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            <Button
                                                onClick={() => router.push("/")}
                                                variant="outline"
                                                className="bg-purple-700 hover:bg-purple-800 text-white border-purple-500 font-medium px-5 py-2 h-auto"
                                            >
                                                <Home className="mr-2 h-4 w-4" />
                                                Return to Homepage
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Go back to the main page</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardFooter>
                    </Card>
                </motion.div>
            );
        }

        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
            >
                <Card className="bg-opacity-80 backdrop-blur-sm border-purple-300 border-2 shadow-xl rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent pointer-events-none rounded-xl" />
                    <CardHeader className="pb-3 sm:pb-4">
                        <motion.div
                            className="flex justify-center mb-2 sm:mb-3"
                            variants={iconVariants}
                        >
                            <AnimatePresence mode="wait">
                                {isUnsubscribed ? (
                                    <motion.div
                                        key="check-icon"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: 1,
                                            opacity: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 15,
                                            },
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                    >
                                        <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="mail-icon"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: 1,
                                            opacity: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 15,
                                            },
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                    >
                                        <MailIcon className="h-10 w-10 sm:h-12 sm:w-12 text-purple-300" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-center font-bagel text-xl sm:text-2xl text-white">
                                {isUnsubscribed
                                    ? "Successfully Unsubscribed"
                                    : "Unsubscribe from Mailing List"}
                            </CardTitle>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardDescription className="text-center text-purple-200 text-sm sm:text-base mt-1">
                                {isUnsubscribed
                                    ? "You won't receive any more emails from us"
                                    : "Please confirm your unsubscribe request"}
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="text-center px-4 sm:px-6">
                        <AnimatePresence mode="wait">
                            {isUnsubscribed ? (
                                <motion.div
                                    key="unsubscribed-content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.p
                                        className="mb-4 text-white text-base sm:text-lg"
                                        variants={itemVariants}
                                    >
                                        You have been successfully unsubscribed
                                        from our mailing list.
                                    </motion.p>
                                    <motion.div
                                        className="flex items-center justify-center bg-purple-800/50 rounded-md py-2 px-4 mb-4 sm:mb-6 max-w-[90%] sm:max-w-xs mx-auto"
                                        variants={itemVariants}
                                    >
                                        <MailIcon className="h-4 w-4 mr-2 text-purple-200 flex-shrink-0" />
                                        <p className="text-sm text-purple-200 truncate">
                                            {email}
                                        </p>
                                    </motion.div>
                                    <motion.p
                                        className="text-white/70 text-sm max-w-xs mx-auto"
                                        variants={itemVariants}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        If you change your mind, you can always
                                        sign up again on our website.
                                    </motion.p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="subscribe-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.p
                                        className="mb-4 text-white text-base sm:text-lg"
                                        variants={itemVariants}
                                    >
                                        Are you sure you want to unsubscribe
                                        from our mailing list?
                                    </motion.p>
                                    <motion.div
                                        className="flex items-center justify-center bg-purple-800/50 rounded-md py-2 px-4 mb-4 sm:mb-6 max-w-[90%] sm:max-w-xs mx-auto"
                                        variants={itemVariants}
                                    >
                                        <MailIcon className="h-4 w-4 mr-2 text-purple-200 flex-shrink-0" />
                                        <p className="text-sm text-purple-200 truncate">
                                            {email}
                                        </p>
                                    </motion.div>
                                    <motion.p
                                        className="text-sm text-white/70 mb-4 max-w-xs mx-auto"
                                        variants={itemVariants}
                                    >
                                        You will no longer receive updates about
                                        HackCC events and opportunities.
                                    </motion.p>
                                    {error && (
                                        <motion.div
                                            className="bg-red-500/20 rounded-md py-2 px-3 mb-4 max-w-xs mx-auto"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <motion.p
                                                className="text-sm text-red-200 flex items-center justify-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <AlertTriangle className="h-4 w-4 mr-2 text-red-200" />
                                                {error}
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <CardFooter
                        className={`flex flex-col sm:flex-row ${
                            isUnsubscribed
                                ? "justify-center"
                                : "justify-between gap-3 sm:gap-4"
                        } pb-5 sm:pb-6 px-4 sm:px-6`}
                    >
                        <AnimatePresence mode="wait">
                            {isUnsubscribed ? (
                                <motion.div
                                    key="home-button"
                                    variants={buttonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        onClick={() => router.push("/")}
                                        variant="outline"
                                        className="bg-purple-700 hover:bg-purple-800 text-white border-purple-500 w-full sm:w-auto font-medium px-5 py-2 h-auto"
                                    >
                                        <Home className="mr-2 h-4 w-4" />
                                        Return to Homepage
                                    </Button>
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div
                                        key="cancel-button"
                                        variants={buttonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="w-full sm:w-auto order-2 sm:order-1"
                                    >
                                        <Button
                                            onClick={() => router.push("/")}
                                            variant="secondary"
                                            disabled={isLoading}
                                            className="bg-purple-600/30 hover:bg-purple-700/50 text-white border border-purple-500 w-full sm:w-auto font-medium px-5 py-2 h-auto"
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        key="confirm-button"
                                        variants={buttonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="w-full sm:w-auto order-1 sm:order-2"
                                    >
                                        <Button
                                            onClick={handleUnsubscribe}
                                            disabled={isLoading}
                                            className="bg-purple-700 hover:bg-purple-800 text-white w-full sm:w-auto font-medium px-5 py-2 h-auto"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <motion.div
                                                        animate={{
                                                            rotate: 360,
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                        className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"
                                                    ></motion.div>
                                                    Unsubscribing...
                                                </div>
                                            ) : (
                                                <>
                                                    Confirm Unsubscribe
                                                    <ChevronRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </CardFooter>
                </Card>
            </motion.div>
        );
    };

    return (
        <div className="relative flex text-white min-h-screen w-full overflow-hidden bg-royalpurple">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={BGImage}
                    alt="Background Image"
                    fill
                    style={{ objectFit: "cover" }}
                    quality={100}
                    priority
                    className="opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-royalpurple/30 to-royalpurple/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    variants={floatingElementVariants}
                    animate="animate"
                    className="absolute top-1/4 right-1/4 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-purple-500/10 blur-3xl"
                ></motion.div>
                <motion.div
                    variants={floatingElementVariants}
                    animate="animate"
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-1/3 left-1/3 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-indigo-500/10 blur-3xl"
                ></motion.div>
                <motion.div
                    variants={floatingElementVariants}
                    animate="animate"
                    transition={{ delay: 1 }}
                    className="absolute top-1/3 left-1/4 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-pink-500/10 blur-3xl"
                ></motion.div>

                {/* Additional floating elements for more visual interest */}
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut",
                    }}
                    className="absolute top-2/3 right-1/3 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-blue-500/10 blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        x: [0, 10, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 8,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-1/4 right-1/5 w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-violet-500/10 blur-3xl"
                ></motion.div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col justify-center items-center mx-auto z-10 w-full max-w-md px-4 py-8 sm:py-0">
                {/* Logo */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                    }}
                    className="mb-6 sm:mb-10"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                        }}
                    >
                        <Image
                            className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto drop-shadow-lg"
                            src={Logo}
                            alt="HackCC Logo"
                            onClick={() => router.push("/")}
                            style={{ cursor: "pointer" }}
                            priority
                        />
                    </motion.div>
                </motion.div>

                {/* Card Content */}
                <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.5,
                }}
                className="absolute bottom-4 sm:bottom-5 mx-auto inset-x-0 flex flex-col justify-center items-center z-10"
            >
                <Socials />
                <div className="text-xs sm:text-sm text-white/80 mt-2">
                    <p>© 2025 HackCC</p>
                </div>
            </motion.div>
        </div>
    );
}
