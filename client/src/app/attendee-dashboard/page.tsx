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

import { DeadlinesSection } from '@/features/attendee-dashboard/components/deadlines-section';  
import { HackPassSection } from '@/features/attendee-dashboard/components/hack-pass-section';
import { MainContent } from '@/features/attendee-dashboard/components/main-content';
import { QRCodeSection } from '@/features/attendee-dashboard/components/qr-code-section';
import { RemindersSection } from '@/features/attendee-dashboard/components/reminders-section';
import { RulesSection } from '@/features/attendee-dashboard/components/rules-section';
import { ScheduleSection } from '@/features/attendee-dashboard/components/schedule-section';
import { Sidebar } from '@/features/attendee-dashboard/components/sidebar';



export default function AttendeeDashboardPage() {
    const [activeSection, setActiveSection] = useState('hackpass');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div 
            className="flex md:flex-row flex-col min-h-screen"
            style={{
                backgroundImage: 'url("/Hero%20Background.webp")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
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
