'use client'

import Nav  from "../../components/sponser/nav"
import { useFormState } from "react-dom";
import { useState } from "react";

export default function SponserPage() {
        const text = "HackCC wouldn’t be possible without the support of our incredible sponsors. As the first hackathon created by and for California Community College students, we’re dedicated to fostering innovation, accessibility, and career opportunities for aspiring developers. With your support, we can empower the next generation of tech talent and scale innovation like never before!"
        const handleSubmit = (event) => {
            event.preventDefault();
            console.log("test result")
        }
    return(
        <main>
            <div className="flex flex-wrap w-screen h-screen">
                <Nav></Nav>
                <div className="flex flex-wrap md:flex-nowrap md:gap-x-10 mx-auto mt-40 w-[90%] lg:w-[80%] min-w-[200px] max-w-[1600px] h-auto">
                    <div className="font-mont text-white md:basis-1/2">
                        <h1 className="mb-4 font-bagel text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl">Sponser Us</h1>
                        <h2 className="text-base sm:text-lg md:text-2xl 2xl:text-3xl">Hey there!</h2>
                        <p className="my-2 text-xs md:text-base 2xl:text-lg">{text}</p>
                        <h1 className="text-base sm:text-lg md:text-2xl 2xl:text-3xl">As a sponsor, you'll be able to:</h1>
                        <ul className="my-2 pl-6 text-xs md:text-base 2xl:text-lg list-disc">
                            <li>Support ambitious students from underserved backgrounds with career-defining opportunities</li>
                            <li>Introduce your product, platform, or API to a diverse group of student developers</li>
                            <li>Increase your brand’s visibility through HackCC’s marketing and social medias</li>
                        </ul>
                        <p className="mt-6 font-black text-xs md:text-base 2xl:text-lg">Interested in sponsoring? Fill out this contact form, and our team will be in touch with more details!</p>
                    </div>
                    <div className="flex justify-center bg-gray-400 rounded-4xl w-full h-auto md:basis-1/2">
                        <form className="flex flex-col items-start px-4 w-[90%] md:w-[80%] font-mont text-base sm:text-base xl:text-xl" onSubmit={handleSubmit} autoComplete="on">
                            <label htmlFor="fname " className="mt-14 mb-4">Full Name</label>
                            <input type="text" id="fname" className="rounded-md w-full h-12"></input>
                            <label htmlFor="company" className="mt-6 mb-4">Company</label>
                            <input type="text" id="company" className="rounded-md w-full h-12"></input>
                            <label htmlFor="email" className="mt-6 mb-4">Email</label>
                            <input type="text" id="email" className="rounded-md w-full h-12"></input>
                            <label htmlFor="inquiry" className="mt-4 mb-2">Inquiry</label>
                            <input type="text" id="inquiry" className="rounded-md w-full h-48"></input>
                            <button type="submit" className="bg-white my-12 px-8 py-2 rounded-md">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <footer className="w-full h-40"></footer>
        </main>
    )
}