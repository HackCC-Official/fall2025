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
import { Sky } from "./components/sky";

export default function home() {
    return(
        <div className="relative flex bg-[#9947DC] w-screen h-screen overflow- overflow-hidden text-white">
            <Sky></Sky>
            <Image className="top-0 md:top-12 2xl:top-10 right-0 md:right-8 2xl:right-20 absolute w-auto h-40 sm:h-44 md:h-50 2xl:h-56"  src={Moon} alt="Moon"></Image>
            <div className="flex flex-col justify-center items-center mx-auto">
                <div className="relative flex">
                    <Image className="z-10 ml-[5%] w-auto h-40 sm:h-48 md:h-48 lg:h-48 2xl:h-56" src={Logo} alt="HackCC Logo"></Image>
                    <Image className="-right-12 sm:-right-32 md:-right-40 2xl:-right-80 bottom-1/4 absolute w-auto h-28 sm:h-32 md:h-36 2xl:h-40 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
                </div>
                <div className="z-10 mt-4 mb-16 font-bagel text-2xl sm:text-3xl md:text-4xl text-center">
                    <p>May 2-4, 2025 <span className="font-mono font-thin">|</span> California</p>
                </div>
                <Interest></Interest>``
            </div>
            <div className="bottom-5 z-10 absolute inset-x-0 flex flex-col justify-center items-center mx-auto">
                <Socials baseColor="text-white" hoverColor="hover:text-navyblue"></Socials>
                <div className="mt-2 text-black sm:text-md text-sm">
                    <p>© 2025 HackCC</p>
                </div>
            </div>
            <Image className="-right-[450px] md:-right-[600px] 2xl:-right-[750px] bottom-0 md:-bottom-20 2xl:-bottom-50 absolute w-[1000px] md:w-[1500px] 2xl:w-[2000px] min-w-[1000px] md:min-w-[1500px] 2xl:max-w-[1500px] h-auto animate-swaying ease-linear" src={CatCloudCluster} alt="Cat Cloud Cluster"></Image>
            <div className="absolute 2xl:[&>*]:w-[1100px] 2xl:[&>*]:min-w-[1100px]md:[&>*]:w-[800px] md:[&>*]:min-w-[800px] [&>*]:w-[500px] [&>*]:min-w-[500px] [&>*]:h-auto 2xl:-left-32 md:-left-48 -left-60 bottom-[45%]">
                <Image src={CloudBack} alt="Back CLoud"></Image>
                <Image className="-mt-[170px] md:-mt-[300px] 2xl:-mt-[400px] ml-[75px]" src={CloudMid} alt="Mid CLoud"></Image>
                <Image className="-mt-[170px] md:-mt-[300px] 2xl:-mt-[400px]" src={CloudFront} alt="Front CLoud"></Image>
            </div>
        </div>
    )
}

// animate-swaying