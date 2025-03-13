import React from 'react'

export default function About () {
    return (
        <div className='w-screen py-20 flex flex-col justify-center align-center items-center text-white'>
            <div className='font-bagel text-2xl sm:text-3xl md:text-4xl mb-4'>
                <h1>About HackCC</h1>
            </div>
            <div className='font-mont text-center text-sm sm:text-lg md:text-xl'>
                <p>A 250 person, 36 hour hackathon for community college students <br /> across California, hosted at Foothill College in Los Altos Hills, CA</p>
            </div>
            <div>
                <div className='font-mont text-sm w-1/2'>
                    <p>HackCC is California's statewide hackathon created for community college students, providing a platform to explore new technologies, build innovative projects, and colloborate with peers. Unlike university hackathons, HackCC bridges the gap for 250 students who often lack access to these opportunities, fostering an inclusive, hands-on environment where creativity and technology solve real-world problems.</p>
                </div>
            </div>
        </div>
    )
}
