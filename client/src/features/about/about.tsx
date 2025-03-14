import React from 'react'
import Image from 'next/image'
import ShootingStar from '../../../public/Shooting Star.png'
import Paw from '../../../public/Pink Paw.png'

export default function About () {
    return (
        <div className='-z-20 bg-gradient-to-b from-bgpurple to-richpurple -mt-[5px] w-full h-auto'>
            <div className='flex flex-col justify-center items-center mx-auto py-20 w-[1000px] max-w-[90%] text-white align-center'>
                <div className='relative mb-4 font-bagel text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl'>
                    <h1>About HackCC</h1>
                    <Image className='bottom-0 -left-1/2 absolute w-16 md:w-20 2xl:w-28 h-auto' src={ShootingStar} alt='Shooting Stars'></Image>
                </div>
                <div className='my-0 sm:my-8 px-8 font-mont text-base sm:text-lg md:text-2xl 2xl:text-3xl sm:text-center'>
                    <p>A 250 person, 36 hour hackathon for community college students <br className='hidden 2xl:hidden lg:inline' /> across California, hosted at Foothill College in Los Altos Hills, CA</p>
                </div>
                <div className='flex sm:flex-row flex-col justify-between'>
                    <div className='px-8 py-4 sm:py-8 w-full sm:w-1/2 font-mont text-xs md:text-base 2xl:text-lg'>
                        <p>HackCC is California's statewide hackathon created for community college students, providing a platform to explore new technologies, build innovative projects, and colloborate with peers. <br /> <br /> Unlike university hackathons, HackCC bridges the gap for 250 students who often lack access to these opportunities, fostering an inclusive, hands-on environment where creativity and technology solve real-world problems.</p>
                    </div>
                    <div className='relative px-8 py-0 sm:py-8 w-full sm:w-1/2 font-mont'>
                    <Image className='-top-1/4 sm:top-0 left-0 -z-10 absolute w-16 md:w-20 2xl:w-28 h-auto' src={Paw} alt='Paw'></Image>
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
