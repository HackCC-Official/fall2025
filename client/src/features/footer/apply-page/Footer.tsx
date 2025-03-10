import Image from "next/image"
import React from "react"
import { Socials } from "../../../components/socials"
import { bagel_Fat_One, montserrat_Alternates } from "../../../app/styles/fonts"



export default function Footer() {
    return (
        <div className="relative bg-blue-500 bg-richpurple w-full h-screen">
            <Image src={"/BG Image.png"} className='z-0 absolute w-screen max-w-full h-screen object-cover' alt="bg" fill/>
            <div className="flex justify-center bg-red-400 mx-auto mt-[100px]">
                <div className="flex flex-col items-center overflow-hidden" >
                    <h2 className={`text-white  text-[3rem] ${bagel_Fat_One.className}  z-10 md:text-[4rem] lg:text-[5rem] xl:text-[6rem]`}>Apply</h2>
                    <h3 className={`text-white text-[0.8rem] ${montserrat_Alternates.className} z-10 md:text-[1rem] lg:text-[1.4rem] xl:text-[1.6rem]`}>Apply to register as a participant</h3>
                    <button className={`${montserrat_Alternates.className} py-2 px-4 md:px-10 md:py-3 lg:py-4 lg:px-14 z-10 rounded-[30px] font-extrabold text-hoverpurple active:bg-black text-[0.6rem] md:text-[0.8rem] lg:text-[1.2rem] xl:text-[1.3rem] bg-vibrantyellow mt-8`}>Apply now</button>
                </div>
            </div>
            <div className="bottom-10 absolute w-full">
                <div className="flex justify-around lg:justify-between">
                    <Image src={"/logo.png"} width={68} height={48} alt='logo' className="lg:ml-20 w-[40px] sm:w-[60px] h-auto"></Image> 
                    <div className="flex items-center mr-5 lg:mr-20 xl:mr-40 2xl:mr-60">
                        <Socials baseColor="text-white" hoverColor="hover:text-navyblue"/>
                        <p className={`text-[0.6rem] lg:text-[0.8rem] ${montserrat_Alternates.className}`}>© 2025 HackCC</p>
                    </div>
                </div>
            </div>
        </div>
    )
}