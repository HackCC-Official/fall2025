"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContact } from "@/hooks/use-contact";
import { cn } from "@/lib/utils";

interface Contact {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    organization: string;
    position: string;
    country: string;
    state: string;
    city: string;
    street?: string;
    postal_code?: string;
    linkedin_url?: string;
    twitter_handle?: string;
    confidence_score: number;
    type: "sponsor" | "partner" | "speaker";
    number_of_sources: number;
    pattern: string;
    company_type: string;
    industry: string;
    created_at: string;
    department: string;
    domain_name: string;
}

export const CONTACTS: Contact[] = [
    {
        id: "1",
        first_name: "John",
        last_name: "Smith",
        email: "john@techcorp.com",
        phone_number: "+1 (555) 123-4567",
        organization: "TechCorp",
        position: "Sponsorship Manager",
        country: "United States",
        state: "California",
        city: "San Francisco",
        street: "123 Tech Street",
        postal_code: "94105",
        linkedin_url: "linkedin.com/in/johnsmith",
        twitter_handle: "@johnsmith",
        confidence_score: 0.95,
        type: "sponsor",
        number_of_sources: 3,
        pattern: "firstname.lastname@company.com",
        company_type: "Corporation",
        industry: "Technology",
        created_at: new Date().toISOString(),
        department: "Marketing",
        domain_name: "techcorp.com"
    },
    {
        id: "2",
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah@innovate.io",
        phone_number: "+44 (0)20 7946 0958",
        organization: "Innovate Labs",
        position: "Partnership Lead",
        country: "United Kingdom",
        state: "London",
        city: "London",
        street: "10 Downing Street",
        postal_code: "SW1A 2AA",
        linkedin_url: "linkedin.com/in/sarahjohnson",
        twitter_handle: "@sarahjohnson",
        confidence_score: 0.90,
        type: "partner",
        number_of_sources: 2,
        pattern: "firstname.lastname@company.com",
        company_type: "Limited Liability Partnership",
        industry: "Technology",
        created_at: new Date().toISOString(),
        department: "Partnerships",
        domain_name: "innovate.io"
    },
    // Add more contacts as needed
];

export function ContactsList() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [contact, setContact] = useContact();
    const [selectedContact, setSelectedContact] = useContact();

    const filteredContacts = CONTACTS.filter(
        (contact) =>
            contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search contacts..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="divide-y">
                    {filteredContacts.map((contact) => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedContact({ selected: contact.id })}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors text-left",
                                contact.id === selectedContact?.id && "bg-accent"
                            )}
                        >
                            <Avatar>
                                <AvatarFallback>
                                    {contact.first_name[0] + contact.last_name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium truncate">
                                        {contact.first_name} {contact.last_name}
                                    </p>
                                    <Badge variant="outline">{contact.type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {contact.email}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                    {contact.position} at {contact.organization}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
} 