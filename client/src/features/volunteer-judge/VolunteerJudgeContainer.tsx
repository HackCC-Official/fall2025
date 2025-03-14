
import CloudCluster from "../../../public/Purple Cloud Cluster.png"
import Cluster from "../../../public/Purple Cloud Cluster2.png"
import Image from "next/image"
import PinkClusterL from "../../../public/Pink Cloud Cluster2.png"
import PinkClusterR from "../../../public/Pink Cloud Cluster.png"
import PinkPawL from "../../../public/Pink Paw.png"
import PinkPawR from "../../../public/Pink Paw 2.png"

import { ApplyButton } from "@/components/applybutton"
import { Title } from "@/components/title"


export default function VolunteerJudgeContainer() {
    return (
        <div className="z-10 relative order-none bg-bgpurple outline-none w-screen -mt-[5px]" id="involvedTab">
            <Image src={PinkClusterL} alt="clouds" className="top-0 left-0 z-30 absolute w-[500px] pointer-events-none"></Image>
            <Image src={PinkClusterR} alt="clouds" className="top-0 right-0 z-30 absolute w-[1000px] pointer-events-none"></Image>
            <Image src={CloudCluster} alt="clouds" className="-bottom-[150px] z-30 absolute w-[300px] pointer-events-none"></Image>
            <Image src={Cluster} alt="clouds" className="right-0 -bottom-[300px] z-30 absolute w-[1000px] pointer-events-none"></Image>

            <div className="-bottom-[40px] z-20 relative bg-gradient-to-t from-[#9947DC] to-[#8F43D8] w-screen h-auto"></div>
            <div className="flex flex-col w-full h-full">
                <div className="z-50 flex mx-auto mt-[50px] w-[90%] max-w-[1300px]">
                    <div className="flex flex-col items-center mx-auto">
                        <Title text="Get Involved"></Title>
                        <h3 className={`text-[1rem] lg:text-[1.3rem] font-mont text-center text-white mb-10`}>Interest in judging or being a volunteer</h3>
                    </div>
                </div>
                <div className="z-50 flex flex-wrap md:flex-nowrap items-around md:gap-10 mx-auto w-[90%] max-w-[1300px] h-[70%] md:h-[70%]">
                    <div className="flex flex-col justify-center items-center bg-glass backdrop-blur-md mx-auto my-auto mb-5 md:mb-0 rounded-3xl w-[90%] md:w-1/2 h-[375px] lg:h-[425px] text-center relative px-5">
                        <Image src={PinkPawL} alt="paw" className="mb-5 w-[75px] lg:w-[100px] h-auto pointer-events-none"></Image>
                        <h2 className={`font-bagel lg:text-[2rem] text-white`}>Volunteer</h2>
                        <h3 className={`font-mont text-[0.7rem] lg:text-[1rem] text-white h-[40px] max-w-[350px] mx-3`}>Interested in helping at the event? Apply to be a volunteer.</h3>
                        <ApplyButton text="Apply to Volunteer" size="md"></ApplyButton>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-glass backdrop-blur-md mx-auto my-auto rounded-3xl w-[90%] md:w-1/2 h-[375px] lg:h-[425px] text-center relative px-5">
                        <Image src={PinkPawR} alt="paw" className="mb-5 w-[125px] lg:w-[150px] h-auto pointer-events-none"></Image>
                        <h2 className={`font-bagel lg:text-[2rem] text-white`}>Become a Judge</h2>
                        <h3 className={`font-mont text-[0.7rem] lg:text-[1rem]  text-white max-w-[350px] mx-3`}>Help judge event submissions to determine the top projects from the event.</h3>
                        <ApplyButton text="Apply to Judge" size="md"></ApplyButton>
                    </div> 
                </div>
            </div>
            
        </div>
    )
}