import { LucideIcon } from "lucide-react";

export interface User {
    username: string;
    teamName: string | null;
};

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
};

export interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};
