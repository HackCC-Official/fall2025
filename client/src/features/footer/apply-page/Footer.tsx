import Image from "next/image"
import React from "react"
import { Socials } from "../../../components/socials"
import { bagel_Fat_One, montserrat_Alternates } from "../../../app/styles/fonts"
import CatCloudCluster from "../../../../public/Cat Cloud Cluster.png"

import BalloonCat from "../../../../public/Baloon Cat 4.png"
import DarkCloud from "../../../../public/DarkCloudGroup.png"

//<Image className="" src={BackgroundDarkCloud} alt="Back CLoud"></Image>
export default function Footer() {
    return (
        <div className="relative bg-blue-500 bg-richpurple w-full h-screen overflow-hidden">
            
            <Image src={"/footerbg.png"} className='z-0 absolute w-screen max-w-full h-screen object-cover' alt="bg" fill/>
            
            <div className="flex justify-center bg-red-400 mx-auto mt-[100px]">
                <div className="relative">
                <Image className="-top-[100px] md:-top-[125px] lg:-top-[125px] -left-[75px] md:-left-[125px] z-10 absolute w-[150px] md:w-[200px] lg:w-[225px] h-auto animate-bobbing ease-linear" src={BalloonCat} alt="cat" />
                    <div className="flex flex-col items-center overflow-hidden" >
                        <h2 className={`text-white  text-[3rem] ${bagel_Fat_One.className}  z-10 md:text-[4rem] lg:text-[5rem] xl:text-[6rem]`}>Apply</h2>
                        <h3 className={`text-white text-[0.8rem] ${montserrat_Alternates.className} z-10 md:text-[1rem] lg:text-[1.4rem] xl:text-[1.6rem]`}>Apply to register as a participant</h3>
                        <button className={`${montserrat_Alternates.className} py-3 px-6 md:px-10  lg:py-4 lg:px-14 z-10 rounded-[30px] font-extrabold text-hoverpurple active:bg-black text-[0.6rem] md:text-[0.8rem] lg:text-[1.2rem] xl:text-[1.3rem] bg-vibrantyellow mt-8`}>Apply now</button>
                    </div>
                </div>
            </div>
            <div className="bottom-10 absolute w-full">
                <div className="flex justify-around lg:justify-between">
                    <Image src={"/logo.png"} width={68} height={48} alt='logo' className="z-10 lg:ml-20 w-[40px] sm:w-[60px] h-auto"></Image> 
                    <div className="flex items-center mr-5 lg:mr-20 xl:mr-40 2xl:mr-60">
                        <Socials baseColor="text-white" hoverColor="hover:text-navyblue"/>
                        <p className={`z-10 text-[0.6rem] lg:text-[0.8rem] ${montserrat_Alternates.className}`}>© 2025 HackCC</p>
                    </div>
                    
                </div>
                <Image className="-right-[450px] md:-right-[600px] 2xl:-right-[750px] -bottom-[200px] absolute md:w-[1500px] 2xl:w-[2000px] min-w-[900px] 2xl:min-w-[2000px] md:min-w-[1500px] h-auto animate-swaying ease-linear" src={CatCloudCluster} alt="Cat Cloud Cluster"></Image>
                <Image className="-bottom-20 -left-10 absolute w-[200px] md:w-[400px] lg:w-[700px] h-auto animate-swaying ease-linear" src={DarkCloud} alt="Mid CLoud"></Image>
                
                
                
            </div>
        </div>
    )
}