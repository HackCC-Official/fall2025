"use client";

import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/features/outreach/api/outreach";
import type { ContactDto } from "@/features/outreach/types/contact.dto";

interface ContactsResponse {
    data: ContactDto[];
    total: number;
}

export function useContacts() {
    return useQuery<ContactsResponse>({
        queryKey: ["contacts"],
        queryFn: async () => {
            const contacts = await getContacts();
            return {
                data: contacts,
                total: contacts.length,
            };
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: 1000,
    });
}
