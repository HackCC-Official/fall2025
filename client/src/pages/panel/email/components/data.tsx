import * as React from "react";
import type { Mail } from "@/types/mail";
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
        from: "outreach@hackcc.dev",
        to: [
            {
                email: "john@techcorp.com",
                name: "John Smith",
            },
        ],
        subject: "Sponsorship Opportunity",
        html: "Hi HackCC team, I'm interested in sponsoring your upcoming hackathon...",
        date: new Date().toISOString(),
        read: false,
        labels: ["sponsor"],
    },
    {
        id: "2",
        from: "outreach@hackcc.dev",
        to: [
            {
                email: "sarah@innovate.io",
                name: "Sarah Johnson",
            },
        ],
        subject: "Workshop Proposal",
        html: "Hello, I'd love to host a workshop at your next event...",
        date: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        labels: ["workshop"],
    },
];
