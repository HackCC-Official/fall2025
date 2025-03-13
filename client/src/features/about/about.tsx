import React from 'react'
import Image from 'next/image'
import ShootingStar from '../../../public/Shooting Star.png'
import Paw from '../../../public/Pink Paw.png'

export default function About () {
    return (
        <div className='bg-gradient-to-b from-bgpurple to-richpurple w-full h-auto'>
            <div className='flex flex-col justify-center items-center mx-auto py-20 w-[800px] max-w-[90%] text-white align-center'>
                <div className='relative mb-4 font-bagel text-2xl sm:text-3xl md:text-4xl'>
                    <h1>About HackCC</h1>
                    <Image className='bottom-3/4 -left-1/2 absolute w-16 h-auto' src={ShootingStar} alt='Shooting Stars'></Image>
                </div>
                <div className='px-8 font-mont text-base sm:text-lg md:text-xl sm:text-center'>
                    <p>A 250 person, 36 hour hackathon for community college students <br className='hidden lg:inline' /> across California, hosted at Foothill College in Los Altos Hills, CA</p>
                </div>
                <div className='flex sm:flex-row flex-col justify-between'>
                    <div className='px-8 py-4 sm:py-8 w-full sm:w-1/2 font-mont text-xs'>
                        <p>HackCC is California's statewide hackathon created for community college students, providing a platform to explore new technologies, build innovative projects, and colloborate with peers. Unlike university hackathons, HackCC bridges the gap for 250 students who often lack access to these opportunities, fostering an inclusive, hands-on environment where creativity and technology solve real-world problems.</p>
                    </div>
                    <div className='relative px-8 py-0 sm:py-8 w-full sm:w-1/2 font-mont'>
                    <h1 className='z-10 text-sm sm:text-lg md:text-xl'>Event Features</h1>
                        <ul className='z-10 text-xs [&>*]:my-2'>
                            <li>• Fun, collaborative, and supportive community of hackers</li>
                            <li>• Interesting and educational talks and workshops</li>
                            <li>• Delicious catering throughout the event</li>
                            <li>• Great prizes and more!</li>
                        </ul>
                    <Image className='-top-1/4 sm:top-0 left-0 -z-10 absolute w-16 h-auto' src={Paw} alt='Paw'></Image>
                    </div>
                </div>
            </div>
        </div>
    )
}
