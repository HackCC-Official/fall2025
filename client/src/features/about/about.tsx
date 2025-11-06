import React from 'react'
import Image from 'next/image'
import ShootingStar from '../../../public/Shooting Star.webp'
import Paw from '../../../public/Pink Paw.webp'
import {Title} from '@/components/title'
import cloudL from "../../../public/Purple Cloud Cluster 2.webp"
import cloudR from "../../../public/Pink Cloud Cluster 4.webp"
import texture from "../../../public/About Texture.webp"
import { DarkCard } from '@/components/dark-card'
export default function About () {
    return (
        <div className='-z-20 relative bg-gradient-to-b from-bgpurple to-richpurple w-full h-auto overflow-x-clip' id='aboutTab'>
            <Image src={texture} className='-top-20 sm:-top-80 left-0 z-0 absolute min-w-[800px] sm:min-w-[1500px] max-w-[800px] sm:max-w-[2000px] h-auto object-cover' alt="bg" sizes="(min-width: 640px) 1500px, 800px"></Image>
            <Image src={cloudL} className='top-16 sm:top-0 md:-top-16 -left-5 absolute w-[90px] sm:w-48 md:w-72 2xl:w-96 h-auto animate-swaying ease-linear' alt="cloud" sizes="(min-width: 1540px) 384px, (min-width: 780px) 288px, (min-width: 640px) 192px, 90px"></Image>
            <Image src={cloudR} className='top-20 sm:top-10 md:top-2 -right-5 absolute w-28 sm:w-72 md:w-96 2xl:w-96 h-auto animate-swaying ease-linear' alt='cloud' sizes="(min-width: 780px) 384px, (min-width: 640px) 288px, 112px"></Image>
            <div className='flex flex-col justify-center items-center mx-auto py-20 w-[1000px] max-w-[90%] text-white align-center' >
                <div className='relative mb-4'>
                    <Title text="About HackCC"></Title>
                    <Image className='bottom-0 -left-1/2 absolute w-16 md:w-20 2xl:w-28 h-auto' src={ShootingStar} alt='Shooting Stars' sizes="(min-width: 1540px) 112px, (min-width: 780px) 80px, 64px"></Image>
                </div>
                <div className='z-10 my-2 sm:my-8 px-8 font-mont text-base sm:text-lg md:text-2xl 2xl:text-3xl sm:text-center'>
                    <p>A 250 person, 14 hour hackathon for <br className='hidden 2xl:hidden lg:inline' /> community college students across California.</p>
                </div>
                <div className='flex md:flex-row flex-col items-stretch gap-8 md:gap-16 mb-4 md:mb-0'>
                    <div className='w-full sm:w-1/2 font-mont'>
                        <DarkCard className='w-[325px] md:w-[325px] lg:w-[425px] h-full text-xs md:text-base 2xl:text-lg'>
                            <p>HackCC is California's statewide hackathon created for community college students, providing a platform to explore new technologies, build innovative projects, and collaborate with peers. <br /> <br /> Unlike university hackathons, HackCC bridges the gap for 250 students who often lack access to these opportunities, fostering an inclusive, hands-on environment where creativity and technology solves real-world problems.</p>
                        </DarkCard>
                    </div>
                    <div className='relative w-full sm:w-1/2 font-mont'>
                    <Image className='-top-1/4 sm:top-0 left-0 -z-10 absolute w-16 md:w-20 2xl:w-28 h-auto' src={Paw} alt='Paw' sizes="(min-width: 1540px) 112px, (min-width: 780px) 80px, 64px"></Image>
                    <DarkCard className='w-[325px] md:w-[325px] lg:w-[425px] h-full text-xs md:text-base 2xl:text-lg'>
                        <h1 className='z-10 font-medium text-sm sm:text-lg md:text-xl'>Event Features</h1>
                        <ul className='z-10 [&>*]:my-2 text-xs md:text-base 2xl:text-lg text-left'>
                            <li>• A welcoming environment for all skill levels — from beginner to expert</li>
                            <li>• Fun, collaborative, and supportive community of hackers</li>
                            <li>• Interesting and educational talks and workshops</li>
                            <li>• Fun mini-games, activities, and late-night snacks</li>
                            <li>• Opportunities to network with industry professionals and recruiters</li>
                        </ul>
                    </DarkCard>
                    </div>
                </div>
            </div>
        </div>
    )
}