"use client"; // This directive is necessary for Next.js App Router to use hooks

import React, { useState, useEffect } from 'react';
// --- LOGO IMPORT REMOVED ---
// import { Logo } from "@/components/logo"; 

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

// --- Type Definitions ---
// ... (rest of the type definitions are unchanged) ...
interface User {
    username: string;
    teamName: string | null;
};

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
};

interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

// --- Mock Data ---
// ... (mockUser and navItems are unchanged) ...
const mockUser: User = {
    username: 'hack-attendee-01',
    teamName: 'The Code Crusaders'
};

const navItems: NavItem[] = [
    { id: 'hackpass', label: 'Hack Pass', icon: Badge },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'deadlines', label: 'Deadlines', icon: Timer },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'rules', label: 'Rules & Team-Up', icon: ScrollText },
];

// --- Countdown Logic ---
// ... (HACKATHON_DEADLINE and calculateTimeLeft are unchanged) ...
const HACKATHON_DEADLINE = new Date('2025-11-09T12:00:00').getTime();

const calculateTimeLeft = (): Countdown | null => {
    const now = new Date().getTime();
    const difference = HACKATHON_DEADLINE - now;

    if (difference <= 0) {
        return null; // Deadline has passed
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
};

// --- Sub-Components ---
/**
 * QR Code Section
 */
// ... (QRCodeSection component is unchanged) ...
function QRCodeSection ({ user } : { user: User }) {
    return (
        <div className="flex flex-col items-center p-6 sm:p-8">
            {/* QR Code Placeholder */}
            <div className="bg-white shadow-inner p-4 rounded-xl">
                <div className="flex justify-center items-center bg-gray-100 rounded-lg w-40 sm:w-48 h-40 sm:h-48 text-gray-400">
                    {/* Placeholder for QR Code image */}
                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 17h2v-2h-2v2zm0-4h2v-2h-2v2zm4 0h2v-2h-2v2zm0 4h2v-2h-2v2zM5 19h2v-2H5v2zm0-4h2v-2H5v2zm0-4h2v-2H5v2zm0-4h2V5H5v2zm8-2v2h2V5h-2zm-4 0v2h2V5H9zm8 0v2h2V5h-2zM3 3h8v8H3V3zm2 2h4v4H5V5zm12-2v8h-8V3h8zm-2 2h-4v4h4V5zM3 13h8v8H3v-8zm2 2h4v4H5v-4zm12-2v8h-8v-8h8zm-2 2h-4v4h4v-4z"/>
                    </svg>
                </div>
            </div>

            {/* User Info */}
            <h2 className="mt-6 font-mont font-bold text-white text-3xl tracking-tight">
                {user.username}
            </h2>
            <p className="font-mont font-medium text-yellow-400 text-xl">
                {user.teamName || 'Solo Hacker'}
            </p>
        </div>
    );
};

/**
 * Hack Pass Section
 */
// ... (HackPassSection component is unchanged) ...
function HackPassSection() {
    return (
        <div>
            {/* This h1 is just for the text, and it's correct as-is! */}
            <h1 className="mb-8 font-mont text-white text-2xl sm:text-3xl md:text-4xl">
                Your Hack Pass
            </h1>
            <div className="bg-gradient-to-br from-[#4A376B] to-[#5C4580] shadow-2xl mx-auto border border-[#523B75] rounded-3xl max-w-md overflow-hidden">
                {/* Badge Header */}
                <div className="bg-[#5C4580]/50 p-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-mont font-bold text-white text-2xl">HackCC 2025</h3>
                        <span className="bg-yellow-400 px-3 py-1 rounded-full font-mont font-semibold text-black text-sm">
                            Attendee
                        </span>
                    </div>
                </div>

                {/* QR Code and User Info */}
                <QRCodeSection user={mockUser} />

                {/* Pass Footer / Actions */}
                <div className="bg-[#5C4580]/50 p-6 border-[#523B75] border-t">
                    <button className="flex justify-center items-center gap-2 bg-yellow-400 hover:bg-yellow-500 focus:ring-opacity-50 shadow-md px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full font-mont font-semibold text-black transition-all">
                        <Download size={18} />
                        Download Pass
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Schedule Section
 */
// ... (ScheduleSection component is unchanged) ...
function ScheduleSection() {
    return (
        <div>
            <h1 className="mb-8 font-mont font-bold text-white text-4xl">Event Schedule</h1>
            <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                <h2 className="font-mont text-gray-300 text-2xl text-center">
                    Schedule coming soon!
                </h2>
                <p className="mt-4 font-mont text-gray-400 text-center">
                    We're finalizing the event timings. Check back here for updates on workshops, keynotes, and meals!
                </p>
            </div>
        </div>
    );
};

/**
 * Deadlines Section
 */
// ... (DeadlinesSection component is unchanged) ...
function DeadlinesSection() {
    const [timeLeft, setTimeLeft] = useState<Countdown | null>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(timer);
    }, []);

    const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
        <div className="flex flex-col justify-center items-center bg-[#4A376B] shadow-lg p-6 border border-[#523B75] rounded-lg min-w-[100px]">
            <span className="font-mont font-bold text-yellow-400 text-5xl">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="mt-2 font-mont font-medium text-gray-400 text-sm uppercase">
                {label}
            </span>
        </div>
    );

    return (
        <div>
            <h1 className="mb-8 font-mont font-bold text-white text-4xl">Project Deadlines</h1>

            <div className="bg-[#523B75] shadow-lg p-8 rounded-lg">
                <h2 className="mb-6 font-mont font-semibold text-white text-2xl text-center">
                    Time Until Project Submissions Close
                </h2>

                {timeLeft ? (
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        <TimeBlock value={timeLeft.days} label="Days" />
                        <TimeBlock value={timeLeft.hours} label="Hours" />
                        <TimeBlock value={timeLeft.minutes} label="Minutes" />
                        <TimeBlock value={timeLeft.seconds} label="Seconds" />
                    </div>
                ) : (
                    <div className="bg-[#4A376B] p-6 rounded-lg text-center">
                        <h3 className="font-mont font-bold text-red-500 text-3xl">
                            The deadline has passed!
                        </h3>
                        <p className="mt-2 font-mont text-gray-300">
                            We hope you had a great time hacking.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Reminders Section
 */
// ... (RemindersSection component is unchanged) ...
function RemindersSection() {
    return (
        <div>
            <h1 className="mb-8 font-mont font-bold text-white text-4xl">Reminders</h1>
            <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                <h2 className="font-mont text-gray-300 text-2xl text-center">
                    No active reminders.
                </h2>
                <p className="mt-4 font-mont text-gray-400 text-center">
                    We'll post important announcements and reminders here.
                </p>
            </div>
        </div>
    );
};

/**
 * Rules & Team-Up Section
 */
// ... (RulesSection component is unchanged) ...
function RulesSection() {
    return (
        <div>
            <h1 className="mb-8 font-mont font-bold text-white text-4xl">Rules, Team-Up & Judging</h1>
            <div className="space-y-6">
                <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                    <h2 className="mb-4 font-mont font-semibold text-white text-2xl">
                        Hackathon Rules
                    </h2>
                    <ul className="space-y-2 font-mont text-gray-300 list-disc list-inside">
                        <li>Teams must be between 1-4 members.</li>
                        <li>All code must be written during the hackathon.</li>
                        <li>Be respectful to all attendees, mentors, and staff. (Code of Conduct)</li>
                        <li>Have fun and build something awesome!</li>
                    </ul>
                </div>
                <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                    <h2 className="mb-4 font-mont font-semibold text-white text-2xl">
                        Team Formation
                    </h2>
                    <p className="font-mont text-gray-300">
                        Looking for a team? Head over to the HackCC discord server (or utilize our QR code feature)
                    </p>
                </div>
                <div className="bg-[#4A376B] shadow-lg p-8 border border-[#523B75] rounded-lg">
                    <h2 className="mb-4 font-mont font-semibold text-white text-2xl">
                        Judging Criteria
                    </h2>
                    <ul className="space-y-2 font-mont text-gray-300 list-disc list-inside">
                        <li><span className="font-semibold">Technology:</span> Technical complexity and quality of the hack.</li>
                        <li><span className="font-semibold">Design:</span> UI/UX and overall user experience.</li>
                        <li><span className="font-semibold">Innovation:</span> Originality and creativity of the idea.</li>
                        <li><span className="font-semibold">Completion:</span> How much of the project was completed.</li>
                        <li><span className="font-semibold">Presentation:</span> Clarity and quality of the demo.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

/**
 * Sidebar Component
 */
function Sidebar({ activeSection, setActiveSection, isOpen } : {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
}) {
    
    const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
        const isActive = activeSection === item.id;
        return (
            <button
                onClick={() => setActiveSection(item.id)}
                className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all
                    ${isActive
                        ? 'bg-yellow-400 text-black shadow-lg'
                        : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                    }
                `}
            >
                <item.icon size={20} />
                <span>{item.label}</span>
            </button>
        );
    };

    return (
        <aside className={`
            ${isOpen ? 'block' : 'hidden'} md:block
            w-full md:w-64 bg-purple-950 text-white p-6 
            flex-shrink-0 flex flex-col gap-6 
            border-b md:border-b-0 md:border-r border-purple-700
        `}>
            
            {/* --- CHANGE 1: Logo component removed --- */}
            {/* <Logo className="mx-auto w-auto h-20" /> */}
            
            {/* Added a spacer div to maintain some top padding */}
            <div className="mx-auto w-auto h-20" /> 
            
            <nav className="flex flex-col gap-4 mt-2"> 
                {navItems.map(item => (
                    <NavLink key={item.id} item={item} />
                ))}
            </nav>
        </aside>
    );
};

/**
 * Main Content Area
 */
function MainContent({ activeSection } : { activeSection: string }) {
    const renderSection = () => {
        switch (activeSection) {
            case 'hackpass':
                return <HackPassSection />;
            case 'schedule':
                return <ScheduleSection />;
            case 'deadlines':
                return <DeadlinesSection />;
            case 'reminders':
                return <RemindersSection />;
            case 'rules':
                return <RulesSection />;
            default:
                return <HackPassSection />;
        }
    };

    return (
        <main className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ maxHeight: '100vh' }}>
            {renderSection()}
        </main>
    );
};

/**
 * Main Dashboard Page Component
 */
export default function AttendeeDashboardPage() {
    const [activeSection, setActiveSection] = useState('hackpass');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        // --- CHANGE: Removed /hero from the path and added %20 for the space ---
        <div 
            className="flex md:flex-row flex-col min-h-screen"
            style={{
                backgroundImage: 'url("/Hero%20Background.webp")', // <-- This line is changed
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Mobile Header */}
            <header className="md:hidden flex justify-between items-center bg-[#4A376B] p-4 border-[#523B75] border-b w-full">
                <div className="flex items-center gap-2">
                    {/* --- CHANGE 1 (Mobile): Logo component removed --- */}
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
