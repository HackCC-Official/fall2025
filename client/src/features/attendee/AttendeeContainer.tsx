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
        <div className="relative bg-deepsky py-20 2xl:py-60 w-full h-auto">
            <Image src={cloud} className="top-[150px] absolute w-[200px] h-auto" alt="cloud" />
            <Image src={cloud2} className="top-[200px] right-0 absolute w-[200px] h-auto" alt="cloud" />
            <div className="mx-auto w-full">
                <div className="flex md:flex-row flex-col items-center">
                    <AttendeeCard/>
                    <AttendeeCard/>
                </div>
            </div>
        </div>


    );
}
