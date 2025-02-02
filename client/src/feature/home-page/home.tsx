import Image from "next/image";
import plane from "./assets/temp_plane.png"
import clouds from "./assets/temp_clouds.png"
import { Stars } from "./components/stars"
import { Socials } from '../../components/socials'

export default function home() {
    return(
        <div>
            <Stars></Stars>
            <div className="flex flex-row justify-around items-center w-screen h-screen">
                <div className="z-10 flex flex-col justify-center items-center text-center">
                    <h1 className="text-8xl bold">HACKCC</h1>
                    <h2 className="mb-4 text-4xl">May 2nd-4th</h2>
                    <input type="email" className="p-2 rounded-md w-96 caret-royalpurple" name="email" id="" placeholder="Enter your email for future updates!" />
                    <button className="bg-pink-200 mt-4 px-4 py-2 rounded-md">Submit</button>
                </div>
                <div className="z-10">
                    <Image className="" src={plane} alt="Plane"></Image>
                </div>
            </div>
            <Image className="bottom-0 absolute w-screen" src={clouds} alt="Clouds"></Image>
            <Socials></Socials>
        </div>
    )
}