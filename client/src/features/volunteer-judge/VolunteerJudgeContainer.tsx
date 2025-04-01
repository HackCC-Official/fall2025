
import CloudCluster from "../../../public/Purple Cloud Cluster 3.webp"
import Cluster from "../../../public/Violet Cloud Cluster Opaque 2.webp"
import Image from "next/image"
import PinkClusterL from "../../../public/Pink Cloud Cluster 3.webp"
import PinkClusterR from "../../../public/Pink Cloud Cluster 2.webp"
import PinkPawL from "../../../public/Pink Paw.webp"
import PinkPawR from "../../../public/Pink Paw 2.webp"

import { ApplyButton } from "@/components/applybutton"
import { Title } from "@/components/title"


export default function VolunteerJudgeContainer() {
    return (
        <div className="z-10 relative order-none bg-bgpurple -mt-[5px] outline-none w-screen overflow-x-clip" id="involvedTab" >
            <Image src={PinkClusterL} alt="clouds" className="top-0 left-0 z-30 absolute w-[500px] pointer-events-none" sizes="(min-width: 540px) 500px, calc(90.91vw + 27px)"></Image>
            <Image src={PinkClusterR} alt="clouds" className="top-0 right-0 z-30 absolute w-[1000px] pointer-events-none" sizes="(min-width: 1060px) 1000px, calc(94.59vw + 16px)"></Image>
            <Image src={CloudCluster} alt="clouds" className="-bottom-[150px] z-30 absolute w-[300px] pointer-events-none" sizes="300px"></Image>
            <Image src={Cluster} alt="clouds" className="right-0 -bottom-[300px] z-30 absolute w-[1000px] pointer-events-none" sizes="(min-width: 1060px) 1000px, calc(94.59vw + 16px)"></Image>

            <div className="-bottom-[40px] z-20 relative bg-gradient-to-t from-[#9947DC] to-[#8F43D8] w-screen h-auto"></div>
            <div className="flex flex-col w-full h-full">
                <div className="z-50 flex mx-auto mt-[50px] w-[90%] max-w-[1300px]">
                    <div className="flex flex-col items-center mx-auto">
                        <Title text="Get Involved"></Title>
                        <h3 className={`text-base sm:text-lg md:text-2xl 2xl:text-3xl font-mont text-center text-white mb-10`}>Interested in judging or being a volunteer?</h3>
                    </div>
                </div>
                <div className="z-50 flex flex-wrap md:flex-nowrap items-around md:gap-10 mx-auto w-[90%] max-w-[1300px] h-[70%] md:h-[70%]">
                    <div className="relative flex flex-col justify-center items-center bg-glass backdrop-blur-md mx-auto my-auto mb-5 md:mb-0 px-5 rounded-3xl w-[90%] md:w-1/2 h-[375px] lg:h-[425px] text-center">
                        <Image src={PinkPawL} alt="paw" className="mb-5 w-[75px] lg:w-[100px] h-auto pointer-events-none" sizes="(min-width: 1040px) 100px, 75px"></Image>
                        <h2 className={`font-bagel text-base sm:text-lg md:text-2xl 2xl:text-3xl text-white`}>Volunteer</h2>
                        <h3 className={`font-mont text-xs md:text-base 2xl:text-lg text-white h-[40px] max-w-[350px] mx-3`}>Interested in helping at the event? Apply to be a volunteer.</h3>
                        <ApplyButton bypassDisable={true} text="Apply to Volunteer" size="md" directory="https://docs.google.com/forms/d/e/1FAIpQLSfVPJ9yAWarPM9YUZgHZVaTuuAR9f_CIdX70BoYFrGyTY_Eww/viewform"></ApplyButton>
                    </div>
                    <div className="relative flex flex-col justify-center items-center bg-glass backdrop-blur-md mx-auto my-auto px-5 rounded-3xl w-[90%] md:w-1/2 h-[375px] lg:h-[425px] text-center">
                        <Image src={PinkPawR} alt="paw" className="mb-5 w-[125px] lg:w-[150px] h-auto pointer-events-none" sizes="(min-width: 1040px) 150px, 125px"></Image>
                        <h2 className={`font-bagel text-base sm:text-lg md:text-2xl 2xl:text-3xl text-white`}>Become a Judge</h2>
                        <h3 className={`font-mont text-xs md:text-base 2xl:text-lg text-white max-w-[350px] mx-3`}>Help judge event submissions to determine the top projects from the event.</h3>
                        <ApplyButton bypassDisable={true} text="Apply to Judge" size="md" directory="https://docs.google.com/forms/d/e/1FAIpQLSdo0f6ERPg8PA1vvURXaiJAiZJbBFH24_ugQz5n4Kn1MmIBsA/viewform"></ApplyButton>
                    </div> 
                </div>
            </div>
            
        </div>
    )
}