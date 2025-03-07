import { bagel_Fat_One, montserrat_Alternates } from './styles/fonts'
import Image from 'next/image'
export default function VenueCard() {
    return (
        <div className="wrapper">
            <div className="flex flex-col bg-blue-400 sm:bg-red-500 md:bg-yellow-400 lg:bg-purple-400 xl:bg-white 2xl:bg-red-200 shadow-2xl p-3 rounded-xl w-[140px] sm:w-[270px] md:w-[320px] lg:w-[400px] xl:w-[450px] 2xl:w-[550px] h-[155px] sm:h-[300px] md:h-[360px] lg:h-[460px] xl:h-[550px] 2xl:h-[660px] card-container">
                <h2 className={`${bagel_Fat_One.className} text-sm sm:text-[1.7rem] md:text-[1.8rem] lg:text-[2.3rem] sm:mb-3 md:mb-5 lg:mt-4 lg:mb-7 lg:ml-2 xl:mb-8 xl:text-[2.6rem] 2xl:text-[2.8rem] xl:mb-9`}>Venue</h2>
                <Image src="/school.png" width={116} height={65} alt="OCC" className='mx-auto rounded-md sm:w-[230px] md:w-[280px] lg:w-[340px] xl:w-[390px] 2xl:w-[490px] sm:h-auto'></Image>
                <h3 className={`${montserrat_Alternates.className} text-[0.5rem] sm:text-[1rem] font-bold sm:w-[240px] sm:mx-auto sm:mt-3 md:text-[1.2rem] md:w-[280px] lg:w-[350px] lg:text-[1.3rem] lg:mt-4 2xl:mt-6 xl:w-[400px] xl:text-[1.5rem] 2xl:w-[500px] 2xl:text-[1.9rem]`}>Orange Coast College</h3>
                <p className={`${montserrat_Alternates.className} text-[0.4rem] sm:text-[0.8rem] text-[#3C4146] sm:w-[240px] sm:mx-auto md:w-[280px] md:text-[1rem] lg:w-[350px] lg:text-[1.2rem] lg:mt-2 xl:w-[400px] xl:text-[1.3rem] 2xl:w-[500px] 2xl:text-[1.8rem]`}>2701 Fairview Road</p>
                <p className={`${montserrat_Alternates.className} text-[0.4rem] sm:text-[0.8rem] text-[#3C4146] sm:w-[240px] sm:mx-auto md:w-[280px] md:text-[1rem] lg:w-[350px] lg:text-[1.2rem] xl:w-[400px] xl:text-[1.3rem] 2xl:w-[500px] 2xl:text-[1.8rem]`}>Costa Mesa, California 92626</p>
                <div className={`${montserrat_Alternates.className} text-[0.3rem] sm:text-[0.55rem] sm:w-[100%] sm:mx-auto flex sm:mt-4 md:w-[280px] md:text-[0.65rem] lg:w-[350px] lg:text-[0.8rem] lg:mt-6 xl:w-[400px] xl:text-[0.9rem] 2xl:w-[500px] 2xl:text-[1.1rem]`}>
                    <p >Get Directions →</p>
                    <p className='mx-1'>|</p>
                    <p >Lodging & Accommodations →</p>
                </div>
            </div>
        </div>
    )
}