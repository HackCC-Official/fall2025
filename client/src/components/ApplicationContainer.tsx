
import { bagel_Fat_One, montserrat_Alternates } from "./styles/fonts"
export default function ApplicationContainer() {
    return(
        <div className="flex flex-col items-center w-full  overflow-hidden my-4" >
            <h2 className={`text-black  text-[3rem] ${bagel_Fat_One.className} mb-2 md:text-[4rem] lg:text-[5rem] xl:text-[6rem]`}>Apply</h2>
            <h3 className={`text-black text-[0.8rem] ${montserrat_Alternates.className} md:text-[1rem] lg:text-[1.4rem] xl:text-[2rem]`}>Apply to register as a participant</h3>
            <button className={`${montserrat_Alternates.className} active:bg-black text-[0.6rem] md:text-[0.8rem] lg:text-[1.2rem] xl:text-[2rem] bg-[#4C27A0] py-2 px-10 lg:py-3 md:px-[60px]  lg:px-[100px] xl:px-[110px] rounded-[15px] mt-7  lg:rounded-[40px] lg:mt-[50px] xl:mt-[80px]`}>Apply now</button>
        </div>
    )
}