"use client";
import { useState, useEffect } from "react";
import { Countdown } from "../types/attendee-dashboard";
import { calculateTimeLeft } from "../utils/deadline";

export function DeadlinesSection() {
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
