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
import { useAuthentication } from '@/features/auth/hooks/use-authentication';
import { useQuery } from '@tanstack/react-query';
import { getApplicationByUserId } from '@/features/application/api/application';
import { useRouter } from 'next/navigation';
import { ApplicationStatus } from '@/features/application/types/status.enum';
import { FrontPageSecondaryLayout } from '@/layouts/front-page-layout';
import { getHackathonApplicationByUserId } from '@/features/application/api/hackathon-application';

export default function AttendeeDashboardPage() {
    const router = useRouter();
    const { user, authCheck } = useAuthentication();
    const accountId = user && user.id;
    
    // FIX 1: Corrected query key syntax - should be array
    const applicationQuery = useQuery({
        queryKey: ['application', accountId],
        queryFn: () => getHackathonApplicationByUserId(accountId || ''),
        enabled: !!accountId // FIX 2: Remove function wrapper
    });
    
    const [activeSection, setActiveSection] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // FIX 3: Move all navigation to useEffect to avoid SSR issues
    useEffect(() => {
        if (authCheck && !user) {
            router.push('/');
            return;
        }

        if (applicationQuery.error) {
            router.push('/');
            return;
        }

        if (applicationQuery.data && 
            [ApplicationStatus.SUBMITTED, ApplicationStatus.DENIED, ApplicationStatus.NOT_AVAILABLE].includes(applicationQuery.data.status)) {
            console.log('Redirecting due to application status:', applicationQuery.data.status);
            router.push('/');
        }
    }, [authCheck, user, applicationQuery.isLoading, applicationQuery.data, router]);

    // Show loading state
    if (authCheck && !user) {
        return <FrontPageSecondaryLayout />;
    }

    if (applicationQuery.isLoading) {
        return <FrontPageSecondaryLayout />;
    }

    if (!applicationQuery.data) {
        return <FrontPageSecondaryLayout />;
    }

    if ([ApplicationStatus.SUBMITTED, ApplicationStatus.DENIED, ApplicationStatus.NOT_AVAILABLE].includes(applicationQuery.data.status)) {
        return <FrontPageSecondaryLayout />;
    }

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
                    setIsSidebarOpen(false);
                }}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <MainContent activeSection={activeSection} />
        </div>
    );
}