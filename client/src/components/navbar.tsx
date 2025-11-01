"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { useAuthentication } from "@/features/auth/hooks/use-authentication";
import { getHackathonApplicationByUserId } from "@/features/application/api/hackathon-application";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountById } from "@/features/account/api/account";
import { ApplicationStatus } from "@/features/application/types/status.enum";
import { AccountRoles } from "@/features/account/types/account-dto";


export const Navbar = () => {
    const queryClient = useQueryClient()
    const supabase = getBrowserClient();
    const router = useRouter()
    const { user, setUser, authCheck } = useAuthentication({ redirect: false });
    const accountId = user && user.id
    const isLoggedIn = authCheck && !!user;

    const accountQuery = useQuery({
        queryKey: ['account'],
        queryFn: () => getAccountById(accountId || ''),
        enabled: isLoggedIn 
    })
    
    const applicationQuery = useQuery({
        queryKey: ['application', accountId],
        queryFn: () => getApplicationByUserId(accountId || ''),
        enabled: !!accountId
    });

    const [isMenuOpen, setMenuOpen] = useState(false);
    
    const accountRoles = accountQuery.data && accountQuery.data.roles
    const isPartOfOrg = accountRoles?.includes(AccountRoles.ADMIN) || 
        accountRoles?.includes(AccountRoles.ORGANIZER) || 
        accountRoles?.includes(AccountRoles.JUDGE);
    const isAccepted = !isLoggedIn  || (isLoggedIn  && applicationQuery.data?.status === ApplicationStatus.ACCEPTED);
    const showOrgDashboard = isLoggedIn && isPartOfOrg;
    const showAttendeeDashboard = isLoggedIn && !isPartOfOrg && isAccepted
    const showSignout = isLoggedIn;

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const smoothScroll = (targetId: any) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    };


    async function login() {
        router.push('/login')
      }

    async function signOut() {
        setUser(null)
        toggleMenu()
        const { error } = await supabase.auth.signOut()
        queryClient.invalidateQueries({
            queryKey: ['account', 'hackathon']
        })
      }


    return (
        <div className="z-[100]">
            <div className={`text-base 2xl:text-xl lg:flex z-50 font-mont text-white fixed hidden justify-center items-center p-3  w-screen l-0 t-0 [&>*]:mx-6 bg-glass backdrop-blur-md [&>*]:cursor-pointer`}>
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
                <div className="space-x-4">
                {!isLoggedIn && <a onClick={login}>Login</a>}
                {showOrgDashboard && <DashboardButton />}
                {showAttendeeDashboard && <AttendeeDashboardButton/>}
                {showSignout && <a onClick={signOut}>Sign out</a>}
                </div>
            </div>
            <div className={`${isMenuOpen? 'lg:hidden flex' : 'hidden'} font-mont top-0 left-0 fixed w-screen h-screen bg-white z-50 flex-col justify-center align-center items-center text-center [&>*]:my-2 [&>*]:whitespace-nowrap overflow-hidden`}>
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
                <div className="bg-activeyellow w-16 h-[1px]"></div>
                {!isLoggedIn && <a onClick={login}>Login</a>}
                {showOrgDashboard && <DashboardButton />}
                {showAttendeeDashboard && <AttendeeDashboardButton/>}
                {showSignout && <a onClick={signOut}>Sign out</a>}
            </div>
            <h1 className={`${isMenuOpen? 'text-black' : 'text-white'} fixed z-50 top-4 right-4 text-3xl lg:hidden flex`} onClick={() => {toggleMenu()}}>{isMenuOpen ? 'X' : '☰'}</h1>
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

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react'
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { getApplicationByUserId } from "@/features/application/api/application";

export const NavigationButton = (props: any) => {
    const { text, size, directory, to } = props;
    const router = useRouter();
    
    let sizing = "";
    let newWindow = '';
    
    switch (size) {
        case "sm":
            sizing = 'py-1.5 px-8'
            break;
        case "md":
            sizing = 'py-3 px-6 md:px-10 lg:py-2 lg:px-10 text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] xl:text-[1rem] mt-8'
            newWindow = '_blank'
            break;
        case "lg":
            sizing = 'py-3 px-6 md:px-10 lg:py-4 lg:px-14 text-[0.6rem] md:text-[0.8rem] lg:text-[1.2rem] xl:text-[1.3rem] mt-8'
            break;
        case "xl":
            sizing = 'py-3 px-10 lg:py-4 lg:px-14 text-lg sm:text-xl md:text-2xl z-10'
    }

    const handleClick = (e: React.MouseEvent) => {
        if (to) {
            e.preventDefault();
            router.push(to);
        }
        // For directory (external links), let the default anchor behavior handle it
    };

    return (
        <a 
            href={to || directory} 
            target={newWindow} 
            onClick={handleClick}
            className={cn([
                sizing,
                'cursor-pointer font-mont rounded-[30px] font-extrabold text-hoverpurple active:bg-activeyellow bg-vibrantyellow',
            ])}
        >
            {text}
        </a>
    );
}

export function ApplyButton({ text = 'Apply', size = 'sm', bypassDisable = false, to='/apply', className } 
    : { text?: string, size?: string, bypassDisable?: boolean, to?: string | undefined, className?: string }) {
   return (
     <NavigationButton 
     className={className}
     text={text} 
     size={size} 
     directory={to}
     bypassDisable={bypassDisable}
     ></NavigationButton>
   )
}

function DashboardButton({ className } : { className?: string }) {
   return (
     <NavigationButton className={className} text="Dashboard" size="sm" directory="/panel"></NavigationButton>
   )
}


function AttendeeDashboardButton({ className } : { className?: string }) {
   return (
     <NavigationButton className={className} text="Dashboard" size="sm" directory="/attendee-dashboard"></NavigationButton>
   )
}