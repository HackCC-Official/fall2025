'use client'

import useEmblaCarousel from 'embla-carousel-react'
import OrganizerCard from './OrganizerCard'

export default function OrganizerSlider() {
  const [emblaRef] = useEmblaCarousel()

  return (
    <div className="mx-auto w-[100%] xl:w-[80%] embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="bg-red-500 embla__slide"><OrganizerCard/></div>
        <div className="bg-blue-100 embla__slide"><OrganizerCard/></div>
        <div className="bg-purple-100 embla__slide"><OrganizerCard/></div>
        <div className="bg-gray-100 embla__slide"><OrganizerCard/></div>
        <div className="bg-gray-100 embla__slide">Slide 5</div>
        <div className="bg-red-100 embla__slide">Slide 1</div>
        <div className="bg-blue-100 embla__slide">Slide 2</div>
        <div className="bg-purple-100 embla__slide">Slide 3</div>
        <div className="bg-gray-100 embla__slide">Slide 4</div>
        <div className="bg-gray-500 embla__slide">Slide 5</div>
      </div>
    </div>
  )
}