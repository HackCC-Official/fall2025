import { montserrat_Alternates } from './styles/fonts'
import Image from "next/image";
//xs:p-[60px]

interface CardProps {
    name: string;
    role: string;
    imgPath: string;
}

export default function Card({name="N/A", role="role/team", imgPath="/headshotPlaceholder.png"} : CardProps) {
    return (
        <div className='flex flex-col justify-center items-center bg-blue-500 my-4 rounded-md basis-[40%]'>
            <Image alt="error" src={imgPath} width={100} height={100} className="pt-4 md:pt-6 xl:pt-8 w-[70%]"></Image>
            <h2 className={`${montserrat_Alternates.className}  text-xs pt-2 lg:pt-4 layoutchange:text-[0.7rem] md:text-sm lg:text-lg`}>{name}</h2>
            <h3 className={`${montserrat_Alternates.className}  text-[0.6rem] pb-4 lg:pb-7 layoutchange:text-[0.6rem] md:text-xs lg:text-base`}>{role}</h3>
        </div>
    )
}
//6
//9