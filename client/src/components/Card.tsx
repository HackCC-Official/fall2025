import { montserrat_Alternates } from './styles/fonts'
import Image from "next/image";
//xs:p-[60px]

export default function Card() {
    return (
        <div className='flex flex-col justify-center items-center bg-blue-500 my-4 rounded-md basis-[40%]'>
            <Image alt="error" src="/headshotPlaceholder.png" width={100} height={100} className="pt-4 md:pt-6 xl:pt-8 w-[70%]"></Image>
            <h2 className={`${montserrat_Alternates.className} text-sm pt-2 lg:pt-4 lg:text-lg xl:text-2xl`}>first last</h2>
            <h3 className={`${montserrat_Alternates.className} text-xs pb-4 lg:pb-7 lg:text-md xl:text-lg`}>role / team</h3>
        </div>
    )
}
//6
//9