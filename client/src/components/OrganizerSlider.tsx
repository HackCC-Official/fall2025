'use client'
import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import CardGroup from './CardGroup'

export default function OrganizerSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop:true})
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])
  return (
    <div className="mx-auto embla" >
      <div className='mx-auto mt-[20px] md:mt-[70px] w-[100%] xl:w-[80%] embla__viewport' ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <CardGroup 
              name1='Yasir White' role1='Operations' imgPath1='/yasir.png'
              name2='Danish Saini' role2='Logistics Lead' imgPath2='/yasir.png'
              name3='Tiffany Nguyen' role3='Outreach Lead' imgPath3='/yasir.png'
              name4='Bhavanbir Dhandi' role4='Social Media Lead' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Lexington Carey' role1='Website Lead' imgPath1='/yasir.png'
              name2='Nataly Castillo' role2='Logistics' imgPath2='/yasir.png'
              name3='Kameron' role3='Logistics' imgPath3='/yasir.png'
              name4='Brian Sawaya' role4='Logistics' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Jack Hu' role1='Logistics' imgPath1='/yasir.png'
              name2='Peng Tang' role2='Logistics' imgPath2='/yasir.png'
              name3='Kairi Navratil' role3='Logistics' imgPath3='/yasir.png'
              name4='Ricardo Escalante' role4='Logistics' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Danny Abraham' role1='Logistics' imgPath1='/yasir.png'
              name2='Jedrick Espiritu' role2='Logistics' imgPath2='/yasir.png'
              name3='Nihal Puchakatla' role3='Logistics' imgPath3='/yasir.png'
              name4='Artem D.' role4='Logistics' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Ken Phongpharnich' role1='Outreach' imgPath1='/yasir.png'
              name2='Parsa' role2='Outreach' imgPath2='/yasir.png'
              name3='Michael' role3='Outreach' imgPath3='/yasir.png'
              name4='Lobsang' role4='Outreach' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Sonny' role1='Outreach' imgPath1='/yasir.png'
              name2='Aryan' role2='Outreach' imgPath2='/yasir.png'
              name3='Ahyan' role3='Outreach' imgPath3='/yasir.png'
              name4='Jocelyn Mata' role4='Outreach' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Aiden Solomon' role1='Social Media' imgPath1='/yasir.png'
              name2='Jennifer' role2='Social Media' imgPath2='/yasir.png'
              name3='Anirudh' role3='Social Media' imgPath3='/yasir.png'
              name4='Izzy' role4='Social Media' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Melody' role1='Social Media' imgPath1='/yasir.png'
              name2='Eric Nguyen' role2='Website' imgPath2='/yasir.png'
              name3='Christian Figueroa' role3='Website' imgPath3='/yasir.png'
              name4='Dichill Tomarong' role4='Website' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='May' role1='Website' imgPath1='/yasir.png'
              name2='Remy' role2='Website' imgPath2='/yasir.png'
              name3='Evan Ly' role3='Website' imgPath3='/yasir.png'
              name4='Scott' role4='Website' imgPath4='/yasir.png'
            />
          </div>
          <div className="embla__slide">
            <CardGroup 
              name1='Gabriel Flores' role1='Website' imgPath1='/yasir.png'
            />
          </div>
        </div>
      </div>
      <button className="embla__prev" onClick={scrollPrev}>
        Prev
      </button>
      <button className="embla__next" onClick={scrollNext}>
        Next
      </button>
    </div>
  )
}