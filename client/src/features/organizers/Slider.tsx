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
import dichill from "../../../public/dichill.webp"
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
            <div className='relative bg-bgpurple -mt-[2px] w-screen h-auto overflow-x-clip text-center'>
                <Title text="2025 Organizers"></Title>
                <div className='relative mx-auto max-w-[1350px] h-auto'>
                <Image src={CatFace} sizes="(min-width: 1040px) 300px, 230px" className='-top-28 lg:-top-40 -right-20 absolute w-[230px] lg:w-[300px] min-w-[230px] h-auto animate-swaying ease-linear' alt="cloud"></Image>
                <div className='relative mx-auto pb-10 max-w-[1350px] embla'>
                    <div className="max-w-[1350px] embla__viewport" ref={emblaRef} >
                        <div className="w-[100%] max-w-[1350px] embla__container">
                            <div className="embla__slide"><Slide 
                            individualName1='Yasir White' 
                            individualRole1='Lead Organizer' 
                            individualImageVariable1={yasir} 
                            individualLink1="https://www.linkedin.com/in/yasir-white" 
                            individualName2='Kairi Navratil' 
                            individualRole2='Operations Lead' 
                            individualImageVariable2={kairi} 
                            individualLink2="https://www.linkedin.com/in/kairi-navratil/"></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Danish Saini' 
                            individualRole1='Logistics Lead' 
                            individualImageVariable1={danish} 
                            individualLink1='https://www.linkedin.com/in/danishsaini/'
                            individualName2='Brian Sawaya' 
                            individualRole2='Logistics' 
                            individualImageVariable2={brian}
                            individualLink2='https://www.linkedin.com/in/briansawaya/'></Slide></div>
                            

                            <div className="embla__slide"><Slide 
                            individualName1='Nataly Castillo' 
                            individualRole1='Logistics' 
                            individualImageVariable1={nataly} 
                            individualLink1='https://www.linkedin.com/in/nataly-castillo-14b69a287/'
                            individualName2='Nihal' 
                            individualRole2='Logistics' 
                            individualImageVariable2={nihal}
                            individualLink2='https://www.linkedin.com/in/nihal-puchakatla-526a79343/'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Jack Hu' 
                            individualRole1='Logistics' 
                            individualImageVariable1={jack} 
                            individualLink1='https://www.linkedin.com/in/jinze-jack-hu-806227266/'
                            individualName2='Danny Abraham' 
                            individualRole2='Logistics' 
                            individualImageVariable2={danny}
                            individualLink2='https://www.linkedin.com/in/danny-abraham-64aa65335/'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Peng Tang' 
                            individualRole1='Logistics' 
                            individualImageVariable1={peng} 
                            individualLink1='https://www.linkedin.com/in/pngtng'
                            individualName2='Tiffany Nguyen' 
                            individualRole2='Outreach Lead' 
                            individualImageVariable2={tiffany}
                            individualLink2='https://www.linkedin.com/in/tiffany-nguyen-3120ba25b/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Ken Phongpharnich' 
                            individualRole1='Outreach' 
                            individualImageVariable1={ken} 
                            individualLink1='https://www.linkedin.com/in/chalongraj-phongpharnich/'
                            individualName2='Sonny' 
                            individualRole2='Outreach' 
                            individualImageVariable2={sonny}
                            individualLink2='https://www.linkedin.com/in/sonny-r-725b38338/'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Bhavanbir Dhandi' 
                            individualRole1='Social Media Lead' 
                            individualImageVariable1={bhavanbir} 
                            individualLink1='https://www.linkedin.com/in/bhavanbir/'
                            individualName2='Aiden Solomon' 
                            individualRole2='Social Media' 
                            individualImageVariable2={aiden}
                            individualLink2='https://www.linkedin.com/in/aiden-solomon621/'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Anirudh Sunkad' 
                            individualRole1='Social Media' 
                            individualImageVariable1={anirudh} 
                            individualLink1='https://www.linkedin.com/in/a-sunkad/'
                            individualName2='Jennifer Ho' 
                            individualRole2='Social Media' 
                            individualImageVariable2={jennifer}
                            individualLink2='https://www.linkedin.com/in/jennifer-ho-299b78333/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Melody Zhang' 
                            individualRole1='Social Media' 
                            individualImageVariable1={melody} 
                            individualLink1='https://www.linkedin.com/in/yirong-zhang-92b450343/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                            individualName2='Isabela Arca' 
                            individualRole2='Social Media' 
                            individualImageVariable2={isabela}
                            individualLink2='https://www.linkedin.com/in/isabela-arca-030000353/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Lexington Carey' 
                            individualRole1='Website Lead' 
                            individualImageVariable1={lexington} 
                            individualLink1='https://www.linkedin.com/in/lexington-carey/'
                            individualName2='Evan Ly' 
                            individualRole2='Website' 
                            individualImageVariable2={evan}
                            individualLink2='https://www.linkedin.com/in/chheang/'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Christian Figueroa' 
                            individualRole1='Website' 
                            individualImageVariable1={christian} 
                            individualLink1='https://www.linkedin.com/in/hikurage/'
                            individualName2='Gabriel Flores' 
                            individualRole2='Website' 
                            individualImageVariable2={gabriel}
                            individualLink2='https://www.linkedin.com/in/gabriel-flores-10bb45331/'></Slide></div>

                            <div className="embla__slide"><Slide 
                            individualName1='Remiel Shirazi' 
                            individualRole1='Website' 
                            individualImageVariable1={remiel} 
                            individualLink1='https://www.linkedin.com/in/remielshirazi '
                            individualName2='Dichill Tomarong' 
                            individualRole2='Website' 
                            individualImageVariable2={dichill}
                            individualLink2='https://www.linkedin.com/in/dichill/'></Slide></div>
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

// individualName2='Kiwi' 
// individualRole2='Mascot' 
// individualImageVariable2={kiwi}
// individualLink2='https://www.instagram.com/realhackcc/'