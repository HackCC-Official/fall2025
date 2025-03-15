import Image from "next/image";
import Logo from "../../../public/Logo.svg"
import HotAirBalloon from "../../../public/Hot Air Balloon.png"
import CatCloudCluster from "../../../public/Cat Cloud Cluster.png"
import CloudBack from "../../../public/Dark Purple Cloud Back.png"
import CloudMid from "../../../public/Dark Purple Cloud Mid.png"
import CloudFront from "../../../public/Medium Purple Cloud.png"
import Moon from "../../../public/Moon.png"
import { Socials } from '../../components/socials'
import { Interest } from "./components/interest";
import { Homebg } from "./components/homebg";
import { ApplyButton } from "@/components/applybutton";

export default function home() {
    return(
        <div className="relative flex bg-bgpurple w-screen h-screen overflow-x-clip text-white">
            <Homebg></Homebg>
            <div className="flex flex-col justify-center items-center mx-auto">
                <div className="relative flex">
                    <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
                    <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 z-10 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
                </div>
                <div className="z-10 flex sm:flex-row flex-col mt-4 mb-10 sm:mb-16 font-bagel text-2xl sm:text-3xl md:text-4xl text-center">
                    <p>May 2-4, 2025 </p> <span className="hidden sm:inline font-mono font-thin">|</span> <p> TBD, California</p>
                </div>
                <Interest></Interest>
                {/* <ApplyButton text="Apply to Attend" size="xl" directory="/apply"></ApplyButton> */}
            </div>
        </div>
    )
}

// animate-swaying
