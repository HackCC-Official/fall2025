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
        <div className="relative flex text-white w-screen h-screen overflow-hidden">
            <Sky></Sky>
            <Image className="2xl:h-56 md:h-50 sm:h-44 h-40 w-auto absolute 2xl:top-10 2xl:right-20 md:top-12 md:right-8 top-0 right-0"  src={Moon} alt="Moon"></Image>
            <div className="flex flex-col justify-center items-center mx-auto">
                <div className="relative flex">
                    <Image className="2xl:h-56 lg:h-48 md:h-48 sm:h-48 h-40 w-auto ml-[5%] z-10" src={Logo} alt="HackCC Logo"></Image>
                    <Image className="2xl:h-40 md:h-36 sm:h-32 h-28 w-auto absolute 2xl:-right-80 md:-right-40 sm:-right-32 -right-12 bottom-1/4 animate-bobbing ease-linear" src={HotAirBalloon} alt="Hot Air Balloon"></Image>
                </div>
                <div className="font-bagel mt-4 mb-16 text-center md:text-4xl sm:text-3xl text-2xl z-10">
                    <p>May 2-4, 2025 <span className="font-mono font-thin">|</span> California</p>
                </div>
                <Interest></Interest>
            </div>
            <div className="absolute bottom-5 mx-auto inset-x-0 flex flex-col justify-center items-center z-10">
                <Socials></Socials>
                <div className="sm:text-md text-sm text-black mt-2">
                    <p>© 2025 HackCC</p>
                </div>
            </div>
            <Image className="h-auto animate-swaying ease-linear absolute 2xl:w-[2000px] 2xl:min-w-[2000px] md:w-[1500px] md:min-w-[1500px] w-[1000px] min-w-[1000px] 2xl:-right-[750px] 2xl:-bottom-56 md:-right-[600px] md:-bottom-40 -right-[450px] -bottom-36" src={CatCloudCluster} alt="Cat Cloud Cluster"></Image>
            <div className="absolute 2xl:[&>*]:w-[1100px] 2xl:[&>*]:min-w-[1100px]md:[&>*]:w-[800px] md:[&>*]:min-w-[800px] [&>*]:w-[500px] [&>*]:min-w-[500px] [&>*]:h-auto 2xl:-left-32 md:-left-48 -left-60 bottom-[45%]">
                <Image src={CloudBack} alt="Back CLoud"></Image>
                <Image className="2xl:-mt-[400px] md:-mt-[300px] -mt-[170px] ml-[75px]" src={CloudMid} alt="Mid CLoud"></Image>
                <Image className="2xl:-mt-[400px] md:-mt-[300px] -mt-[170px]" src={CloudFront} alt="Front CLoud"></Image>
            </div>
        </div>
    )
}

// animate-swaying