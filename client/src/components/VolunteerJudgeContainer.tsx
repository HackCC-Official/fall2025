import InvolvementCard from "./ui/InvolvementCard"
export default function VolunteerJudgeContainer() {
    return (
        <div className="flex flex-wrap justify-center lg:gap-10 bg-blue-500 rounded-5 w-[100%]">
            <InvolvementCard text="Interested in helping at the event? Apply to be a volunteer and help ensure the event day runs smoothly." imagePath="/1paw.png" cardTitle="Volunteer" buttonText="Apply to Volunteer"/>
            <InvolvementCard text="Help judge event submissions to determine the top projects from the event." imagePath="/3paws.png" cardTitle="Become a Judge" buttonText="Apply to Judge"/>
        </div>
    )
}