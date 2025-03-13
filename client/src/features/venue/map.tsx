import Image from "next/image"
import VenueCard from "./ui//VenueCard"
import map from "../../../public/maps.png"
//bg-gradient-to-t from-red-400 to-blue-400
//<div className="bottom-0 z-30 absolute bg-gradient-to-t from-[#8F43D8] to-transparent opacity-[100%] w-full h-[100px]"></div>
export default function VenueContainer() {
    return (
    <div className="flex bg-[#8F43D8] pb-[50px] w-full h-[full] pointer-events-none">
        <div className="relative flex items-center my-auto w-full h-[700px] lg:h-[1000px]">
        <div className="top-0 z-30 absolute bg-gradient-to-b from-deepsky to-transparent opacity-[100%] w-full h-[100px]"></div>
            <Image src={map} alt="foothill" fill className="absolute w-full object-cover" quality={80}/>
            <div className="bottom-0 z-30 absolute bg-gradient-to-t from-[#8F43D8] to-transparent opacity-[100%] w-full h-[150px]"></div>
            <VenueCard></VenueCard>
        </div>
    </div>
    )
}