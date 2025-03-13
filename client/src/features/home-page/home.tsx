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

export default function home() {
    return(
        <div className="relative flex text-white w-screen h-screen overflow-hidden">
            <Homebg></Homebg>
            <div className="flex flex-col justify-center items-center mx-auto">
                <div className="relative flex">
                    <Image className="2xl:h-56 lg:h-48 md:h-48 sm:h-48 h-40 w-auto ml-[5%] z-10" src={Logo} alt="HackCC Logo"></Image>
                    <Image className="2xl:h-40 md:h-36 sm:h-32 h-28 w-auto absolute 2xl:-right-80 md:-right-40 sm:-right-32 -right-12 bottom-1/4 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
                </div>
                <div className="font-bagel mt-4 mb-16 text-center md:text-4xl sm:text-3xl text-2xl z-10">
                    <p>April 25-27, 2025 <span className="font-mono font-thin">|</span> California</p>
                </div>
                <Interest></Interest>
            </div>
            <div className="absolute bottom-5 mx-auto inset-x-0 flex flex-col justify-center items-center z-10">
                <Socials></Socials>
                <div className="sm:text-md text-sm text-black mt-2">
                    <p>© 2025 HackCC</p>
                </div>
            </div>
        </div>
    )
}

// animate-swaying
