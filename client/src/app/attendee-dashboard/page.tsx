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
    const [activeSection, setActiveSection] = useState('profile');
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

            <Sidebar
                activeSection={activeSection}
                setActiveSection={(section) => {
                    setActiveSection(section);
                    setIsSidebarOpen(false); // Close sidebar on mobile nav
                }}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <MainContent activeSection={activeSection} />
        </div>
    );
}
