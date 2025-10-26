
export interface User {
    username: string;
    teamName: string | null;
};

export interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
};

export interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};
