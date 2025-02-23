import Image from "next/image";
import helicat from "./assets/HeliCat.png"
import clouds from "./assets/temp_clouds.png"
import title from "./assets/Title.png"
import { Stars } from "./components/stars"
import { Socials } from '../../components/socials'

export default function home() {
    return(
        <div className="flex">
            <Stars></Stars>
            <Image className="bottom-0 absolute w-screen" src={clouds} alt="Clouds"></Image>
            <div className="flex flex-col justify-center items-center w-screen h-screen z-50">
                <div className="relative">
                    <Image className="lg:h-48 md:h-44 sm:h-40 h-36 w-auto" src={title} alt="HackCC Logo"></Image>
                    <Image className="absolute -right-3/4 bottom-3/4 animate-bobbing ease-linear" src={helicat} alt="HeliCat"></Image>
                </div>
                <div className="lg:text-5xl md:mt-10 md:mb-20 mt-8 mb-16 text-center md:text-4xl text-3xl">
                    <p>May 2-4, 2025 <span className="sm:inline hidden">|</span> <br className="sm:hidden inline" /> Northridge, CA</p>
                </div>
                <div className="lg:text-lg md:text-md text-sm flex flex-col text-center">
                    <p>Sign up to receive updates about the event</p>
                    <div>
                        <input className="py-2 px-4 rounded-md md:my-5 md:mr-5 my-3 mr-3" type="email" placeholder="Enter your email address" />
                        <button className="bg-pink-300 hover:bg-pink-400 text-white py-2 px-6 rounded-md cursor-pointer">Get Notified</button>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-20 mx-auto inset-x-0 flex justify-center items-center">
                <Socials></Socials>
            </div>
        </div>
    )
}