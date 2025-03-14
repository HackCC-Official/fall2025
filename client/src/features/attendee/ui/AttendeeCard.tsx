
import Image, { StaticImageData } from "next/image"
import yasir from "../../../../public/yasir.png"
import quote from "../../../../public/Quote.png"
interface Props {
    imgPath: StaticImageData;
    name: string;
    text: string;
}

export default function AttendeeCard({imgPath, text, name}:Props) {
    return (
        <div className="z-10 flex md:flex-row flex-col mx-auto my-10 w-[320px] sm:w-[500px] lg:w-[700px] max-w-[90%] h-auto md:h-[200px]">
            <div className="flex flex-col items-center md:px-4 min-w-[100px] sm:min-w-[150px] lg:min-w-[200px] h-[100%]">
                <Image src={imgPath} alt="person" className="rounded-xl w-[100px] sm:w-[150px] md:w-[100px] lg:w-[200px] h-auto" ></Image>
                <h2 className="font-bold text-white text-center">{name}</h2>
            </div>
            <div className="px-4 sm:px-5">
                <Image src={quote} alt="quote" className="w-[50px] h-auto"></Image>
                <p className="mt-3 text-[0.8rem] text-white sm:text-[1.2rem] md:text-[0.8rem] lg:text-[1.3rem] break-normal">{text}</p>               
            </div>
        </div>
    )
}