// --- Mock Data ---
// ... (mockUser and navItems are unchanged) ...

import { User } from "../types/attendee-dashboard";
import { Badge, CalendarDays, Timer, Bell, CircleUser, ScrollText, UserRoundPlus, } from "lucide-react";
import { NavItem } from "../types/attendee-dashboard";


export const mockUser: User = {
    username: 'hack-attendee-01',
    teamName: '-'
};

export const navItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: CircleUser },
    { id: 'deadlines', label: 'Deadlines', icon: Timer },
    { id: 'team-up', label: 'Team Up', icon: UserRoundPlus },
];