import * as React from "react";
import { Mail } from "@/types/mail";
import { CircleUser } from "lucide-react";

export const accounts = [
    {
        label: "HackCC",
        email: "outreach@hackcc.dev",
        icon: <CircleUser />,
    },
];

export const mails: Mail[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        subject: "Sponsorship Opportunity",
        text: "Hi HackCC team, I'm interested in sponsoring your upcoming hackathon...",
        date: new Date().toISOString(),
        read: false,
        labels: ["sponsor"],
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Workshop Proposal",
        text: "Hello, I'd love to host a workshop at your next event...",
        date: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        labels: ["workshop"],
    },
];