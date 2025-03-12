import { montserrat_Alternates } from '../styles/fonts'
import Image from "next/image";
//xs:p-[60px]

interface CardProps {
    name: string;
    role: string;
    imgPath: string;
}

export default function Card({name="N/A", role="role/team", imgPath="/headshotPlaceholder.png"} : CardProps) {
    return (
        <div className='text-black flex flex-col justify-center items-center bg-white hover:shadow-md my-4 rounded-xl h-auto basis-[40%]'>
            <Image alt="error" src={imgPath} width={201} height={200} quality={80} className="pt-4 md:pt-6 xl:pt-8 w-[70%] h-auto" sizes="(min-width: 2500px) 300px, (min-width: 1280px) calc(12.67vw - 14px), (min-width: 1040px) calc(15.91vw - 30px), (min-width: 780px) calc(20vw - 31px), 100px"></Image>
            <h2 className={`${montserrat_Alternates.className}  text-xs pt-2 lg:pt-4 layoutchange:text-[0.7rem] md:text-sm lg:text-lg`}>{name}</h2>
            <h3 className={`${montserrat_Alternates.className}  text-[#696E75] text-[0.6rem] pb-4 lg:pb-7 layoutchange:text-[0.6rem] md:text-xs lg:text-base`}>{role}</h3>
        </div>
    )
}
//6
//9