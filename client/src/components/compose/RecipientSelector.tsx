"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Building,
    ChevronLeft,
    ChevronRight,
    Search,
    Users,
    X,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";
import type {
    ContactDto,
    ContactStatus,
} from "@/features/outreach/types/contact.dto";
import type { Mail } from "@/types/mail";
import { searchContacts } from "@/features/outreach/api/outreach";
import type { RecipientType } from "./ComposeView";

// Export RecipientType for use in other components
export type { RecipientType };

// Define interfaces for the 'any' types
interface ContactsResponse {
    data: ContactDto[];
    total?: number;
    page?: number;
    limit?: number;
}

interface InterestedUser {
    email: string;
    // Add other fields if needed based on usage in the component
}

interface Recipient {
    id: string;
    to: {
        name: string;
        email: string;
    }[];
    labels: string[];
    company?: string;
    status?: ContactStatus;
}

interface RecipientSelectorProps {
    recipientType: RecipientType;
    setRecipientType: React.Dispatch<React.SetStateAction<RecipientType>>;
    selectedRecipients: Set<string>;
    setSelectedRecipients: React.Dispatch<React.SetStateAction<Set<string>>>;
    contacts: ContactDto[];
    allContacts: ContactDto[];
    isContactsLoading: boolean;
    contactsResponse: ContactsResponse | undefined;
    contactsPage: number;
    contactsTotalPages?: number;
    interestedUsers: InterestedUser[];
    isInterestedLoading: boolean;
    mails: Mail[];
    liaisons: string[];
    fetchAllContacts: (limit: number, search: string) => Promise<ContactDto[]>;
    setContactsApiPage: (page: number) => void;
    setContactsApiSearch: (search: string) => void;
    refetchContacts: () => void;
    isLoadingAllContacts: boolean;
    setIsLoadingAllContacts: React.Dispatch<React.SetStateAction<boolean>>;
    contactsView: "individuals" | "organizations" | "selected";
    setContactsView: React.Dispatch<
        React.SetStateAction<"individuals" | "organizations" | "selected">
    >;
    setContactsPage: React.Dispatch<React.SetStateAction<number>>;
    globalFilters: {
        liaison: string | null;
        status: string | null;
        search: string;
    };
    setGlobalFilters: React.Dispatch<
        React.SetStateAction<{
            liaison: string | null;
            status: string | null;
            search: string;
        }>
    >;
    activeFilters: {
        liaison: string | null;
        status: string | null;
    };
    setActiveFilters: React.Dispatch<
        React.SetStateAction<{
            liaison: string | null;
            status: string | null;
        }>
    >;
    getGloballyFilteredContacts: () => ContactDto[];
}

