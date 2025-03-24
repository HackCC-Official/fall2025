
import Image, { StaticImageData } from "next/image"
import placeholder from "../../../../public/headshot.png"

interface props {
    path?: StaticImageData;
    name?: string;
    role?: string;
}
export default function Card({name="first last", role="role/team", path=placeholder}:props) {
    return (
        <div className="z-50 flex flex-col justify-center items-center bg-white hover:shadow-2xl mx-auto my-10 lg:my-7 rounded-xl w-56 lg:w-60 h-[280px] lg:h-[300px]">
            <Image src={path} className="rounded-xl w-36 lg:w-40 h-auto" alt="organizer "></Image>
            <h2 className="mt-4 w-full font-mont font-black text-lg text-center truncate">{name}</h2>
            <h3 className="pt-1 font-mont text-grey text-base">{role}</h3>
        </div>
    )
}