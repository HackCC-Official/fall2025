import { montserrat_Alternates } from "../../app/styles/fonts"
interface SectionSubHeadingProps {
    subtext : string;
}
export default function SectionSubHeading({subtext="default-text"} : SectionSubHeadingProps) {
    return (
        <div>
            <p className={`text-black overflow-hidden text-[0.6rem] w-[100%] h-auto text-center ${montserrat_Alternates.className} mx-auto md:w-[80%] md:text-[0.8rem] md:mt-1 lg:text-[1rem]`}>{subtext}</p>
        </div>
    )
}