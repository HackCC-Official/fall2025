import Image from "next/image";
import plane from "../assets/temp_plane.png"

export default function home() {

    return(
        <div className="flex flex-row justify-around items-center w-screen h-screen z-10">
            <div className="text-center">
                <h1 className="text-8xl">HACKCC</h1>
                <h2 className="text-4xl mb-4">May 2nd-4th</h2>
                <textarea className="resize-none caret-lightpurple" name="email" id=""></textarea>
            </div>
            <div className="">
                <Image className="animate-" src={plane} alt="Plane"></Image>
            </div>
        </div>
    )
}