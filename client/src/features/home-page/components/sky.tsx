import React from 'react'
import Image from "next/image";
import skybg from '../assets/BG Image.png'

// width: 100vw;
//     max-width: 100%;
//     height: 100vh;
//     position: absolute;
//     top: 0;
//     z-index: -1;

export const Sky = () => {
    return (
        <div>
            <Image className='absolute max-w-full w-screen h-screen t-0 object-cover' src={skybg} alt='Sky Background'></Image>
        </div>
    )
}
