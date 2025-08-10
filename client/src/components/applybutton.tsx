"use client"
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react'

export const ApplyButton = (props: any) => {
    const { text, size, directory, to } = props;
    const router = useRouter();
    
    let sizing = "";
    let newWindow = '';
    
    switch (size) {
        case "sm":
            sizing = 'py-1.5 px-8'
            break;
        case "md":
            sizing = 'py-3 px-6 md:px-10 lg:py-2 lg:px-10 text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] xl:text-[1rem] mt-8'
            newWindow = '_blank'
            break;
        case "lg":
            sizing = 'py-3 px-6 md:px-10 lg:py-4 lg:px-14 text-[0.6rem] md:text-[0.8rem] lg:text-[1.2rem] xl:text-[1.3rem] mt-8'
            break;
        case "xl":
            sizing = 'py-3 px-10 lg:py-4 lg:px-14 text-lg sm:text-xl md:text-2xl z-10'
    }

    const handleClick = (e: React.MouseEvent) => {
        if (to) {
            e.preventDefault();
            router.push(to);
        }
        // For directory (external links), let the default anchor behavior handle it
    };

    return (
        <a 
            href={to || directory} 
            target={newWindow} 
            onClick={handleClick}
            className={cn([
                sizing,
                'cursor-pointer font-mont rounded-[30px] font-extrabold text-hoverpurple active:bg-activeyellow bg-vibrantyellow',
            ])}
        >
            {text}
        </a>
    );
}