import React from 'react'
import Image from 'next/image'
import ShootingStar from '../../../public/Shooting Star.png'
import Paw from '../../../public/Pink Paw.png'

export default function About () {
    return (
        <div className='bg-gradient-to-b from-bgpurple to-richpurple w-full h-auto -mt-[5px] -z-20'>
            <div className='max-w-[90%] w-[1000px] mx-auto py-20 flex flex-col justify-center align-center items-center text-white'>
                <div className='font-bagel text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl mb-4 relative'>
                    <h1>About HackCC</h1>
                    <Image className='absolute -left-1/2 bottom-0 2xl:w-28 md:w-20 w-16 h-auto' src={ShootingStar} alt='Shooting Stars'></Image>
                </div>
                <div className='font-mont sm:text-center text-base sm:text-lg md:text-2xl 2xl:text-3xl px-8 sm:my-8 my-0'>
                    <p>A 250 person, 36 hour hackathon for community college students <br className='hidden lg:inline 2xl:hidden' /> across California, hosted at Foothill College in Los Altos Hills, CA</p>
                </div>
                <div className='flex sm:flex-row justify-between flex-col'>
                    <div className='font-mont text-xs md:text-base 2xl:text-lg sm:w-1/2 w-full sm:py-8 py-4 px-8'>
                        <p>HackCC is California's statewide hackathon created for community college students, providing a platform to explore new technologies, build innovative projects, and colloborate with peers. <br /> <br /> Unlike university hackathons, HackCC bridges the gap for 250 students who often lack access to these opportunities, fostering an inclusive, hands-on environment where creativity and technology solve real-world problems.</p>
                    </div>
                    <div className='font-mont sm:w-1/2 w-full sm:py-8 py-0 px-8 relative'>
                    <Image className='-z-10 absolute sm:top-0 -top-1/4 left-0 2xl:w-28 md:w-20 w-16 h-auto' src={Paw} alt='Paw'></Image>
                    <h1 className='z-10 text-sm sm:text-lg md:text-xl'>Event Features</h1>
                        <ul className='z-10 text-xs md:text-base 2xl:text-lg [&>*]:my-2'>
                            <li>• Fun, collaborative, and supportive community of hackers</li>
                            <li>• Interesting and educational talks and workshops</li>
                            <li>• Delicious catering throughout the event</li>
                            <li>• Great prizes and more!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
