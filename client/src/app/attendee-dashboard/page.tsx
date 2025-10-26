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
type User = {
    username: string;
    teamName: string | null;
};

type NavItem = {
    id: string;
    label: string;
    icon: React.ElementType;
};

type Countdown = {
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
const QRCodeSection: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div className="flex flex-col items-center p-6 sm:p-8">
            {/* QR Code Placeholder */}
            <div className="bg-white rounded-xl p-4 shadow-inner">
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
                    {/* Placeholder for QR Code image */}
                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 17h2v-2h-2v2zm0-4h2v-2h-2v2zm4 0h2v-2h-2v2zm0 4h2v-2h-2v2zM5 19h2v-2H5v2zm0-4h2v-2H5v2zm0-4h2v-2H5v2zm0-4h2V5H5v2zm8-2v2h2V5h-2zm-4 0v2h2V5H9zm8 0v2h2V5h-2zM3 3h8v8H3V3zm2 2h4v4H5V5zm12-2v8h-8V3h8zm-2 2h-4v4h4V5zM3 13h8v8H3v-8zm2 2h4v4H5v-4zm12-2v8h-8v-8h8zm-2 2h-4v4h4v-4z"/>
                    </svg>
                </div>
            </div>

            {/* User Info */}
            <h2 className="text-3xl font-bold mt-6 text-white tracking-tight font-mont">
                {user.username}
            </h2>
            <p className="text-xl text-yellow-400 font-medium font-mont">
                {user.teamName || 'Solo Hacker'}
            </p>
        </div>
    );
};

/**
 * Hack Pass Section
 */
// ... (HackPassSection component is unchanged) ...
const HackPassSection: React.FC = () => {
    return (
        <div>
            {/* This h1 is just for the text, and it's correct as-is! */}
            <h1 className="text-white mb-8 font-mont text-2xl sm:text-3xl md:text-4xl">
                Your Hack Pass
            </h1>
            <div className="max-w-md mx-auto bg-gradient-to-br from-[#4A376B] to-[#5C4580] rounded-3xl shadow-2xl overflow-hidden border border-[#523B75]">
                {/* Badge Header */}
                <div className="p-6 bg-[#5C4580]/50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white font-mont">HackCC 2025</h3>
                        <span className="px-3 py-1 bg-yellow-400 text-black text-sm font-semibold rounded-full font-mont">
                            Attendee
                        </span>
                    </div>
                </div>

                {/* QR Code and User Info */}
                <QRCodeSection user={mockUser} />

                {/* Pass Footer / Actions */}
                <div className="p-6 bg-[#5C4580]/50 border-t border-[#523B75]">
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 font-mont">
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
const ScheduleSection: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 font-mont">Event Schedule</h1>
            <div className="p-8 bg-[#4A376B] rounded-lg shadow-lg border border-[#523B75]">
                <h2 className="text-2xl text-gray-300 text-center font-mont">
                    Schedule coming soon!
                </h2>
                <p className="text-gray-400 text-center mt-4 font-mont">
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
const DeadlinesSection: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<Countdown | null>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(timer);
    }, []);

    const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
        <div className="flex flex-col items-center justify-center bg-[#4A376B] p-6 rounded-lg shadow-lg min-w-[100px] border border-[#523B75]">
            <span className="text-5xl font-bold text-yellow-400 font-mont">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="text-sm font-medium text-gray-400 uppercase mt-2 font-mont">
                {label}
            </span>
        </div>
    );

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 font-mont">Project Deadlines</h1>

            <div className="p-8 bg-[#523B75] rounded-lg shadow-lg">
                <h2 className="text-2xl text-white font-semibold text-center mb-6 font-mont">
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
                    <div className="text-center p-6 bg-[#4A376B] rounded-lg">
                        <h3 className="text-3xl font-bold text-red-500 font-mont">
                            The deadline has passed!
                        </h3>
                        <p className="text-gray-300 mt-2 font-mont">
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
const RemindersSection: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 font-mont">Reminders</h1>
            <div className="p-8 bg-[#4A376B] rounded-lg shadow-lg border border-[#523B75]">
                <h2 className="text-2xl text-gray-300 text-center font-mont">
                    No active reminders.
                </h2>
                <p className="text-gray-400 text-center mt-4 font-mont">
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
const RulesSection: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 font-mont">Rules, Team-Up & Judging</h1>
            <div className="space-y-6">
                <div className="p-8 bg-[#4A376B] rounded-lg shadow-lg border border-[#523B75]">
                    <h2 className="text-2xl text-white font-semibold mb-4 font-mont">
                        Hackathon Rules
                    </h2>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 font-mont">
                        <li>Teams must be between 1-4 members.</li>
                        <li>All code must be written during the hackathon.</li>
                        <li>Be respectful to all attendees, mentors, and staff. (Code of Conduct)</li>
                        <li>Have fun and build something awesome!</li>
                    </ul>
                </div>
                <div className="p-8 bg-[#4A376B] rounded-lg shadow-lg border border-[#523B75]">
                    <h2 className="text-2xl text-white font-semibold mb-4 font-mont">
                        Team Formation
                    </h2>
                    <p className="text-gray-300 font-mont">
                        Looking for a team? Head over to the HackCC discord server (or utilize our QR code feature)
                    </p>
                </div>
                <div className="p-8 bg-[#4A376B] rounded-lg shadow-lg border border-[#523B75]">
                    <h2 className="text-2xl text-white font-semibold mb-4 font-mont">
                        Judging Criteria
                    </h2>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 font-mont">
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
const Sidebar: React.FC<{
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
}> = ({ activeSection, setActiveSection, isOpen }) => {
    
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
            {/* <Logo className="h-20 w-auto mx-auto" /> */}
            
            {/* Added a spacer div to maintain some top padding */}
            <div className="h-20 w-auto mx-auto" /> 
            
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
const MainContent: React.FC<{ activeSection: string }> = ({ activeSection }) => {
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
            className="flex flex-col md:flex-row min-h-screen"
            style={{
                backgroundImage: 'url("/Hero%20Background.webp")', // <-- This line is changed
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Mobile Header */}
            <header className="md:hidden w-full bg-[#4A376B] p-4 flex justify-between items-center border-b border-[#523B75]">
                <div className="flex items-center gap-2">
                    {/* --- CHANGE 1 (Mobile): Logo component removed --- */}
                    <div className="w-8 h-8 flex items-center justify-center">
                        {/* <Logo className="w-full h-full object-contain" /> */}
                    </div>
                    <h2 className="text-xl font-bold text-white font-mont">HackCC</h2>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-gray-300 hover:text-white p-2"
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
