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
            <div className={` sm:flex hidden z-50 font-mont text-white fixed flex justify-center items-center p-3  w-screen l-0 t-0 [&>*]:mx-6 bg-glass backdrop-blur-md`}>
                <a onClick={() => {
                            smoothScroll("aboutTab");
                        }}>About</a>
                <a onClick={() => {
                            smoothScroll("venueTab");
                        }}>About</a>
                <a onClick={() => {
                            smoothScroll("involvedTab");
                        }}>GetInvolved</a>
                <ApplyButton text="Apply" size="sm" directory="/register"></ApplyButton>
            </div>
            <h1 className={`${isMenuOpen? 'text-black' : 'text-white'} fixed z-50 top-4 right-4 text-3xl sm:hidden flex`} onClick={() => {toggleMenu()}}>{isMenuOpen ? 'X' : '☰'}</h1>
            <div className={`${isMenuOpen? 'sm:hidden flex' : 'hidden'} font-mont top-0 left-0 fixed w-screen h-screen bg-white z-40 flex-col justify-center align-center items-center text-center [&>*]:my-2 [&>*]:whitespace-nowrap overflow-hidden`}>
            <a onClick={() => {
                        smoothScroll("aboutTab");
                        toggleMenu()
                    }}>About</a>
            <div className="h-[1px] w-16 bg-activeyellow"></div>
            <a onClick={() => {
                        smoothScroll("venueTab");
                        toggleMenu()
                    }}>Venue</a>
            <div className="h-[1px] w-16 bg-activeyellow"></div>
            <a onClick={() => {
                        smoothScroll("involvedTab");
                        toggleMenu()
                    }}>Get Involved</a>
            <div></div>
            <ApplyButton text="Apply" size="sm" directory="/register"></ApplyButton>
            </div>
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