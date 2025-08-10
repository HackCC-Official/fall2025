import Image from "next/image"
import React from "react"
import { Socials } from "../../../components/socials"
import CatCloudCluster from "../../../../public/Cat Cloud.webp"
import BalloonCat from "../../../../public/Balloon Cat.webp"
import DarkCloud from "../../../../public/Violet Cloud Cluster 3.webp"
import { ApplyButton } from "@/components/applybutton"
import Logo from '../../../../public/Logo.webp'
import FooterBg from '../../../../public/Footer Background.webp'

// TODO-IF-ACTION: Remove padding and make apply button active
//<Image className="" src={BackgroundDarkCloud} alt="Back CLoud"></Image>
export default function Footer() {
    return (
        <div className="relative bg-bgpurple -mt-[5px] w-full overflow-hidden">
            
            <Image sizes="(min-width: 1520px) 100vw, (min-width: 1040px) calc(29.57vw + 1057px), (min-width: 780px) 1281px, 907px" src={FooterBg} className='z-0 absolute w-screen max-w-full object-cover 2xl:object-fill pointer-events-none' alt="bg" fill />
            <div className="flex justify-center mx-auto py-[200px] md:py-[300px]">
                <div className="relative flex">
                <Image sizes="(min-width: 1040px) 288px, (min-width: 780px) 208px, 177px" className="-top-[100px] md:-top-[125px] lg:-top-[125px] -left-32 md:-left-48 z-10 absolute w-48 md:w-52 lg:w-72 h-auto animate-bobbing ease-linear pointer-events-none" src={BalloonCat} alt="cat" />
                    <div className="z-50 flex flex-col items-center py-10 overflow-hidden" >
                        <h2 className={`text-white  text-[3rem] font-bagel  z-10 md:text-[4rem] lg:text-[5rem] xl:text-[6rem]`}>
                            Apply
                        </h2>
                        <h3 className={`text-white text-[0.8rem] font-mont z-10 text-base sm:text-lg md:text-2xl 2xl:text-3xl`}>
                            Application will be live soon!
                        </h3>
                        {/* <ApplyButton text="Apply now" size="lg" directory="/apply"></ApplyButton> */}
                    </div>
                </div>
            </div>
            <div className="bottom-10 absolute flex- w-full">
                <div className="flex justify-around lg:justify-between">
                    <Image sizes="(min-width: 640px) 60px, 40px" src={Logo} alt='logo' className="z-10 lg:ml-20 w-[40px] sm:w-[60px] h-auto pointer-events-none"></Image> 
                    <div className="flex items-center mr-5 lg:mr-20 2xl:mr-60 xl:mr-40">
                        <Socials baseColor="text-white" hoverColor="hover:text-navyblue"/>
                        <p className={`z-10 text-[0.6rem] lg:text-[0.8rem] font-mont`}>© 2025 HackCC</p>
                    </div>
                    
                </div>
                <Image sizes="(min-width: 1540px) 2000px, (min-width: 780px) 1500px, 900px" className="-right-[450px] md:-right-[600px] 2xl:-right-[750px] -bottom-[200px] absolute md:w-[1500px] 2xl:w-[2000px] min-w-[900px] md:min-w-[1500px] 2xl:min-w-[2000px] h-auto animate-swaying ease-linear pointer-events-none" src={CatCloudCluster} alt="Cat Cloud Cluster"></Image>
                <Image sizes="(min-width: 1040px) 700px, (min-width: 780px) 400px, 200px" className="-bottom-20 -left-10 absolute w-[200px] md:w-[400px] lg:w-[700px] h-auto animate-swaying ease-linear pointer-events-none" src={DarkCloud} alt="Mid CLoud"></Image>
            </div>
        </div>
    )
}