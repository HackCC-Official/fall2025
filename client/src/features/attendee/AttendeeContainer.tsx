//flex 2xl:flex-row flex-col 2xl:justify-around items-center bg-gradient-to-t from-blue-500 via-transparent to-red-500 mx-auto  
import Image from "next/image";
import cloud from "../../../public/Dark Purple Cloud Mid.png"
import cloud2 from "../../../public/Dark Purple Cloud Back2.png"
import AttendeeCard from "./ui/AttendeeCard"
export default function AttendeeContainer() {
    return(
        //md:tablet breakpoint
        //lg:desktop/laptop breakpoint
        //initally scaled for mobile->tablet->desktop/laptop
        //IN ORDER FOR CONTAINERS TO WORK! NAME HAS TO BE first_full_name and last initial: example = Gabriel F.
        <div className="relative bg-gradient-to-t from-bgpurple to-richpurple py-20 lg:py-60 w-full h-auto overflow-x-clip">
            <Image src={cloud} className="top-[150px] md:top-[0px] -left-[50px] z-0 absolute w-[250px] sm:w-[300px] md:w-[500px] 2xl:w-[1000px] h-auto animate-swaying ease-linear" alt="cloud " />
            <Image src={cloud2} className="top-[200px] md:top-[100px] -right-[40px] z-0 absolute w-[250px] sm:w-[300px] md:w-[500px] 2xl:w-[1000px] h-auto animate-swaying ease-linear" alt="cloud" />
            <div className="relative mx-auto w-full">
                <h2 className="z-10 m-10 font-bagel text-[1.5rem] text-white lg:text-[3rem] text-center">What past attendees have said</h2>
                <div className="flex md:flex-row flex-col items-center">
                    <AttendeeCard/>
                    <AttendeeCard/>
                </div>
            </div>
        </div>


    );
}
