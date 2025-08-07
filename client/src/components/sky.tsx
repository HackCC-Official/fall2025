import React from 'react'
import Image from "next/image";
import skybg from '../../public/Hero Background.webp'
import { cn } from '@/lib/utils';

export const Sky = ({ className } : { className?: string }) => {
    return (
        <div className={cn([
            'bg-[#9947DC]',
            className
        ])}>
            <Image className='-z-10 absolute w-screen max-w-full h-screen object-cover 2xl:object-fill t-0' src={skybg} alt='Sky Background' sizes="100vw"></Image>
            <div className="bottom-0 left-0 absolute bg-gradient-to-b from-transparent to-bgpurple w-full h-24 pointer-events-none" />
        </div>
    )
}

export const SkyFixed = ({ className } : { className?: string }) => {
    return (
        <div className={cn([
            'bg-[#9947DC]',
            className
        ])}>
            <Image className='-z-10 fixed w-screen max-w-full h-screen object-cover t-0' src={skybg} alt='Sky Background' sizes="100vw"></Image>
        </div>
    )
}