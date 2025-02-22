import Image from "next/image";
import helicat from "./assets/HeliCat.png"
import clouds from "./assets/temp_clouds.png"
import title from "./assets/Title.png"
import { Stars } from "./components/stars"
import { Socials } from '../../components/socials'
import { Interest } from './components/interest'

export default function home() {
    return(
        <div className="flex overflow-x-hidden">
            <Stars></Stars>
            <Image className="bottom-0 absolute w-screen" src={clouds} alt="Clouds"></Image>
            <div className="flex flex-col justify-center items-center w-screen h-screen z-50">
                <div className="relative">
                    <Image className="lg:h-48 md:h-44 sm:h-40 h-36 w-auto" src={title} alt="HackCC Logo"></Image>
                    <Image className="lg:h-48 md:h-44 sm:h-40 h-36 w-auto absolute md:-right-3/4 sm:-right-1/2 -right-1/3 bottom-3/4 animate-bobbing ease-linear" src={helicat} alt="HeliCat"></Image>
                </div>
                <div className="lg:text-5xl md:mt-10 md:mb-20 mt-8 mb-16 text-center md:text-4xl text-3xl">
                    <p>May 2-4, 2025 <span className="sm:inline hidden">|</span> <br className="sm:hidden inline" /> Northridge, CA</p>
                </div>
                <div className="lg:text-lg md:text-md text-sm flex flex-col text-center">
                    <p>Sign up to receive updates about the event</p>
                    <Interest></Interest>
                </div>
            </div>
            <div className="fixed bottom-20 mx-auto inset-x-0 flex justify-center items-center">
                <Socials></Socials>
            </div>
        </div>
    )
}