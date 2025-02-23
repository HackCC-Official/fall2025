import { Mail } from "@/types/mail";
import { CircleUser, Laptop, Smartphone, Tablet } from "lucide-react";

export const accounts = [
    {
        label: "HackCC",
        email: "outreach@hackcc.dev",
        icon: CircleUser,
    },
    {
        label: "Support",
        email: "support@hackcc.dev",
        icon: Laptop,
    },
    // Add more accounts as needed
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
        labels: ["sponsor", "important"],
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Workshop Proposal",
        text: "Hello, I'd love to host a workshop at your next event...",
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
        labels: ["workshop"],
    },
    // Add more sample emails as needed
]; 