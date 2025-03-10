import { bagel_Fat_One } from '../../app/styles/fonts'
 
interface SectionHeaderProps {
    title: string;
}

export default function SectionHeader({title="default-value" }: SectionHeaderProps) {
    return (
        //md:tablet breakpoint
        //initally scaled for mobile->tablet->desktop/laptop
        <div className={`text-black  overflow-hidden text-[1.75rem] w-[100%] h-auto text-center ${bagel_Fat_One.className} mx-auto md:w-[80%] md:text-[2.5rem] lg:text-[2.6rem]`}>
            <p>{title}</p>
        </div>
    )
}