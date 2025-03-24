'use client'
import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import Slide from './ui/Slide'
import placeholder from "../../../public/minh.jpg"
import left from "../../../public/leftarrow.png"
import right from "../../../public/rightarrow.png"



export default function Slider () {
    const [emblaRef, emblaApi] = useEmblaCarousel({loop:true})
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
      }, [emblaApi])
    
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
      }, [emblaApi])

    
    return (
            <div className='bg-red-500 w-screen'>
                <div className='mx-auto pb-10 max-w-[1350px] embla'>
                    <div className="max-w-[1350px] embla__viewport" ref={emblaRef} >
                        <div className="w-[100%] max-w-[1350px] embla__container">
                            <div className="embla__slide"><Slide indvidualName1='Yasir White' indvidualRole1='HackCC founder' indviduaImageVaraible1={placeholder}></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
                            <div className="embla__slide"><Slide></Slide></div>
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

        
        
    
    )
}