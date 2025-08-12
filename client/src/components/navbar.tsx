"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApplyButton } from "./applybutton"
import { useState } from "react";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { Separator } from "./ui/separator";


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
        <div className="z-[100]">
            <div className={`text-base 2xl:text-xl sm:flex z-50 font-mont text-white fixed hidden justify-center items-center p-3  w-screen l-0 t-0 [&>*]:mx-6 bg-glass backdrop-blur-md [&>*]:cursor-pointer`}>
                <a onClick={() => {
                            smoothScroll("involvedTab");
                        }}>Get Involved</a>
                <a onClick={() => {
                            smoothScroll("aboutTab");
                        }}>About</a>
                <a onClick={() => {
                            smoothScroll("workshopTab");
                        }}>FAQ</a>
                <a onClick={() => {
                            smoothScroll("scheduleTab");
                        }}>Schedule</a>
                <a href="/sponsor">Sponsor us</a>
                {/* <ApplyButton text="Apply" size="sm" directory="/apply"></ApplyButton> */}
            </div>
            <div className={`${isMenuOpen? 'sm:hidden flex' : 'hidden'} font-mont top-0 left-0 fixed w-screen h-screen bg-white z-50 flex-col justify-center align-center items-center text-center [&>*]:my-2 [&>*]:whitespace-nowrap overflow-hidden`}>
            <a onClick={() => {
                smoothScroll("involvedTab");
                toggleMenu()
            }}>Get Involved</a>
            <div className="bg-activeyellow w-16 h-[1px]"></div>
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
            <a href="/sponsor">Sponsor us</a>
            <div className="bg-activeyellow w-16 h-[1px]"></div>
            <a target='_blank' href="https://discord.gg/yRShGV7Py4"><FontAwesomeIcon className="mr-2" icon={faDiscord} />  Discord Server</a>
            <div></div>
            {/* <ApplyButton text="Apply" size="sm" directory="/apply"></ApplyButton> */}
            </div>
            <h1 className={`${isMenuOpen? 'text-black' : 'text-white'} fixed z-50 top-4 right-4 text-3xl sm:hidden flex`} onClick={() => {toggleMenu()}}>{isMenuOpen ? 'X' : '☰'}</h1>
            <a className='bottom-4 left-4 z-[100] fixed !fill-white w-12 h-12 !text-white' target='_blank' href="https://discord.gg/yRShGV7Py4"><FontAwesomeIcon className="w-full h-full text-white" icon={faDiscord} /></a>
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