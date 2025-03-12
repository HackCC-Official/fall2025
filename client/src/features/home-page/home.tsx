import Image from "next/image";
import Logo from "../../../public/Logo.svg"
import HotAirBalloon from "../../../public/Hot Air Balloon.png"
import { Socials } from '../../components/socials'
import { Interest } from "./components/interest";
import { Homebg } from "./components/homebg";

export default function home() {
    return(
        <div className="relative flex text-white w-screen h-screen overflow-hidden">
            <Homebg></Homebg>
            <div className="flex flex-col justify-center items-center mx-auto">
                <div className="relative flex">
                    <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
                    <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
                </div>
                <div className="font-bagel mt-4 mb-16 text-center md:text-4xl sm:text-3xl text-2xl z-10 flex sm:flex-row flex-col">
                    <p>April 25-27, 2025 </p> <span className="font-mono font-thin sm:inline hidden">|</span> <p> Los Altos Hills, CA</p>
                </div>
                <Interest></Interest>``
            </div>
            <div className="bottom-5 z-10 absolute inset-x-0 flex flex-col justify-center items-center mx-auto">
                <Socials baseColor="text-white" hoverColor="hover:text-navyblue"></Socials>
                <div className="mt-2 text-black sm:text-md text-sm">
                    <p>© 2025 HackCC</p>
                </div>
            </div>
        </div>
    )
}

// animate-swaying