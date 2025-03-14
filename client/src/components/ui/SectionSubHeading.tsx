
interface SectionSubHeadingProps {
    subtext : string;
}
export default function SectionSubHeading({subtext="default-text"} : SectionSubHeadingProps) {
    return (
        <div>
            <p className='mx-auto md:mt-1 w-[100%] md:w-[80%] h-auto overflow-hidden font-mont text-[0.6rem] text-black md:text-[0.8rem] lg:text-[1rem] text-center'>{subtext}</p>
        </div>
    )
}