'use client'
import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import CatFace from "../../../public/Meow Face.webp"

import { Title } from "@/components/title";

import Slide from './ui/Slide'
import left from "../../../public/Left Arrow.webp"
import right from "../../../public/Right Arrow.webp"

import Yasir from "../../../public/organizers/yasir.webp"
import Kairi from "../../../public/organizers/kai.webp"
import Danish from "../../../public/organizers/danish.webp"
import Brian from "../../../public/organizers/brian.webp"
import Nataly from "../../../public/organizers/nataly.webp"
import Nihal from "../../../public/organizers/nihal.webp"
import Peng from "../../../public/organizers/peng.webp"
import Tiffany from "../../../public/organizers/tiffany.webp"
import Ken from "../../../public/organizers/ken.webp"
import Sonny from "../../../public/organizers/sonny.webp"
import Bhavanbir from "../../../public/organizers/bhavanbir.webp"
import Aiden from "../../../public/organizers/aiden.webp"
import Anirudh from "../../../public/organizers/anirudh.webp"
import Jennifer from "../../../public/organizers/jennifer.webp"
import Melody from "../../../public/organizers/melody.webp"
import Lexington from "../../../public/organizers/lexington.webp"
import Christian from "../../../public/organizers/chris.webp"
import Gabriel from "../../../public/organizers/gabriel.webp"
import Remiel from "../../../public/organizers/remiel.webp"
import Kiwi from "../../../public/organizers/kiwi.webp"

export default function Slider () {
    const [emblaRef, emblaApi] = useEmblaCarousel({loop:true})
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
      }, [emblaApi])
    
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
      }, [emblaApi])

    
    return (
            <div className='relative bg-bgpurple w-screen h-auto overflow-x-clip text-center'>
                <Title text="2025 Organizers"></Title>
                <div className='relative mx-auto max-w-[1350px] h-auto'>
                <Image src={CatFace} sizes="(min-width: 1040px) 300px, 230px" className='-top-28 lg:-top-40 -right-20 absolute w-[230px] lg:w-[300px] min-w-[230px] h-auto animate-swaying ease-linear' alt="cloud"></Image>
                <div className='relative mx-auto pb-10 max-w-[1350px] embla'>
                    <div className="max-w-[1350px] embla__viewport" ref={emblaRef} >
                        <div className="w-[100%] max-w-[1350px] embla__container">
                            <div className="embla__slide"><Slide indvidualName1='Yasir White' indvidualRole1='Lead Organizer' indviduaImageVaraible1={Yasir} indvidualName2='Kairi Navratil' indvidualRole2='Operations' indviduaImageVaraible2={Kairi}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Danish' indvidualRole1='Logistics Lead' indviduaImageVaraible1={Danish} indvidualName2='Brian Sawaya' indvidualRole2='Logistics' indviduaImageVaraible2={Brian}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Nataly Castillo' indvidualRole1='Logistics' indviduaImageVaraible1={Nataly} indvidualName2='Nihal' indvidualRole2='Logistics' indviduaImageVaraible2={Nihal}></Slide></div>

                            <div className="embla__slide"><Slide indvidualName1='Peng Tang' indvidualRole1='Logistics' indviduaImageVaraible1={Peng} indvidualName2='Tiffany Nguyen' indvidualRole2='Outreach Lead' indviduaImageVaraible2={Tiffany}></Slide></div>

                            <div className="embla__slide"><Slide indvidualName1='Ken Phongpharnich' indvidualRole1='Outreach' indviduaImageVaraible1={Ken} indvidualName2='Sonny' indvidualRole2='Outreach' indviduaImageVaraible2={Sonny}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Bhavanbir Dhandi' indvidualRole1='Social Media Lead' indviduaImageVaraible1={Bhavanbir} indvidualName2='Aiden Solomon' indvidualRole2='Social Media' indviduaImageVaraible2={Aiden}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Anirudh' indvidualRole1='Social Media' indviduaImageVaraible1={Anirudh} indvidualName2='Jennifer' indvidualRole2='Social Media' indviduaImageVaraible2={Jennifer}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Melody' indvidualRole1='Social Media' indviduaImageVaraible1={Melody} indvidualName2='Lexington Carey' indvidualRole2='Website Lead' indviduaImageVaraible2={Lexington}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Christian Figueroa' indvidualRole1='Website' indviduaImageVaraible1={Christian} indvidualName2='Gabriel Flores' indvidualRole2='Website' indviduaImageVaraible2={Gabriel}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Remiel Shirazi' indvidualRole1='Website' indviduaImageVaraible1={Remiel} indvidualName2='Kiwi' indvidualRole2='Mascot' indviduaImageVaraible2={Kiwi}></Slide></div>
                        </div>
                    </div>
                    <div className='flex justify-around items-center mx-auto mt-1 lg:mt-8 w-48 h-20'>
                        <button className="flex justify-center items-center bg-hoverpurple active:bg-black active:shadow-lg rounded-[100%] w-[60px] h-[60px] transition-all active:translate-y-1 duration-150" onClick={scrollPrev}>
                            <Image className="w-10 h-auto" src={left} alt="left-button"></Image>
                        </button>
                        <button className="flex justify-center items-center bg-hoverpurple active:bg-black active:shadow-lg rounded-[100%] w-[60px] h-[60px] transition-all active:translate-y-1 duration-150" onClick={scrollNext}>
                            <Image className="w-10 h-auto" src={right} alt="right-button"></Image> 
                        </button>
                    </div>
                </div>
                </div>
            </div>

        
        
    
    )
}