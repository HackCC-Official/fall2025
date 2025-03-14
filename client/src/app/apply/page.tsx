"use client";

import Image from "next/image";
import skybg from '../../../public/BG Image.png'
import { SkyFixed } from "@/components/sky";
import { FormCard } from "@/features/application/components/form-card";
import { Logo } from "@/components/logo";



export default function ApplyPage() {
    
    return (
        <div className="relative w-screen h-screen overflow-x-hidden">
            <SkyFixed />
            <div className="flex flex-col justify-center items-center mx-auto mt-24 text-white">
                <div className="relative flex">
                    <Logo />
                </div>
                <div className="z-10 flex sm:flex-row flex-col mt-4 mb-16 font-bagel text-2xl sm:text-3xl md:text-4xl text-center">
                    <p>2025 Application</p>
                </div>
            </div>
            <FormCard className="p-16 font-mont">
                <h1 className="font-bagel text-[2rem] text-center">Thank you for Applying!</h1>
                <p className="mt-2 px-20 font-semibold text-muted-foreground text-sm text-center">
                    Please tell us a little about you, your team and the project you have in mind to work on. Our team will collect applications from March 10 - April 22, 2025.
                </p>
                <p className="mt-4 text-sm text-center italic">
                    All Fields Required
                </p>
            </FormCard>
        </div>
    );
}
