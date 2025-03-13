import React from 'react'
import Image from "next/image";
import skybg from '../../public/BG Image.png'

export const Sky = () => {
    return (
        <div>
            <Image className='absolute max-w-full w-screen h-screen t-0 2xl:object-fill object-cover -z-10' src={skybg} alt='Sky Background'></Image>
        </div>
    )
}
