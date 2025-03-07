
import AttendeeCard from "@/components/ui/AttendeeCard";
export default function AttendeeContainer() {
    return(
        //md:tablet breakpoint
        //lg:desktop/laptop breakpoint
        //initally scaled for mobile->tablet->desktop/laptop
        //IN ORDER FOR CONTAINERS TO WORK! NAME HAS TO BE first_full_name and last initial: example = Gabriel F.
        <div className="flex flex-wrap md:flex-nowrap lg:flex-nowrap gap-x-[60px] mx-auto mt-[20px] md:mt-[70px] p-4 w-[100%] lg:w-[80%] xl:w-[70%]">
            <AttendeeCard imgPath="/yue.png" name="Yue S." subText="My experience was incredible. I found such a great team to collaborate with and we had a blast creating a silly idea that turned into a big opportunity."></AttendeeCard>
            <AttendeeCard imgPath="/yasir.png" name="Bhavanbir D."></AttendeeCard>
        </div>
    );
}
