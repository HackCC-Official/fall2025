interface SectionHeaderProps {
    title: string;
    bg: string;
}

export default function SectionHeader({title="default-value", bg="bg-red-500"}: SectionHeaderProps) {
    return (
        //md:tablet breakpoint
        //initally scaled for mobile->tablet->desktop/laptop
        <div className={`${bg} w-full`}>
            <div className='mx-auto w-[100%] md:w-[80%] h-auto overflow-hidden font-bagel text-[1.75rem] text-black md:text-[2.5rem] lg:text-[2.6rem] text-center'>
                <p>{title}</p>
            </div>
        </div>
    )
}