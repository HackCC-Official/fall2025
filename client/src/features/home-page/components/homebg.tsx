import React from 'react'
import Image from "next/image";
import HotAirBalloon from "../../../../public/Hot Air Balloon.png"
import CatCloudCluster from "../../../../public/Cat Cloud Cluster.png"
import CloudBack from "../../../../public/Dark Purple Cloud Back.png"
import CloudMid from "../../../../public/Dark Purple Cloud Mid.png"
import CloudFront from "../../../../public/Medium Purple Cloud.png"
import Moon from "../../../../public/Moon.png"
import { Sky } from '@/components/sky';

export const Homebg = () => {
    return (
        <div>
            <Sky></Sky>
            <Image className="2xl:h-56 md:h-50 sm:h-44 h-40 w-auto absolute 2xl:top-10 2xl:right-20 md:top-12 md:right-8 top-0 right-0"  src={Moon} alt="Moon"></Image>
            <Image className="h-auto animate-swaying ease-linear absolute 2xl:w-[2000px] 2xl:min-w-[2000px] md:w-[1500px] md:min-w-[1500px] w-[1000px] min-w-[1000px] 2xl:-right-[750px] 2xl:-bottom-56 md:-right-[600px] md:-bottom-40 -right-[450px] -bottom-36" src={CatCloudCluster} alt="Cat Cloud Cluster"></Image>
            <div className="absolute 2xl:[&>*]:w-[1100px] 2xl:[&>*]:min-w-[1100px]md:[&>*]:w-[800px] md:[&>*]:min-w-[800px] [&>*]:w-[500px] [&>*]:min-w-[500px] [&>*]:h-auto 2xl:-left-32 md:-left-48 -left-60 bottom-[45%]">
                <Image src={CloudBack} alt="Back CLoud"></Image>
                <Image className="2xl:-mt-[400px] md:-mt-[300px] -mt-[170px] ml-[75px]" src={CloudMid} alt="Mid CLoud"></Image>
                <Image className="2xl:-mt-[400px] md:-mt-[300px] -mt-[170px]" src={CloudFront} alt="Front CLoud"></Image>
            </div>
        </div>
    )
}
