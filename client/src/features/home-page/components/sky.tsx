import React from 'react'
import Image from "next/image";
import skybg from '../../../../public/BG.png'
import { object } from 'zod';

// width: 100vw;
//     max-width: 100%;
//     height: 100vh;
//     position: absolute;
//     top: 0;
//     z-index: -1;

export const Sky = () => {
    return (
        <div className='z-20'>
                <Image className='absolute w-screen max-w-full h-screen object-cover t-0' src={skybg} alt='Sky Background' quality={100} priority></Image>
        </div>
    )
}
