import ropeimg from "../../../../public/Rope.png"
import Image from "next/image"
export default function Rope() {
    return (
        <div className="relative bg-blue-500 w-[300px] h-auto">
            <Image src={ropeimg} alt="rope" className="-bottom-[75px] -left-[150px] absolute w-[300px] h-auto"></Image>
        </div>
    )
}