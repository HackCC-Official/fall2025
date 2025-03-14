//flex 2xl:flex-row flex-col 2xl:justify-around items-center bg-gradient-to-t from-blue-500 via-transparent to-red-500 mx-auto  
import Image from "next/image";
import cloud from "../../../public/Dark Purple Cloud Mid.png"
import cloud2 from "../../../public/Dark Purple Cloud Back2.png"
import AttendeeCard from "./ui/AttendeeCard"
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
            <Image src={cloud} className="top-[150px] md:top-[0px] -left-[50px] z-0 absolute w-[250px] sm:w-[300px] md:w-[500px] 2xl:w-[1000px] h-auto animate-swaying ease-linear pointer-events-none" alt="cloud " />
            <Image src={cloud2} className="top-[200px] md:top-[100px] -right-[40px] z-0 absolute w-[250px] sm:w-[300px] md:w-[500px] 2xl:w-[1000px] h-auto animate-swaying ease-linear" alt="cloud" />
            <div className="relative mx-auto w-full">
                <h2 className="z-10 m-10 font-bagel text-[1.5rem] text-white lg:text-[3rem] text-center">What past attendees have said</h2>
                <div className="flex md:flex-row flex-col items-center">
                    <AttendeeCard name="Minh Truong" text="As a hackathon specifically centered around community college students, I thought it was awesome to see so many students who were just like me. Everyone came up with different and unique ideas and mentors cared about making sure we felt confident and engaged." imgPath={minh}/>
                    <AttendeeCard name="Ethan Bonavida" text="I was a mentor, and later a judge. It was an awesome venue, had a great presentation and speakers to introduce the hackathon. It was such an honor to help out and share my knowledge with others so they could choose an idea" imgPath={ethan}/>
                </div>
            </div>
        </div>


    );
}
