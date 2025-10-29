"use client";

import Nav from "../../components/sponsor/nav";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { submitSponsorInquiry } from "@/features/outreach/api/outreach";
import { SponsorInquiryResponseDto } from "@/features/outreach/types/sponsor.dto";
import { FrontPageSecondaryLayout } from "@/layouts/front-page-layout";
import { DarkCard } from "@/components/dark-card";
import { AuthInput } from "@/features/auth/components/auth-input";
import { Logo } from "@/components/logo";

const formSchema = z.object({
    fname: z
        .string()
        .min(2, {
            message: "Name must be at least between 2 - 50 characters.",
        })
        .max(50),
    company: z
        .string()
        .min(1, {
            message: "Company Name must be between 1 - 50 characters",
        })
        .max(50),
    email: z
        .string()
        .min(2, {
            message: "Must be a valid email",
        })
        .max(50),
    inquiry: z
        .string()
        .min(2, {
            message: "Inquiry muist be between 50 - 400 characters",
        })
        .max(400),
});

export default function SponsorPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fname: "",
            company: "",
            email: "",
            inquiry: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [response, setResponse] = useState<SponsorInquiryResponseDto | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            setError(null);

            const result = await submitSponsorInquiry({
                fullName: values.fname,
                company: values.company,
                email: values.email,
                inquiry: values.inquiry,
            });

            setResponse(result);
            form.reset();
        } catch (err) {
            setError("Failed to submit inquiry. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }
    const text =
        "HackCC wouldn't be possible without the support of our incredible sponsors. As the first hackathon created by and for California Community College students, we're dedicated to fostering innovation, accessibility, and career opportunities for aspiring developers. With your support, we can empower the next generation of tech talent and scale innovation like never before!";

    return (
        <main>
            <FrontPageSecondaryLayout> 
                <Nav></Nav>
                <div className="py-20 pb-30 lg:pb-30">
                    <div className="place-content-center grid">
                        <Logo className="lg:h-24 2xl:h-36" />
                    </div>
                    {/* Fixed container with proper flex setup */}
                    <div className="flex lg:flex-row flex-col items-stretch gap-y-8 lg:gap-x-10 lg:gap-y-0 mx-auto mt-8 md:px-20 lg:px-0 w-[90%] lg:w-[80%] min-w-[200px] max-w-[1600px]">
                        {/* First card - removed h-full, added flex-1   */}
                        <DarkCard className="flex flex-col flex-1 w-full sm:w-full md:w-full lg:w-full lg:basis-1/2">
                            <div className="flex-1 font-mont text-black">
                                <h1 className="mb-6 font-bagel text-[#9947DC] text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl">
                                    Sponsor Us
                                </h1>
                                <h2 className="mt-6 font-semibold text-white text-base sm:text-base md:text-base 2xl:text-lg">
                                    Hey there!
                                </h2>
                                <p className="my-2 text-white text-xs md:text-sm 2xl:text-lg">
                                    {text}
                                </p>
                                <h1 className="mt-6 font-semibold text-white text-base sm:text-base md:text-base 2xl:text-lg">
                                    As a sponsor, you&apos;ll be able to:
                                </h1>
                                <ul className="my-2 pl-6 text-white text-xs md:text-sm 2xl:text-lg text-start list-disc">
                                    <li>
                                        Support ambitious students from underserved
                                        backgrounds with career-defining opportunities
                                    </li>
                                    <li>
                                        Introduce your product, platform, or API to a
                                        diverse group of student developers
                                    </li>
                                    <li>
                                        Increase your brand&apos;s visibility through
                                        HackCC&apos;s marketing and social medias
                                    </li>
                                </ul>
                                <p className="mt-6 font-semibold text-white text-xs sm:text-sm md:text-sm 2xl:text-lg">
                                    Interested in sponsoring? Fill out this contact
                                    form, and our team will be in touch with more
                                    details!
                                </p>
                            </div>
                        </DarkCard>
                        
                        {/* Second card - removed h-full, added flex-1 */}
                        <DarkCard className="flex flex-col flex-1 w-full sm:w-full md:w-full lg:w-full text-white lg:basis-1/2">
                            <Form {...form}>
                                <div className="flex flex-col flex-1">
                                    <h2 className="font-bagel text-[#9947DC] text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl">Sponsorship Form</h2>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="flex flex-col flex-1 space-y-4 md:space-y-8 mt-2 2xl:mt-6 md:px-12 w-full text-left"
                                    >
                                        <div className="gap-4 grid grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="fname"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs 2xl:text-base">
                                                            Full Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <AuthInput 
                                                                className="font-mont text-left"
                                                                placeholder=""
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="company"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs 2xl:text-base">
                                                            Company
                                                        </FormLabel>
                                                        <FormControl>
                                                            <AuthInput 
                                                                className="font-mont text-left"
                                                                placeholder=""
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs 2xl:text-base">
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <AuthInput 
                                                            type='email'
                                                            className="font-mont text-left"
                                                            placeholder=""
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="inquiry"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col flex-1">
                                                    <FormLabel className="text-xs 2xl:text-base">
                                                        Inquiry
                                                    </FormLabel>
                                                    <FormControl className="flex-1">
                                                        <Textarea
                                                            {...field}
                                                            rows={4}
                                                            className="flex-1 bg-white sm:mr-3 md:mr-5 mb-3 sm:mb-0 px-4 py-2 rounded-md w-full font-mont text-black text-lg resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="place-content-center grid mt-auto">
                                            <Button
                                            type="submit"
                                            className="bg-hoverpurple mt-4 px-9 py-6 rounded-3xl font-bold text-white text-base tracking-widest"
                                            disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Submitting..." : "Submit"}
                                            </Button>
                                        </div>

                                        {response && (
                                            <div className="bg-green-100 mt-4 p-4 rounded-md text-green-800">
                                                {response.message}
                                            </div>
                                        )}

                                        {error && (
                                            <div className="bg-red-100 mt-4 p-4 rounded-md text-red-800">
                                                {error}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </Form>
                        </DarkCard>
                    </div>
                </div>
            </FrontPageSecondaryLayout>
        </main>
    );
}