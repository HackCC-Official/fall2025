import { bagel_Fat_One, montserrat_Alternates } from "@/app/styles/fonts";
import Image from "next/image";
import yasir from "../../../public/yasir.png"
import quote from "../../../public/Quote.png"
export default function AttendeeContainer() {
    return(
        //md:tablet breakpoint
        //lg:desktop/laptop breakpoint
        //initally scaled for mobile->tablet->desktop/laptop
        //IN ORDER FOR CONTAINERS TO WORK! NAME HAS TO BE first_full_name and last initial: example = Gabriel F.
        <div className="w-full h-full">
            <div className="z-1 flex flex-col justify-around items-center bg-gradient-to-t from-navyblue to-[#9947DC] w-full h-full text-white">
                <h2 className={`${bagel_Fat_One.className} text-[1.5rem] lg:text-[3rem] text-center`}>What past attendees have said</h2>
                <div className="flex 2xl:flex-row flex-col justify-around items-center w-full max-w-[2000px] h-full">
                    <div className="flex 2xl:flex-row flex-col justify-center items-center w-[90%] 2xl:w-[50%] max-w-[600px] 2xl:max-w-[1000px] h-[50%] 2xl:h-[60%]">
                        <div className="flex flex-col justify-center items-center w-full h-full text-center basis-1/2">
                            <Image src={yasir} alt="person" className="w-[200px] 2xl:w-[250px] h-auto"></Image>
                            <h2 className={`${bagel_Fat_One.className} text-[2rem] 2xl:text-[3rem]  `}>bhavanbir </h2>
                        </div>
                        <div className="flex flex-col 2xl:h-[300px] 2xl:basis-1/2">
                            <Image src={quote} alt="quote" className="w-[50px] md:w-[75px] h-auto"></Image>
                            <p className={`${montserrat_Alternates.className} text-[1rem] text-center 2xl:text-[1.5rem] px-10`}>My experience was incredible. I found such a great team to collaborate with and we had a blast creating a silly idea that turned into a big opportunity.</p>
                        </div>
                    </div>
                    <div className="flex 2xl:flex-row flex-col justify-center items-center w-[90%] 2xl:w-[50%] max-w-[600px] 2xl:max-w-[1000px] h-[50%] 2xl:h-[60%]">
                    <div className="flex flex-col justify-center items-center w-full h-full text-center basis-1/2">
                            <Image src={yasir} alt="person" className="w-[200px] 2xl:w-[250px] h-auto"></Image>
                            <h2 className={`${bagel_Fat_One.className} text-[2rem] 2xl:text-[3rem] `}>bhavanbir denali</h2>
                        </div>
                        <div className="flex flex-col 2xl:h-[300px] 2xl:basis-1/2">
                            <Image src={quote} alt="quote" className="w-[50px] md:w-[75px] h-auto"></Image>
                            <p className={`${montserrat_Alternates.className} text-[1rem] text-center 2xl:text-[1.5rem] px-10`}>Hands down the best hackathon I’ve ever participated in! Can’t wait for the next one!!</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}
