import Image from "next/image";
 //xs:p-[60px]
 
export default function Card() {
    return (
        <div className='flex flex-col justify-center items-center bg-blue-500 my-4 rounded-md basis-[40%]'>
            <Image alt="error" src="/headshotPlaceholder.png" width={100} height={100} className="pt-4 md:pt-6 xl:pt-8 w-[70%]"></Image>
            <h2 className='pt-2 lg:pt-4 font-mont text-sm lg:text-lg xl:text-2xl'>first last</h2>
            <h3 className='pb-4 lg:pb-7 font-mont lg:text-md text-xs xl:text-lg'>role / team</h3>
        </div>
    )
}