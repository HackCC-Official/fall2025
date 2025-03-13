
import Image from "next/image"
import yasir from "../../../../public/yasir.png"
import quote from "../../../../public/Quote.png"
export default function AttendeeCard() {
    return (
        <div className="flex md:flex-row flex-col mx-auto my-10 max-w-[90%] w-[320px] sm:w-[500px] h-auto md:h-[200px]">
            <div className="flex flex-col items-center min-w-[100px] sm:min-w-[150px] h-[100%]">
                <Image src={yasir} alt="person" className="w-[100px] sm:w-[150px] md:w-[100px] h-auto" ></Image>
                <h2 className="font-bold text-white text-center">Yasir</h2>
            </div>
            <div className="px-4 sm:px-5">
                <Image src={quote} alt="quote" className="w-[50px] h-auto"></Image>
                <p className=" break-normal mt-3 text-[0.8rem] text-white sm:text-[1.2rem] md:text-[0.8rem] 2xl:text-[1.3rem]">My experience was incredible. I found such a great team to collaborate with and we had a blast creating a silly idea that turned into a big opportunity.</p>               
            </div>
        </div>
    )
}