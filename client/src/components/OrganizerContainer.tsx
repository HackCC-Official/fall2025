import OrganizerCard from "./OrganizerCard";
export default function OrganizerContainer() {
    return (
        <div className="flex bg-blue-500 w-[100%]">
            <OrganizerCard imgPath="/yasir.png"/>
            <OrganizerCard imgPath="/yasir.png"/>
        </div>
    );
}