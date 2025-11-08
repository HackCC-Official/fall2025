// --- Countdown Logic ---

import { Countdown } from "../types/attendee-dashboard";

export const calculateTimeLeft = (targetTime: number): Countdown | null => {
    const now = new Date().getTime();
    const difference = targetTime - now;

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