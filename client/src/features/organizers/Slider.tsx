'use client'
import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import CatFace from "../../../public/Meow Face.webp"

import { Title } from "@/components/title";

import Slide from './ui/Slide'
import left from "../../../public/Left Arrow.webp"
import right from "../../../public/Right Arrow.webp"

import yasir from "../../../public/yasir.webp"
import kairi from "../../../public/kai.webp"
import danish from "../../../public/danish.webp"
import brian from "../../../public/brian.webp"
import nataly from "../../../public/nataly.webp"
import nihal from "../../../public/nihal.webp"
import jack from "../../../public/jack.webp"
import danny from "../../../public/danny.webp"
import peng from "../../../public/peng.webp"
import tiffany from "../../../public/tiffany.webp"
import ken from "../../../public/ken.webp"
import sonny from "../../../public/sonny.webp"
import bhavanbir from "../../../public/bhavanbir.webp"
import aiden from "../../../public/aiden.webp"
import anirudh from "../../../public/anirudh.webp"
import jennifer from "../../../public/jennifer.webp"
import melody from "../../../public/melody.webp"
import isabela from "../../../public/isabela.webp"
import lexington from "../../../public/lexington.webp"
import evan from "../../../public/evan.webp"
import christian from "../../../public/chris.webp"
import gabriel from "../../../public/gabriel.webp"
import remiel from "../../../public/remiel.webp"
import kiwi from "../../../public/kiwi.webp"



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
                            <div className="embla__slide"><Slide indvidualName1='Yasir White' indvidualRole1='Lead Organizer' indviduaImageVaraible1={yasir} indvidualName2='Kairi Navratil' indvidualRole2='Operations Lead' indviduaImageVaraible2={kairi}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Danish Saini' indvidualRole1='Logistics Lead' indviduaImageVaraible1={danish} indvidualName2='Brian Sawaya' indvidualRole2='Logistics' indviduaImageVaraible2={brian}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Nataly Castillo' indvidualRole1='Logistics' indviduaImageVaraible1={nataly} indvidualName2='Nihal' indvidualRole2='Logistics' indviduaImageVaraible2={nihal}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Jack Hu' indvidualRole1='Logistics' indviduaImageVaraible1={jack} indvidualName2='Danny Abraham' indvidualRole2='Logistics' indviduaImageVaraible2={danny}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Peng Tang' indvidualRole1='Logistics' indviduaImageVaraible1={peng} indvidualName2='Tiffany Nguyen' indvidualRole2='Outreach Lead' indviduaImageVaraible2={tiffany}></Slide></div>

                            <div className="embla__slide"><Slide indvidualName1='Ken Phongpharnich' indvidualRole1='Outreach' indviduaImageVaraible1={ken} indvidualName2='Sonny' indvidualRole2='Outreach' indviduaImageVaraible2={sonny}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Bhavanbir Dhandi' indvidualRole1='Social Media Lead' indviduaImageVaraible1={bhavanbir} indvidualName2='Aiden Solomon' indvidualRole2='Social Media' indviduaImageVaraible2={aiden}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Anirudh' indvidualRole1='Social Media' indviduaImageVaraible1={anirudh} indvidualName2='Jennifer' indvidualRole2='Social Media' indviduaImageVaraible2={jennifer}></Slide></div>

                            <div className="embla__slide"><Slide indvidualName1='Melody' indvidualRole1='Social Media' indviduaImageVaraible1={melody} indvidualName2='Isabela Arca' indvidualRole2='Social Media' indviduaImageVaraible2={isabela}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Lexington Carey' indvidualRole1='Website Lead' indviduaImageVaraible1={lexington} indvidualName2='Evan Ly' indvidualRole2='Website' indviduaImageVaraible2={evan}></Slide></div>

                            <div className="embla__slide"><Slide indvidualName1='Christian Figueroa' indvidualRole1='Website' indviduaImageVaraible1={christian} indvidualName2='Gabriel Flores' indvidualRole2='Website' indviduaImageVaraible2={gabriel}></Slide></div>
                            <div className="embla__slide"><Slide indvidualName1='Remiel Shirazi' indvidualRole1='Website' indviduaImageVaraible1={remiel} indvidualName2='Kiwi' indvidualRole2='Mascot' indviduaImageVaraible2={kiwi}></Slide></div>
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