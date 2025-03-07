import Image from "next/image"
import VenueCard from "./VenueCard"
export default function VenueContainer() {
    return (
        <div className="relative flex items-center bg-red-300 mx-auto mt-10 w-full max-w-[2000px] overflow-hidden">
            <div className="left-[50px] absolute"><VenueCard/></div>
            <Image src="/Venue.png" quality={100} width={640} height={328} className="w-full h-auto" alt="Venue" />
            
        </div>
    )
}