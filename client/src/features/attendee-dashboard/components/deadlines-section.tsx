"use client";
import { useState, useEffect } from "react";
import { Countdown } from "../types/attendee-dashboard";
import { calculateTimeLeft } from "../utils/deadline";

const HACKATHON_START_TIME = new Date('2025-11-08T08:00:00').getTime();
const PROJECT_SUBMISSION_DEADLINE = new Date('2025-11-08T22:00:00').getTime();

// --- Labels ---
const START_LABEL = "Get ready, Hackathon starts in";
const SUBMISSION_LABEL = "Time Until Project Submissions";
const PASSED_LABEL = "The deadline has passed!";

export function DeadlinesSection() {
    const [timeLeft, setTimeLeft] = useState<Countdown | null>(null);
    const [deadlineLabel, setDeadlineLabel] = useState<string>(START_LABEL);
    const [isOver, setIsOver] = useState<boolean>(false);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();

            if (now < HACKATHON_START_TIME) {
                // 1. Before Hackathon starts
                setDeadlineLabel(START_LABEL);
                setTimeLeft(calculateTimeLeft(HACKATHON_START_TIME));
                setIsOver(false);
            } else if (now < PROJECT_SUBMISSION_DEADLINE) {
                // 2. After Hackathon starts, before submission deadline
                setDeadlineLabel(SUBMISSION_LABEL);
                setTimeLeft(calculateTimeLeft(PROJECT_SUBMISSION_DEADLINE));
                setIsOver(false);
            } else {
                // 3. After submission deadline
                setDeadlineLabel(PASSED_LABEL);
                setTimeLeft(null);
                setIsOver(true);
            }
        };

        // Call it once immediately to avoid a flash of incorrect content
        updateCountdown();

        // Then set the interval to update every second
        const timer = setInterval(updateCountdown, 1000);

        // Clear interval when component is removed from the DOM
        return () => clearInterval(timer);
    }, []);


    const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
        <div className="flex flex-col justify-center items-center p-6 border border-[#523B75] min-w-[100px]">
            <span className="font-bagel font-bold text-[#FBF574] text-5xl">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="mt-2 font-mont font-medium text-gray-400 text-sm uppercase">
                {label}
            </span>
        </div>
    );

    return (
        <div>
            <h1 className="mb-8 font-bagel text-white text-2xl sm:text-3xl md:text-4xl">Project Deadlines</h1>

            <div className="bg-[#523B75] shadow-lg p-8 rounded-2xl">
                <h2 className="mb-6 font-mont font-semibold text-white text-2xl text-center">
                    {/* The label now updates dynamically */}
                    {deadlineLabel}
                </h2>

                {/* Show countdown if timeLeft exists and the deadline is not over */}
                {timeLeft && !isOver ? (
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        <TimeBlock value={timeLeft.days} label="Days" />
                        <TimeBlock value={timeLeft.hours} label="Hours" />
                        <TimeBlock value={timeLeft.minutes} label="Minutes" />
                        <TimeBlock value={timeLeft.seconds} label="Seconds" />
                    </div>
                ) : (
                    // Show the "deadline passed" message only when 'isOver' is true
                    <div className="bg-[#4A376B] p-6 rounded-lg text-center">
                        <h3 className="font-mont font-bold text-red-500 text-3xl">
                            {/* Use the label, which will be PASSED_LABEL if isOver is true */}
                            {isOver ? PASSED_LABEL : "Loading..."}
                        </h3>
                        {isOver && (
                            <p className="mt-2 font-mont text-gray-300">
                                We hope you had a great time hacking.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};