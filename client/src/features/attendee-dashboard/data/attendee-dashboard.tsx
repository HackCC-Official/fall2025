// --- Mock Data ---
// ... (mockUser and navItems are unchanged) ...

import { User } from "../types/attendee-dashboard";
import { Badge, CalendarDays, Timer, Bell, ScrollText } from "lucide-react";
import { NavItem } from "../types/attendee-dashboard";


export const mockUser: User = {
    username: 'hack-attendee-01',
    teamName: 'The Code Crusaders'
};

export const navItems: NavItem[] = [
    { id: 'hackpass', label: 'Hack Pass', icon: Badge },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'deadlines', label: 'Deadlines', icon: Timer },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'rules', label: 'Rules & Team-Up', icon: ScrollText },
];