// Component for displaying selected recipients or filtered by criteria
export const RecipientSelectionTable = ({
    contacts,
    currentPage,
    totalPages,
    selectedRecipients,
    onSelectRecipient,
    onSelectAll,
    onPageChange,
    loading,
    areAllSelected,
    areSomeSelected,
}: {
    contacts: ContactDto[] | Recipient[];
    currentPage: number;
    totalPages: number;
    selectedRecipients: Set<string>;
    onSelectRecipient: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    onPageChange: (page: number) => void;
    loading: boolean;
    areAllSelected: boolean;
    areSomeSelected: boolean;
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">
                        Loading contacts...
                    </p>
                </div>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">No contacts found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filters
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden shadow-sm bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-12 py-3">
                                <div className="flex items-center justify-center">
                                    <Checkbox
                                        checked={areAllSelected}
                                        onCheckedChange={onSelectAll}
                                        aria-label="Select all recipients"
                                    />
                                    {areSomeSelected && (
                                        <div className="h-4 w-4 text-muted-foreground absolute">
                                            —
                                        </div>
                                    )}
                                </div>
                            </TableHead>
                            <TableHead className="py-3 font-semibold">
                                Name
                            </TableHead>
                            <TableHead className="py-3 font-semibold">
                                Email
                            </TableHead>
                            {"company" in contacts[0] && (
                                <TableHead className="py-3 font-semibold">
                                    Organization
                                </TableHead>
                            )}
                            {contacts.length > 0 &&
                                "liaison" in contacts[0] && (
                                    <TableHead className="py-3 font-semibold">
                                        Liaison
                                    </TableHead>
                                )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow
                                key={contact.id}
                                className={
                                    "status" in contact &&
                                    contact.status === "Contacted"
                                        ? "bg-purple-100 dark:bg-purple-900/20"
                                        : "hover:bg-muted/50"
                                }
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRecipients.has(
                                            contact.id.toString()
                                        )}
                                        onCheckedChange={() =>
                                            onSelectRecipient(
                                                contact.id.toString()
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {("to" in contact &&
                                        contact.to?.[0]?.name) ||
                                        ("contact_name" in contact &&
                                            contact.contact_name)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {("to" in contact &&
                                        contact.to?.[0]?.email) ||
                                        ("email_address" in contact &&
                                            contact.email_address)}
                                </TableCell>
                                {"company" in contact && (
                                    <TableCell>{contact.company}</TableCell>
                                )}
                                {"liaison" in contact && (
                                    <TableCell>
                                        {contact.liaison || "-"}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

// Component for organization view
export const OrganizationsView = ({
    contacts,
    isLoading,
    selectedRecipients,
    onToggleRecipient,
    onUpdateSelected,
}: {
    contacts: ContactDto[];
    isLoading: boolean;
    selectedRecipients: Set<string>;
    onToggleRecipient: (id: string) => void;
    onUpdateSelected: (selected: Set<string>) => void;
}) => {
    // State for tracking expanded companies
    const [expandedCompanies, setExpandedCompanies] = React.useState<
        Record<string, boolean>
    >({});

    // Group contacts by company
    const groupedByCompany = React.useMemo(() => {
        const grouped: Record<string, ContactDto[]> = {};

        contacts.forEach((contact) => {
            if (contact.company) {
                const company = contact.company;
                if (!grouped[company]) {
                    grouped[company] = [];
                }
                grouped[company].push(contact);
            }
        });

        return grouped;
    }, [contacts]);

    // Get sorted company names
    const sortedCompanyNames = React.useMemo(() => {
        return Object.keys(groupedByCompany).sort();
    }, [groupedByCompany]);

    const toggleCompany = React.useCallback((company: string) => {
        setExpandedCompanies((prev) => ({
            ...prev,
            [company]: !prev[company],
        }));
    }, []);

    const toggleSelectAllForCompany = React.useCallback(
        (company: string) => {
            const companyContacts = groupedByCompany[company];
            if (!companyContacts) return;

            const areAllSelected = companyContacts.every((contact) =>
                selectedRecipients.has(contact.id.toString())
            );

            const newSelected = new Set(selectedRecipients);

            if (areAllSelected) {
                // Deselect all contacts from this company
                companyContacts.forEach((contact) => {
                    newSelected.delete(contact.id.toString());
                });
            } else {
                // Select all contacts from this company
                companyContacts.forEach((contact) => {
                    newSelected.add(contact.id.toString());
                });
            }

            onUpdateSelected(newSelected);
        },
        [groupedByCompany, selectedRecipients, onUpdateSelected]
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">
                        Loading organizations...
                    </p>
                </div>
            </div>
        );
    }

    if (sortedCompanyNames.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">No organizations found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filters
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedCompanyNames.map((company) => {
                const companyContacts = groupedByCompany[company];
                const isExpanded = !!expandedCompanies[company];

                // Find out how many contacts from this company are selected
                const selectedCount = companyContacts.filter((contact) =>
                    selectedRecipients.has(contact.id.toString())
                ).length;

                const areAllSelected = selectedCount === companyContacts.length;
                const areSomeSelected = selectedCount > 0 && !areAllSelected;

                return (
                    <div
                        key={company}
                        className={`border rounded-lg overflow-hidden ${areAllSelected ? "bg-primary/5 border-primary/20" : "bg-card"}`}
                    >
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleCompany(company)}
                        >
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={areAllSelected}
                                    onCheckedChange={() =>
                                        toggleSelectAllForCompany(company)
                                    }
                                    aria-label={`Select all contacts from ${company}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className={
                                        areSomeSelected ? "opacity-60" : ""
                                    }
                                />
                                <div>
                                    <h3 className="font-medium text-lg">
                                        {company}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {companyContacts.length} contacts
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedCount > 0 && (
                                    <Badge variant="outline">
                                        {selectedCount}/{companyContacts.length}{" "}
                                        selected
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCompany(company);
                                    }}
                                >
                                    <ChevronRight
                                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                    />
                                </Button>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="border-t p-3 bg-muted/30">
                                <div className="space-y-2">
                                    {companyContacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className={`flex items-center justify-between p-2 rounded-md ${selectedRecipients.has(contact.id.toString()) ? "bg-primary/10" : "hover:bg-muted"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedRecipients.has(
                                                        contact.id.toString()
                                                    )}
                                                    onCheckedChange={() =>
                                                        onToggleRecipient(
                                                            contact.id.toString()
                                                        )
                                                    }
                                                    aria-label={`Select ${contact.contact_name}`}
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {contact.contact_name ||
                                                            "Unnamed Contact"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {contact.email_address}
                                                    </p>
                                                </div>
                                            </div>
                                            {contact.status && (
                                                <Badge
                                                    variant={
                                                        contact.status ===
                                                        "Contacted"
                                                            ? "secondary"
                                                            : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {contact.status}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
    recipientType,
    setRecipientType,
    selectedRecipients,
    setSelectedRecipients,
    contacts,
    allContacts,
    isContactsLoading,
    contactsResponse,
    contactsPage,
    contactsTotalPages,
    interestedUsers,
    isInterestedLoading,
    mails,
    liaisons,
    fetchAllContacts,
    setContactsApiPage,
    setContactsApiSearch,
    refetchContacts,
    isLoadingAllContacts,
    setIsLoadingAllContacts,
    contactsView,
    setContactsView,
    setContactsPage,
    globalFilters,
    setGlobalFilters,
    activeFilters,
    setActiveFilters,
    getGloballyFilteredContacts,
}) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isSearching, setIsSearching] = React.useState(false);
    const [isSelectingAll, setIsSelectingAll] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState<ContactDto[]>([]);
    const [inSearchMode, setInSearchMode] = React.useState(false);

    // Create the recipient lists from props
    const recipientLists = React.useMemo(() => {
        const employerContacts = contacts.map((contact) => ({
            id: contact.id.toString(),
            to: [
                {
                    name: contact.contact_name || "",
                    email: contact.email_address,
                },
            ],
            company: contact.company,
            labels: ["Employer"],
            status: contact.status,
        }));

        const registeredHackers = mails.map((hacker) => ({
            id: hacker.id,
            to: hacker.to.map((recipient) => ({
                name: recipient.name || recipient.email.split("@")[0],
                email: recipient.email,
            })),
            labels: [...(hacker.labels || []), "Registered"],
        }));

        const interestedHackers = (interestedUsers || []).map((user) => ({
            id: user.email,
            to: [
                {
                    name: user.email.split("@")[0],
                    email: user.email,
                },
            ],
            labels: ["Interested"],
        }));

        return {
            employers: employerContacts,
            registered: registeredHackers,
            interested: interestedHackers,
        } as Record<RecipientType, Recipient[]>;
    }, [contacts, mails, interestedUsers]);

    const filteredRecipients = React.useMemo(() => {
        const currentList = recipientLists[recipientType];
        return currentList.filter(
            (recipient) =>
                recipient.to?.[0]?.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                recipient.to?.[0]?.email
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                recipient.company
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [recipientLists, recipientType, searchQuery]);

    const areAllFilteredSelected = React.useMemo(() => {
        return (
            filteredRecipients.length > 0 &&
            filteredRecipients.every((recipient) =>
                selectedRecipients.has(recipient.id)
            )
        );
    }, [filteredRecipients, selectedRecipients]);

    const areSomeFilteredSelected = React.useMemo(() => {
        return (
            filteredRecipients.some((recipient) =>
                selectedRecipients.has(recipient.id)
            ) && !areAllFilteredSelected
        );
    }, [filteredRecipients, selectedRecipients, areAllFilteredSelected]);

    // Create a proper debounced search function that persists between renders
    const debouncedSearchContacts = React.useMemo(
        () =>
            debounce(async (value: string) => {
                if (!value || value.length < 2) {
                    setInSearchMode(false);
                    setSearchResults([]);
                    return;
                }

                try {
                    setIsSearching(true);
                    setInSearchMode(true);

                    const results = await searchContacts(value).catch(
                        (error) => {
                            if (
                                error.message ===
                                "Invalid response format from contacts search API."
                            ) {
                                const responseData = error.response?.data;
                                if (Array.isArray(responseData)) {
                                    return responseData;
                                }
                            }
                            throw error;
                        }
                    );

                    if (results) {
                        setSearchResults(results);

                        // Update the global contacts array with search results
                        if (contacts !== results && Array.isArray(results)) {
                            // Create a new array to trigger reactivity
                            const updatedContacts = [...results];

                            // Replace all items in the contacts array
                            contacts.splice(
                                0,
                                contacts.length,
                                ...updatedContacts
                            );
                        }
                    }
                } catch (error) {
                    console.error("Error searching contacts:", error);
                    toast.error("Failed to search contacts. Please try again.");
                } finally {
                    setIsSearching(false);
                }
            }, 500), // Increased debounce time to 500ms
        [contacts]
    );

    // Handle global search
    const handleGlobalSearch = (value: string) => {
        setSearchQuery(value);

        // Only update global filters when clearing search
        if (!value) {
            setGlobalFilters((prev) => ({
                ...prev,
                search: "",
            }));
            setInSearchMode(false);
            setContactsApiSearch("");
            setContactsPage(1);
            setContactsApiPage(1);
            refetchContacts();
            setSearchResults([]);

            // For organization view, reload all contacts
            if (contactsView === "organizations") {
                setIsLoadingAllContacts(true);
                fetchAllContacts(1000, "").finally(() => {
                    setIsLoadingAllContacts(false);
                });
            }
            return;
        }

        // For short searches, just reset search mode but don't refetch
        if (value.length < 2) {
            setInSearchMode(false);
            return;
        }

        // Update global filter state for tracking
        if (value !== globalFilters.search) {
            setGlobalFilters((prev) => ({
                ...prev,
                search: value,
            }));
        }

        // Only trigger debounced search for employers in individual view
        if (recipientType === "employers" && contactsView !== "organizations") {
            debouncedSearchContacts(value);
        }
    };

    // Get the contacts to display based on search mode
    const contactsToDisplay = React.useMemo(() => {
        if (inSearchMode && searchResults.length > 0) {
            return searchResults;
        }
        return contacts;
    }, [inSearchMode, searchResults, contacts]);

    const handleContactsPageChange = (newPage: number) => {
        // Don't trigger pagination when in search mode
        if (inSearchMode) return;

        setContactsPage(newPage);
        setContactsApiPage(newPage);
    };

    const handleSelectAll = (checked: boolean) => {
        const newSelected = new Set(selectedRecipients);
        filteredRecipients.forEach((recipient) => {
            if (checked) {
                newSelected.add(recipient.id);
            } else {
                newSelected.delete(recipient.id);
            }
        });
        setSelectedRecipients(newSelected);
    };

    const handleRecipientToggle = (recipientId: string) => {
        const newSelected = new Set(selectedRecipients);
        if (newSelected.has(recipientId)) {
            newSelected.delete(recipientId);
        } else {
            newSelected.add(recipientId);
        }
        setSelectedRecipients(newSelected);
    };

    const handleSelectAllVisible = () => {
        const newSelected = new Set(selectedRecipients);

        // Use the contactsToDisplay to ensure we're selecting what's visible
        if (inSearchMode && searchResults.length > 0) {
            searchResults.forEach((contact) => {
                newSelected.add(contact.id.toString());
            });
        } else if (contactsResponse?.data) {
            contactsResponse.data.forEach((contact: ContactDto) => {
                newSelected.add(contact.id.toString());
            });
        }

        setSelectedRecipients(newSelected);
    };

    const handleSelectAllContacts = async () => {
        // Show loading state
        setIsSelectingAll(true);

        try {
            toast.info("Loading all recipients...", { duration: 2000 });

            const allRecipientsIds = new Set<string>();

            if (recipientType === "employers") {
                // Use the already loaded all contacts instead of fetching again
                let filtered = allContacts;

                // Apply global filters
                if (
                    globalFilters.liaison ||
                    globalFilters.status ||
                    globalFilters.search
                ) {
                    filtered = getGloballyFilteredContacts();
                }

                filtered.forEach((contact: ContactDto) => {
                    allRecipientsIds.add(contact.id.toString());
                });

                // Create appropriate message based on filters applied
                let filterMessage = `Selected ${filtered.length} employer contacts`;

                if (globalFilters.liaison) {
                    filterMessage += ` with liaison: ${globalFilters.liaison}`;
                }

                if (globalFilters.status) {
                    filterMessage += ` with status: ${globalFilters.status}`;
                }

                if (globalFilters.search) {
                    filterMessage += ` matching: "${globalFilters.search}"`;
                }

                toast.success(filterMessage);
            } else if (recipientType === "registered") {
                // For registered users, use the mails array
                mails.forEach((mail) => {
                    allRecipientsIds.add(mail.id);
                });
                toast.success(`Selected ${mails.length} registered hackers`);
            } else if (recipientType === "interested") {
                // For interested users
                interestedUsers?.forEach((user) => {
                    allRecipientsIds.add(user.email);
                });
                toast.success(
                    `Selected ${interestedUsers?.length || 0} interested users`
                );
            }

            setSelectedRecipients(allRecipientsIds);
        } catch (error) {
            console.error("Error selecting all recipients:", error);
            toast.error("Failed to select all recipients. Please try again.");
        } finally {
            setIsSelectingAll(false);
        }
    };

    // Handle global liaison filter change
    const handleGlobalLiaisonChange = (value: string) => {
        setGlobalFilters((prev) => ({
            ...prev,
            liaison: value === "all" ? null : value,
        }));

        if (value !== "all") {
            toast.info(
                `Filtering to show only contacts with liaison: ${value}`
            );
        } else {
            toast.info("Showing contacts for all liaisons");
        }

        // Update active filters as well for consistency
        setActiveFilters((prev) => ({
            ...prev,
            liaison: value === "all" ? null : value,
        }));
    };

    return (
        <div className="space-y-6">
            {/* Recipient Type Tabs */}
            <div className="flex border-b mb-4">
                <Button
                    variant={
                        recipientType === "employers" ? "default" : "ghost"
                    }
                    onClick={() => {
                        // Reset selection when changing tabs
                        setSelectedRecipients(new Set());
                        setRecipientType("employers");
                    }}
                    className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium"
                    style={{
                        borderBottomColor:
                            recipientType === "employers"
                                ? "hsl(var(--primary))"
                                : "transparent",
                    }}
                >
                    <Building className="h-4 w-4 mr-2" />
                    Employers
                </Button>
                <Button
                    variant={
                        recipientType === "registered" ? "default" : "ghost"
                    }
                    onClick={() => {
                        setSelectedRecipients(new Set());
                        setRecipientType("registered");
                    }}
                    className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium"
                    style={{
                        borderBottomColor:
                            recipientType === "registered"
                                ? "hsl(var(--primary))"
                                : "transparent",
                    }}
                >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Registered Hackers
                </Button>
                <Button
                    variant={
                        recipientType === "interested" ? "default" : "ghost"
                    }
                    onClick={() => {
                        setSelectedRecipients(new Set());
                        setRecipientType("interested");
                    }}
                    className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium"
                    style={{
                        borderBottomColor:
                            recipientType === "interested"
                                ? "hsl(var(--primary))"
                                : "transparent",
                    }}
                >
                    <Users className="h-4 w-4 mr-2" />
                    Interested Users
                </Button>
            </div>

            {/* Applied filters */}
            {(activeFilters.liaison || activeFilters.status) && (
                <div className="flex flex-wrap gap-2 p-2 px-3 bg-muted/30 rounded-md items-center mb-4">
                    <span className="text-sm font-medium">Active filters:</span>
                    {activeFilters.liaison && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            Liaison: {activeFilters.liaison}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setActiveFilters((prev) => ({
                                        ...prev,
                                        liaison: null,
                                    }))
                                }
                                className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {activeFilters.status && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            Status: {activeFilters.status}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setActiveFilters((prev) => ({
                                        ...prev,
                                        status: null,
                                    }))
                                }
                                className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            setActiveFilters({
                                liaison: null,
                                status: null,
                            })
                        }
                        className="h-6 text-xs ml-auto"
                    >
                        Clear All Filters
                    </Button>
                </div>
            )}

            {/* Search and bulk actions */}
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="recipient-filter"
                        value={searchQuery}
                        onChange={(e) => {
                            const value = e.target.value;
                            handleGlobalSearch(value);
                        }}
                        placeholder={
                            recipientType === "employers"
                                ? "Search by name, email, or organization..."
                                : "Search by name or email..."
                        }
                        className="pl-10 pr-10 py-2 w-full"
                    />
                    {searchQuery && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                // Use the same handler to ensure consistent behavior
                                handleGlobalSearch("");
                            }}
                            className="absolute right-2 top-2 h-6 w-6 p-0"
                            title="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    {isSearching && (
                        <div className="absolute right-10 top-3">
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    {recipientType === "employers" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 whitespace-nowrap"
                            onClick={handleSelectAllVisible}
                            title="Select all visible recipients"
                        >
                            Select Visible
                        </Button>
                    )}

                    {recipientType === "employers" && (
                        <div className="flex gap-2">
                            <Select
                                value={globalFilters.liaison || "all"}
                                onValueChange={handleGlobalLiaisonChange}
                            >
                                <SelectTrigger className="h-9 w-[180px]">
                                    <SelectValue placeholder="Filter by liaison" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Liaisons
                                    </SelectItem>
                                    {liaisons.map((liaison) => (
                                        <SelectItem
                                            key={liaison}
                                            value={liaison}
                                        >
                                            {liaison}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={handleSelectAllContacts}
                        disabled={isSelectingAll}
                        title={
                            recipientType === "employers" &&
                            globalFilters.liaison
                                ? `Select all contacts with liaison: ${globalFilters.liaison}`
                                : "Select all available recipients"
                        }
                    >
                        {isSelectingAll ? (
                            <div className="h-3 w-3 mr-1 animate-spin rounded-full border-b-2 border-current"></div>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 mr-1"
                            >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        )}
                        {recipientType === "employers" && globalFilters.liaison
                            ? `Select All (${globalFilters.liaison})`
                            : "Select All"}
                    </Button>
                </div>
            </div>

            {/* Loading indicator */}
            {isSelectingAll && (
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full animate-pulse w-full"></div>
                </div>
            )}

            {/* Selection count */}
            {selectedRecipients.size > 0 && (
                <div className="flex items-center justify-between p-2 px-3 bg-primary/10 rounded-md">
                    <div className="text-sm">
                        <span className="font-medium">
                            {selectedRecipients.size}
                        </span>{" "}
                        {selectedRecipients.size === 1
                            ? "recipient"
                            : "recipients"}{" "}
                        selected
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setSelectedRecipients(new Set())}
                    >
                        Clear Selection
                    </Button>
                </div>
            )}

            {/* View switcher for employers */}
            {recipientType === "employers" && (
                <div className="flex border rounded-md overflow-hidden mb-4">
                    <Button
                        size="sm"
                        variant={
                            contactsView === "individuals" ? "default" : "ghost"
                        }
                        className="flex-1 rounded-none"
                        onClick={() => setContactsView("individuals")}
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Individuals
                    </Button>
                    <Button
                        size="sm"
                        variant={
                            contactsView === "organizations"
                                ? "default"
                                : "ghost"
                        }
                        className="flex-1 rounded-none"
                        onClick={() => setContactsView("organizations")}
                    >
                        <Building className="h-4 w-4 mr-2" />
                        Organizations
                    </Button>
                    <Button
                        size="sm"
                        variant={
                            contactsView === "selected" ? "default" : "ghost"
                        }
                        className="flex-1 rounded-none"
                        onClick={() => setContactsView("selected")}
                        disabled={selectedRecipients.size === 0}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Selected
                    </Button>
                </div>
            )}

            {/* Contact lists */}
            {recipientType === "employers" &&
                contactsView === "individuals" && (
                    <RecipientSelectionTable
                        contacts={contactsToDisplay}
                        currentPage={contactsPage}
                        totalPages={inSearchMode ? 1 : contactsTotalPages || 1}
                        selectedRecipients={selectedRecipients}
                        onSelectRecipient={handleRecipientToggle}
                        onSelectAll={handleSelectAll}
                        onPageChange={handleContactsPageChange}
                        loading={isContactsLoading && !inSearchMode}
                        areAllSelected={areAllFilteredSelected}
                        areSomeSelected={areSomeFilteredSelected}
                    />
                )}

            {recipientType === "employers" &&
                contactsView === "organizations" && (
                    <OrganizationsView
                        contacts={contactsToDisplay}
                        isLoading={isContactsLoading || isLoadingAllContacts}
                        selectedRecipients={selectedRecipients}
                        onToggleRecipient={handleRecipientToggle}
                        onUpdateSelected={setSelectedRecipients}
                    />
                )}

            {recipientType === "employers" && contactsView === "selected" && (
                <RecipientSelectionTable
                    contacts={contacts.filter((contact) =>
                        selectedRecipients.has(contact.id.toString())
                    )}
                    currentPage={1}
                    totalPages={1}
                    selectedRecipients={selectedRecipients}
                    onSelectRecipient={handleRecipientToggle}
                    onSelectAll={() => {}}
                    onPageChange={() => {}}
                    loading={false}
                    areAllSelected={true}
                    areSomeSelected={false}
                />
            )}

            {(recipientType === "interested" ||
                recipientType === "registered") && (
                <RecipientSelectionTable
                    contacts={recipientLists[recipientType]}
                    currentPage={1}
                    totalPages={1}
                    selectedRecipients={selectedRecipients}
                    onSelectRecipient={handleRecipientToggle}
                    onSelectAll={handleSelectAll}
                    onPageChange={() => {}}
                    loading={
                        recipientType === "interested"
                            ? isInterestedLoading
                            : false
                    }
                    areAllSelected={areAllFilteredSelected}
                    areSomeSelected={areSomeFilteredSelected}
                />
            )}
        </div>
    );
};

export default RecipientSelector;
