'use client'
interface OrganizerSliderProps {
    name1: string;
    role1: string;
    imgPath1: string;
    name2: string;
    role2: string;
    imgPath2: string;
    name3: string;
    role3: string;
    imgPath3: string;
    name4: string;
    role4: string;
    imgPath4: string;
}
import useEmblaCarousel from 'embla-carousel-react'
import OrganizerCard from './CardGroup'

export default function OrganizerSlider({name1="N/A", imgPath1="/headshotPlaceholder.png", role1="N/A",
  name2="N/A", imgPath2="/headshotPlaceholder.png", role2="N/A",
  name3="N/A", imgPath3="/headshotPlaceholder.png", role3="N/A",
  name4="N/A", imgPath4="/headshotPlaceholder.png", role4="N/A",
}:OrganizerSliderProps) {
  const [emblaRef] = useEmblaCarousel()

  return (
    <div className="mx-auto mt-[20px] md:mt-[70px] w-[100%] xl:w-[80%] embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide"><OrganizerCard name1="Ken Phongpharnich" role1='Social Media Lead' imgPath1='/yasir.png'/></div>
        <div className="embla__slide"><OrganizerCard/></div>
        <div className="embla__slide"><OrganizerCard/></div>
        <div className="embla__slide"><OrganizerCard/></div>
      </div>
    </div>
  )
}