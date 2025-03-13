//flex 2xl:flex-row flex-col 2xl:justify-around items-center bg-gradient-to-t from-blue-500 via-transparent to-red-500 mx-auto  
import Image from "next/image";
import AttendeeCard from "./ui/AttendeeCard"
import clouds from "../../../public/"
export default function AttendeeContainer() {
    return(
        //md:tablet breakpoint
        //lg:desktop/laptop breakpoint
        //initally scaled for mobile->tablet->desktop/laptop
        //IN ORDER FOR CONTAINERS TO WORK! NAME HAS TO BE first_full_name and last initial: example = Gabriel F.
        <div className="bg-deepsky py-20 2xl:py-60 w-full h-auto">
            <div className="mx-auto w-full">
                <div className="flex md:flex-row flex-col items-center">
                    <AttendeeCard/>
                    <AttendeeCard/>
                </div>
            </div>
        </div>


    );
}
