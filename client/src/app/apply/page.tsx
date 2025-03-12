"use client";

import Image from "next/image";
import Logo from "../../../public/Logo.svg"
import skybg from '../../../public/BG Image.png'



export default function ApplyPage() {
    
    return (
        <div className="relative w-screen h-screen overflow-x-hidden">
            <div>
                <Image className='fixed max-w-full w-screen h-screen t-0 object-cover -z-10' src={skybg} alt='Sky Background'></Image>
            </div>
            <div className="flex flex-col justify-center items-center mx-auto mt-24 text-white">
            <div className="relative flex">
                    <Image className="2xl:h-56 lg:h-48 md:h-48 sm:h-48 h-40 w-auto ml-[5%] z-10" src={Logo} alt="HackCC Logo"></Image>
                </div>
                <div className="font-bagel mt-4 mb-16 text-center md:text-4xl sm:text-3xl text-2xl z-10 flex sm:flex-row flex-col">
                    <p>2025 Application</p>
                </div>
            </div>
            <div className="bg-white w-[1100px] max-w-[90%] h-[3000px] mx-auto mb-24 rounded-3xl">
                {/* FORM GOES HERE */}
            </div>
        </div>
    );
}
