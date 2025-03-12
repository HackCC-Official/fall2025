
import CloudCluster from "../../../public/Purple Cloud Cluster.png"
import Cluster from "../../../public/Purple Cloud Cluster2.png"
import Image from "next/image"
import PinkClusterL from "../../../public/Pink Cloud Cluster2.png"
import PinkClusterR from "../../../public/Pink Cloud Cluster.png"
import PinkPawL from "../../../public/Pink Paw.png"
import PinkPawR from "../../../public/Pink Paw 2.png"


import { bagel_Fat_One, montserrat_Alternates } from "@/app/styles/fonts"


export default function VolunteerJudgeContainer() {
    return (

        <div className="z-10 relative order-none bg-[#8F43D8] outline-none w-screen h-screen">
            <Image src={PinkClusterL} alt="clouds" className="top-0 left-0 z-30 absolute w-[500px] pointer-events-none"></Image>
            <Image src={PinkClusterR} alt="clouds" className="top-0 right-0 z-30 absolute w-[1000px] pointer-events-none"></Image>
            <Image src={CloudCluster} alt="clouds" className="-bottom-[150px] z-30 absolute w-[300px] pointer-events-none"></Image>
            <Image src={Cluster} alt="clouds" className="right-0 -bottom-[300px] z-30 absolute w-[1000px] pointer-events-none"></Image>

            <div className="-bottom-[40px] z-20 relative bg-gradient-to-t from-[#9947DC] to-[#8F43D8] outline-none w-screen h-screen"></div>
            <div className="top-0 z-50 absolute w-full h-full">
                <div className="flex mx-auto mt-[50px] w-[90%] max-w-[1300px]">
                    <div className="flex flex-col items-center mx-auto">
                        <h2 className={`text-[1.5rem] lg:text-[3rem] ${bagel_Fat_One.className} text-white mb-4`}>Get Involved</h2>
                        <h3 className={`text-[1rem] lg:text-[1.3rem] ${montserrat_Alternates.className} text-center text-white mb-10`}>Interest in judging or being a volunteer</h3>
                    </div>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-around md:gap-10 mx-auto w-[90%] max-w-[1300px] h-[70%] md:h-[70%]">
                    <div className="flex flex-col justify-center items-center bg-glass backdrop-blur-md mx-auto my-auto rounded-[20px] w-[90%] md:w-[50%] h-[375px] lg:h-[425px] text-center">
                        <Image src={PinkPawL} alt="paw" className="mb-5 w-[75px] lg:w-[100px] h-auto pointer-events-none"></Image>
                        <h2 className={`${bagel_Fat_One.className} lg:text-[2rem] text-white`}>Volunteer</h2>
                        <h3 className={`${montserrat_Alternates.className} text-[0.7rem] lg:text-[1rem] text-white`}>Interested in helping at the event? Apply to be a volunteer<br/>and help ensure the event day runs smoothly.</h3>
                        <button className={`${montserrat_Alternates.className} py-3 px-6 md:px-10  lg:py-2 lg:px-10 z-10 rounded-[30px] font-extrabold text-hoverpurple active:bg-black text-[0.6rem] md:text-[0.8rem] lg:text-[1.2rem] xl:text-[1rem] bg-vibrantyellow mt-8`}>Apply now</button>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-glass backdrop-blur-md mx-auto my-auto rounded-[20px] w-[90%] md:w-[50%] h-[375px] lg:h-[425px] text-center">
                        <Image src={PinkPawR} alt="paw" className="mb-5 w-[125px] lg:w-[150px] h-auto pointer-events-none"></Image>
                        <h2 className={`${bagel_Fat_One.className} lg:text-[2rem] text-white`}>Become a Judge</h2>
                        <h3 className={`${montserrat_Alternates.className} text-[0.7rem] lg:text-[1rem]  text-white`}>Help judge event submissions to determine<br/>the top projects from the event.</h3>
                        <button className={`${montserrat_Alternates.className} py-3 px-6 md:px-10  lg:py-2 lg:px-10 z-10 rounded-[30px] font-extrabold text-hoverpurple active:bg-black text-[0.6rem] md:text-[0.8rem] lg:text-[1.2rem] xl:text-[1rem] bg-vibrantyellow mt-8`}>Apply now</button>
                    </div> 
                </div>
            </div>
            
        </div>




    )
}