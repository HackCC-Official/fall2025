
import Image from "next/image"
import yasir from "../../../../public/yasir.png"
import quote from "../../../../public/Quote.png"
export default function AttendeeCard() {
    return (
<<<<<<< HEAD
        <div className="flex md:flex-row flex-col mx-auto my-10 w-[320px] sm:w-[500px] lg:w-[700px] h-auto md:h-[200px]">
            <div className="flex flex-col items-center md:px-4 min-w-[100px] sm:min-w-[150px] lg:min-w-[200px] h-[100%]">
                <Image src={yasir} alt="person" className="w-[100px] sm:w-[150px] md:w-[100px] lg:w-[200px] h-auto" ></Image>
=======
        <div className="flex md:flex-row flex-col mx-auto my-10 max-w-[90%] w-[320px] sm:w-[500px] h-auto md:h-[200px]">
            <div className="flex flex-col items-center min-w-[100px] sm:min-w-[150px] h-[100%]">
                <Image src={yasir} alt="person" className="w-[100px] sm:w-[150px] md:w-[100px] h-auto" ></Image>
>>>>>>> eb6f93aae25a2a24d0a7668dd512156e29e87318
                <h2 className="font-bold text-white text-center">Yasir</h2>
            </div>
            <div className="px-4 sm:px-5">
                <Image src={quote} alt="quote" className="w-[50px] h-auto"></Image>
<<<<<<< HEAD
                <p className="mt-3 text-[0.8rem] text-white sm:text-[1.2rem] md:text-[0.8rem] lg:text-[1.3rem]">My experience was incredible. I found such a great team to collaborate with and we had a blast creating a silly idea that turned into a big opportunity.</p>               
=======
                <p className=" break-normal mt-3 text-[0.8rem] text-white sm:text-[1.2rem] md:text-[0.8rem] 2xl:text-[1.3rem]">My experience was incredible. I found such a great team to collaborate with and we had a blast creating a silly idea that turned into a big opportunity.</p>               
>>>>>>> eb6f93aae25a2a24d0a7668dd512156e29e87318
            </div>
        </div>
    )
}