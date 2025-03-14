//flex 2xl:flex-row flex-col 2xl:justify-around items-center bg-gradient-to-t from-blue-500 via-transparent to-red-500 mx-auto  
import Image from "next/image";
import cloud from "../../../public/Dark Purple Cloud Mid.png"
import cloud2 from "../../../public/Dark Purple Cloud Back2.png"
import pinkcloud1 from "../../../public/leftmapcloud.png"
import pinkcloud2 from "../../../public/Purple Cloud Cluster.png"
import pinkcloud3 from "../../../public/rightmapcloud.png"
import AttendeeCard from "./ui/AttendeeCard"
import { Title } from "@/components/title";
import minh from "../../../public/minh.jpg"
import ethan from "../../../public/ethan.png"
import placeholder from "../../../public/headshotPlaceholder.png"


export default function AttendeeContainer() {
    return(
        //md:tablet breakpoint
        //lg:desktop/laptop breakpoint
        //initally scaled for mobile->tablet->desktop/laptop
        //IN ORDER FOR CONTAINERS TO WORK! NAME HAS TO BE first_full_name and last initial: example = Gabriel F.
        <div className="relative bg-gradient-to-t from-bgpurple to-richpurple py-20 lg:py-60 w-full h-auto overflow-x-clip pointer-events-none">
            <Image src={cloud} className="top-[150px] md:top-[0px] -left-[50px] z-0 absolute w-[250px] sm:w-[300px] md:w-[500px] 2xl:w-[1000px] h-auto pointer-events-none" alt="cloud " />
            <Image src={cloud2} className="top-[200px] md:top-[100px] -right-[40px] z-0 absolute w-[250px] sm:w-[300px] md:w-[500px] 2xl:w-[1000px] h-auto" alt="cloud" />
            <Image src={pinkcloud1} className="-bottom-[35px] md:-bottom-[40px] 2xl:-bottom-[50px] -left-10 z-40 absolute w-[200px] sm:w-[250px] md:w-[300px] 2xl:w-[350px] h-auto pointer-events-none" alt="cloud"></Image>
            <Image src={pinkcloud2} className="-bottom-[50px] -left-10 z-0 absolute w-[150px] sm:w-[200px] md:w-[250px] 2xl:w-[300px] h-auto pointer-events-none" alt="cloud"></Image>
            <Image src={pinkcloud3} className="-right-10 -bottom-[60px] md:-bottom-[75px] 2xl:-bottom-[115px] z-40 absolute w-[200px] sm:w-[250px] md:w-[300px] 2xl:w-[450px] h-auto animate-swaying ease-linear pointer-events-none" alt="cloud"></Image>
            <div className="relative mx-auto w-full max-w-[1200px] text-center">
                <Title text="What past attendees have said"></Title>
                <div className="flex md:flex-row flex-col justify-center items-center text-left">
                    <AttendeeCard name="Minh Truong" text="As a hackathon specifically centered around community college students, I thought it was awesome to see so many students who were just like me. Everyone came up with different and unique ideas and mentors cared about making sure we felt confident and engaged." imgPath={minh}/>
                    <AttendeeCard name="Ethan Bonavida" text="I was a mentor, and later a judge. It was an awesome venue, had a great presentation and speakers to introduce the hackathon. It was such an honor to help out and share my knowledge with others so they could choose an idea" imgPath={ethan}/>
                </div>
            </div>
        </div>


    );
}
