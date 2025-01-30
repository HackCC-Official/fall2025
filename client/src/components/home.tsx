import Image from "next/image";
import plane from "../assets/temp_plane.png"

export default function home() {

    return(
        <div className="flex flex-row justify-around items-center w-screen h-screen">
            <div className="flex flex-col justify-center items-center text-center z-10">
                <h1 className="text-8xl bold">HACKCC</h1>
                <h2 className="text-4xl mb-4">May 2nd-4th</h2>
                <input type="email" className="w-96 rounded-md p-2 caret-royalpurple" name="email" id="" placeholder="Enter your email for future updates!" />
                <button className="rounded-md bg-pink-200 py-2 px-4 mt-4">Submit</button>
            </div>
            <div className="z-10">
                <Image className="" src={plane} alt="Plane"></Image>
            </div>
        </div>
    )
}