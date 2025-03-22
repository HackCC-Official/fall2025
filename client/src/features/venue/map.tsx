import Image from "next/image"
import VenueCard from "./ui//VenueCard"
import map from "../../../public/maps.png"

//bg-gradient-to-t from-red-400 to-blue-400
//<div className="bottom-0 z-30 absolute bg-gradient-to-t from-[#8F43D8] to-transparent opacity-[100%] w-full h-[100px]"></div>
export default function VenueContainer() {
    return (
        <div className="flex bg-bgpurple pb-[650px] w-full h-[500px] pointer-events-none" id="venueTab">
        <div className="relative flex items-center my-auto w-full h-[500px]">
        <div className="top-0 z-30 absolute bg-gradient-to-b from-royalpurple to-transparent opacity-[100%] -mt-[1px] w-full h-[100px]"></div>
            <Image src={map} alt="foothill" fill className="absolute border-1 border-black w-full object-cover" quality={80}/>
            <div className="bottom-0 z-30 absolute bg-gradient-to-t from-bgpurple to-transparent opacity-[100%] -mb-[1px] w-full h-[150px]"></div>
            <VenueCard></VenueCard>
        </div>
    </div>
    )
}