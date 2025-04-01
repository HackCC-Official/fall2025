"use client"
import { ApplyButton } from "./applybutton"
import { useState } from "react";


export const Navbar = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const smoothScroll = (targetId: any) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    };

    return (
        <div>
            <div className={`text-base 2xl:text-xl sm:flex hidden z-50 font-mont text-white fixed flex justify-center items-center p-3  w-screen l-0 t-0 [&>*]:mx-6 bg-glass backdrop-blur-md [&>*]:cursor-pointer`}>
                <a onClick={() => {
                            smoothScroll("aboutTab");
                        }}>About</a>
                <a onClick={() => {
                            smoothScroll("workshopTab");
                        }}>FAQ</a>
                <a onClick={() => {
                            smoothScroll("scheduleTab");
                        }}>Schedule</a>
                <a onClick={() => {
                            smoothScroll("involvedTab");
                        }}>Get Involved</a>
                <ApplyButton text="Apply" size="sm" directory="/apply"></ApplyButton>
            </div>
            <div className={`${isMenuOpen? 'sm:hidden flex' : 'hidden'} font-mont top-0 left-0 fixed w-screen h-screen bg-white z-50 flex-col justify-center align-center items-center text-center [&>*]:my-2 [&>*]:whitespace-nowrap overflow-hidden`}>
            <a onClick={() => {
                smoothScroll("aboutTab");
                toggleMenu()
            }}>About</a>
            <div className="bg-activeyellow w-16 h-[1px]"></div>
            <a onClick={() => {
                        smoothScroll("workshopTab");
                        toggleMenu()
                        }}>FAQ</a>
            <div className="bg-activeyellow w-16 h-[1px]"></div>
            <a onClick={() => {
                        smoothScroll("scheduleTab");
                        toggleMenu()
                        }}>Schedule</a>
            <div className="bg-activeyellow w-16 h-[1px]"></div>
            <a onClick={() => {
                smoothScroll("involvedTab");
                toggleMenu()
            }}>Get Involved</a>
            <div></div>
            <ApplyButton text="Apply" size="sm" directory="/apply"></ApplyButton>
            </div>
            <h1 className={`${isMenuOpen? 'text-black' : 'text-white'} fixed z-50 top-4 right-4 text-3xl sm:hidden flex`} onClick={() => {toggleMenu()}}>{isMenuOpen ? 'X' : '☰'}</h1>
        </div>
    )
}

/*

<a onClick={() => {
                        smoothScroll("aboutTab");
                        toggleMenu()
                    }}>About</a>
            <a onClick={() => {
                        smoothScroll("VenueTab");
                        toggleMenu()
                    }}>About</a>
            <a onClick={() => {
                        smoothScroll("InvolvedTab");
                        toggleMenu()
                    }}>GetInvolved</a>

*/