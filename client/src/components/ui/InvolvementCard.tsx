import { inter } from "../../app/styles/fonts"
import Image from "next/image"
interface InvolvementCardProps {
    imagePath : string;
    cardTitle : string;
    text : string;
    buttonText : string;
}
export default function InvolvementCard({imagePath="", cardTitle="title", text="place-holder text", buttonText="button"}: InvolvementCardProps) {
    return (
        <div className="flex flex-col justify-center items-center bg-red-500 md:bg-blue-400 my-4 py-[50px] md:max-w-[612px] h-[280px] basis-[75%] lg:basis-[40%]">
            <Image src={imagePath} width={152} height={96} className="bg-red-400 w-[25%] h-auto" alt="paw image"></Image>
            <h3 className="my-2 font-bold text-[1.2rem]">{cardTitle}</h3>
            <p className="bg-purple-500 w-[80%] text-[0.8rem] text-center">{text}</p>
            <button className="bg-yellow-500 mt-4 px-4 py-1 rounded-[20px] text-[0.8rem]">{buttonText}</button>

        </div>
    )
}