import Image, { StaticImageData } from "next/image"
import quote from "../../../../public/Quote.webp"
interface Props {
    imgPath: StaticImageData;
    name: string;
    text: string;
}

export default function AttendeeCard({imgPath, text, name}:Props) {
    return (
        <div className="z-10 flex md:flex-row flex-col mx-auto my-10 w-[320px] sm:w-[500px] lg:w-[700px] max-w-[90%] h-auto md:h-[200px]">
            <div className="flex flex-col items-center md:px-4 min-w-[100px] sm:min-w-[150px] lg:min-w-[200px] h-[100%]">
                <Image src={imgPath} alt="person" className="rounded-xl w-36 lg:w-40 min-w-36 lg:min-w-40 h-auto" sizes="(min-width: 1040px) 168px, (min-width: 780px) 100px, (min-width: 640px) 150px, 100px"></Image>
                <h2 className="font-mont font-bold text-white text-xs md:text-base 2xl:text-lg text-center">{name}</h2>
            </div>
            <div className="px-4 sm:px-5">
                <div className="relative w-[50px] h-auto">
                    <Image src={quote} alt="quote" className="w-[50px] h-auto [filter:brightness(0)_saturate(100%)_invert(90%)_sepia(12%)_saturate(1074%)_hue-rotate(231deg)_brightness(103%)_contrast(104%)]" sizes="50px"></Image>
                </div>
                <p className="mt-3 font-mont text-white text-xs md:text-base 2xl:text-lg break-normal">{text}</p>               
            </div>
        </div>
    )
}