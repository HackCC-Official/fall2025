"use client"; 

import React, { useState, useEffect } from 'react';


import {
    Badge,
    CalendarDays,
    Timer,
    Bell,
    ScrollText,
    Users,
    Download,
    Menu,
    X
} from 'lucide-react';

import { MainContent } from '@/features/attendee-dashboard/components/main-content';
import { Sidebar } from '@/features/attendee-dashboard/components/sidebar';
import { SkyFixed } from '@/components/sky';

export default function AttendeeDashboardPage() {
    const [activeSection, setActiveSection] = useState('hackpass');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div 
            className="flex md:flex-row flex-col min-h-screen"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <SkyFixed />
            {/* Mobile Header */}
            <header className="md:hidden flex justify-between items-center bg-[#4A376B] p-4 border-[#523B75] border-b w-full">
                <div className="flex items-center gap-2">
                    <div className="flex justify-center items-center w-8 h-8">
                        {/* <Logo className="w-full h-full object-contain" /> */}
                    </div>
                    <h2 className="font-mont font-bold text-white text-xl">HackCC</h2>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-300 hover:text-white"
                >
                    {isSidebarOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
                </button>
            </header>

            <Sidebar
                activeSection={activeSection}
                setActiveSection={(section) => {
                    setActiveSection(section);
                    setIsSidebarOpen(false); // Close sidebar on mobile nav
                }}
                isOpen={isSidebarOpen}
            />
            <MainContent activeSection={activeSection} />
        </div>
    );
}
