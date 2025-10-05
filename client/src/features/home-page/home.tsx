import Image from "next/image";
import Logo from "../../../public/Logo.webp"
import HotAirBalloon from "../../../public/Hot Air Balloon.webp"
import { Homebg } from "./components/homebg";
import { ApplyButton } from "@/components/applybutton";
import { FrontPagePrimaryLayout } from "@/layouts/front-page-layout";
import PinkPawL from "../../../public/Pink Paw.webp"
import PinkPawR from "../../../public/Pink Paw 2.webp"
import { Interest } from "./components/interest";

// TODO-IF-ACTION: make apply button active
export default function Home() {
    return(
        <FrontPagePrimaryLayout className="flex bg-bgpurple overflow-x-clip text-white">
            <div className="flex flex-col justify-center items-center mx-auto">
                <div className="relative flex">
                    <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo " priority sizes="(min-width: 1540px) 290px, (min-width: 640px) 249px, 207px"></Image>
                    <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 z-10 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon" sizes="(min-width: 1540px) 116px, (min-width: 780px) 104px, (min-width: 640px) 93px, 81px" priority></Image>
                </div>
                <div className="z-10 flex flex-col mt-4 mb-8 text-center">
                    <p className="font-bagel text-2xl sm:text-3xl md:text-4xl">November 8th - 9th, 2025 </p> 
                    <p className="mt-2 font- font-mont text-base sm:text-lg md:text-xl text-right"> Miracosta, California</p>
                </div>
                <Interest></Interest>
                {/* <ApplyButton text="Apply to Attend" size="xl" directory="/apply"></ApplyButton> */}
            </div>
        </FrontPagePrimaryLayout>
    )
}

// animate-swaying
