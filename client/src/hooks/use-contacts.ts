"use client";

import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/features/outreach/api/outreach";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import { useState, useCallback } from "react";

interface ContactsResponse {
    data: ContactDto[];
    total: number;
}

interface UseContactsOptions {
    initialPage?: number;
    initialLimit?: number;
    initialSearch?: string;
}

export function useContacts({
    initialPage = 1,
    initialLimit = 20,
    initialSearch = "",
}: UseContactsOptions = {}) {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [search, setSearch] = useState(initialSearch);

    const queryResult = useQuery<ContactsResponse>({
        queryKey: ["contacts", page, limit, search],
        queryFn: async () => {
            return await getContacts(page, limit, search);
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: 1000,
    });

    /**
     * Fetches all contacts across all pages
     * @param pageSize Optional page size to use for fetching (defaults to 100)
     * @param searchTerm Optional search term to filter contacts
     * @returns Promise resolving to an array of all contacts
     */
    const fetchAllContacts = useCallback(
        async (pageSize = 100, searchTerm = search): Promise<ContactDto[]> => {
            try {
                // First get the initial page with total count
                const initialResponse = await getContacts(
                    1,
                    pageSize,
                    searchTerm
                );
                const allData = [...initialResponse.data];

                const totalItems = initialResponse.total;
                const totalFetchPages = Math.ceil(totalItems / pageSize);

                // Fetch remaining pages in parallel
                if (totalFetchPages > 1) {
                    const pagePromises = [];
                    for (let i = 2; i <= totalFetchPages; i++) {
                        pagePromises.push(
                            getContacts(i, pageSize, searchTerm).then(
                                (response) => response.data
                            )
                        );
                    }

                    const pageResults = await Promise.all(pagePromises);
                    pageResults.forEach((pageData) => {
                        allData.push(...pageData);
                    });
                }

                return allData;
            } catch (error) {
                console.error("Error fetching all contacts:", error);
                throw error;
            }
        },
        [search]
    );

    return {
        ...queryResult,
        pagination: {
            page,
            setPage,
            limit,
            setLimit,
            search,
            setSearch,
            totalPages: Math.ceil((queryResult.data?.total || 0) / limit),
        },
        fetchAllContacts,
    };
}
