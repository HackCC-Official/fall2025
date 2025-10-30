// --- Mock Data ---
// ... (mockUser and navItems are unchanged) ...

import { User } from "../types/attendee-dashboard";
import { Badge, CalendarDays, Timer, Bell, CircleUser, ScrollText, UserRoundPlus, } from "lucide-react";
import { NavItem } from "../types/attendee-dashboard";


export const mockUser: User = {
    username: 'hack-attendee-01',
    teamName: 'The Code Crusaders'
};

export const navItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: CircleUser },
    { id: 'hackpass', label: 'Hackpass', icon: Badge },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'deadlines', label: 'Deadlines', icon: Timer },
    { id: 'rules', label: 'Rules', icon: ScrollText },
    { id: 'teamup', label: 'Team Up', icon: UserRoundPlus },
];