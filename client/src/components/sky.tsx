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
            <Image className='-z-10 absolute w-screen max-w-full h-screen object-cover 2xl:object-fill t-0' src={skybg} alt='Sky Background'></Image>
        </div>
    )
}

export const SkyFixed = ({ className } : { className?: string }) => {
    return (
        <div className={cn([
            'bg-[#9947DC]',
            className
        ])}>
            <Image className='-z-10 fixed w-screen max-w-full h-screen object-cover t-0' src={skybg} alt='Sky Background'></Image>
        </div>
    )
}