"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
    ContactDto,
    ContactStatus,
} from "@/features/outreach/types/contact.dto";
import { getContacts } from "@/features/outreach/api/outreach";
import { toast } from "sonner";

/**
 * Filter options for contacts list
 */
export type FilterOptions = {
    hasEmail: boolean;
    hasName: boolean;
    hasLinkedIn: boolean;
    hasPhone: boolean;
    hasWebsite: boolean;
    company?: string;
    country?: string;
    position?: string;
    liaison?: string;
    status?: "all" | ContactStatus;
    confidenceScore?: {
        min: number;
        max: number;
    };
    meetingMethod?: string;
    sortBy?: "name" | "email" | "company" | "recent" | "confidence";
};

/**
 * Props for the FilterContactsDrawer component
 */
interface FilterContactsDrawerProps {
    /** Whether the drawer is open */
    open: boolean;
    /** Callback when the drawer open state changes */
    onOpenChange: (open: boolean) => void;
    /** Current filter options */
    filters: FilterOptions;
    /** Callback to update filter options */
    setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
    /** List of contacts for generating filter options */
    contacts: ContactDto[];
    /** Number of active filters */
    activeFilterCount: number;
    /** Callback to clear all filters */
    clearFilters: () => void;
}

/**
 * Drawer component for filtering contacts
 */
export default function FilterContactsDrawer({
    open,
    onOpenChange,
    filters,
    setFilters,
    contacts,
    activeFilterCount,
    clearFilters,
}: FilterContactsDrawerProps) {
    const [isLoadingAllContacts, setIsLoadingAllContacts] =
        React.useState(false);
    const [allContacts, setAllContacts] = React.useState<ContactDto[]>([]);
    const [isApplyingFilters, setIsApplyingFilters] = React.useState(false);

    // Fetch all contacts when drawer opens
    React.useEffect(() => {
        if (open && allContacts.length === 0) {
            fetchAllContacts();
        }
    }, [open, allContacts.length]);

    /**
     * Fetches all contacts across all pages
     */
    const fetchAllContacts = async (
        pageSize = 100,
        searchTerm = ""
    ): Promise<void> => {
        try {
            setIsLoadingAllContacts(true);

            // First get the initial page with total count
            const initialResponse = await getContacts(1, pageSize, searchTerm);
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

            setAllContacts(allData);

            if (totalItems > 0) {
                toast.success(`Loaded ${totalItems} contacts for filtering`);
            } else {
                toast.info("No contacts found");
            }
        } catch (error) {
            console.error("Error fetching all contacts:", error);
            toast.error("Failed to load contacts for filtering");
        } finally {
            setIsLoadingAllContacts(false);
        }
    };

    // Get unique organizations for the company dropdown
    const organizations = React.useMemo(() => {
        if (allContacts.length > 0) {
            const uniqueOrgs = new Set<string>();
            allContacts.forEach((c) => {
                if (c.company) uniqueOrgs.add(c.company);
            });
            return Array.from(uniqueOrgs).sort();
        }

        // Fallback to current contacts if all contacts aren't loaded yet
        const uniqueOrgs = new Set<string>();
        contacts.forEach((c) => {
            if (c.company) uniqueOrgs.add(c.company);
        });
        return Array.from(uniqueOrgs).sort();
    }, [contacts, allContacts]);

    // Get all unique liaisons
    const liaisons = React.useMemo(() => {
        const contactsToUse = allContacts.length > 0 ? allContacts : contacts;
        const uniqueLiaisons = new Set<string>();
        contactsToUse.forEach((c) => {
            if (c.liaison) uniqueLiaisons.add(c.liaison);
        });
        return Array.from(uniqueLiaisons).sort();
    }, [contacts, allContacts]);

    // Get all unique countries
    const countries = React.useMemo(() => {
        const contactsToUse = allContacts.length > 0 ? allContacts : contacts;
        const uniqueCountries = new Set<string>();
        contactsToUse.forEach((c) => {
            if (c.country) uniqueCountries.add(c.country);
        });
        return Array.from(uniqueCountries).sort();
    }, [contacts, allContacts]);

    // Get all unique positions
    const positions = React.useMemo(() => {
        const contactsToUse = allContacts.length > 0 ? allContacts : contacts;
        const uniquePositions = new Set<string>();
        contactsToUse.forEach((c) => {
            if (c.position) uniquePositions.add(c.position);
        });
        return Array.from(uniquePositions).sort();
    }, [contacts, allContacts]);

    // Get all unique meeting methods
    const meetingMethods = React.useMemo(() => {
        const contactsToUse = allContacts.length > 0 ? allContacts : contacts;
        const uniqueMethods = new Set<string>();
        contactsToUse.forEach((c) => {
            if (c.meeting_method) uniqueMethods.add(c.meeting_method);
        });
        return Array.from(uniqueMethods).sort();
    }, [contacts, allContacts]);

    // Apply filters with preview count
    const getFilteredContactsCount = (): number => {
        const contactsToFilter =
            allContacts.length > 0 ? allContacts : contacts;

        let filtered = [...contactsToFilter];

        if (filters.hasEmail) {
            filtered = filtered.filter((c) => !!c.email_address);
        }

        if (filters.hasName) {
            filtered = filtered.filter((c) => !!c.contact_name);
        }

        if (filters.hasLinkedIn) {
            filtered = filtered.filter((c) => !!c.linkedin);
        }

        if (filters.hasPhone) {
            filtered = filtered.filter((c) => !!c.phone_number);
        }

        if (filters.hasWebsite) {
            filtered = filtered.filter((c) => !!c.website);
        }

        if (filters.company) {
            filtered = filtered.filter((c) => c.company === filters.company);
        }

        if (filters.country) {
            filtered = filtered.filter((c) => c.country === filters.country);
        }

        if (filters.position) {
            filtered = filtered.filter((c) => c.position === filters.position);
        }

        if (filters.liaison) {
            filtered = filtered.filter((c) => c.liaison === filters.liaison);
        }

        if (filters.status && filters.status !== "all") {
            filtered = filtered.filter((c) => c.status === filters.status);
        }

        if (filters.meetingMethod) {
            filtered = filtered.filter(
                (c) => c.meeting_method === filters.meetingMethod
            );
        }

        if (filters.confidenceScore) {
            filtered = filtered.filter((c) => {
                const score = c.confidence_score || 0;
                return (
                    score >= (filters.confidenceScore?.min || 0) &&
                    score <= (filters.confidenceScore?.max || 100)
                );
            });
        }

        return filtered.length;
    };

    // Handle applying filters
    const handleApplyFilters = () => {
        const filteredCount = getFilteredContactsCount();
        const totalCount =
            allContacts.length > 0 ? allContacts.length : contacts.length;

        setIsApplyingFilters(true);

        // Simulate loading time for better UX
        setTimeout(() => {
            if (activeFilterCount > 0) {
                toast.success(
                    `Applied filters: ${filteredCount} of ${totalCount} contacts match`
                );
            }
            onOpenChange(false);
            setIsApplyingFilters(false);
        }, 500);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="w-[400px] sm:max-w-md overflow-y-auto"
                side="right"
            >
                <SheetHeader className="pb-4">
                    <SheetTitle>Filter Contacts</SheetTitle>
                    <SheetDescription>
                        Refine your contact list with multiple criteria
                    </SheetDescription>
                </SheetHeader>

                {isLoadingAllContacts ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                        <p className="text-muted-foreground text-sm">
                            Loading all contacts for filtering...
                        </p>
                    </div>
                ) : (
                    <>
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="basic">Basic</TabsTrigger>
                                <TabsTrigger value="organization">
                                    Organization
                                </TabsTrigger>
                                <TabsTrigger value="advanced">
                                    Advanced
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Sort By
                                    </h3>
                                    <Select
                                        value={filters.sortBy || "name"}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                sortBy: value as
                                                    | "name"
                                                    | "email"
                                                    | "company"
                                                    | "recent"
                                                    | "confidence",
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">
                                                Name
                                            </SelectItem>
                                            <SelectItem value="email">
                                                Email
                                            </SelectItem>
                                            <SelectItem value="company">
                                                Company
                                            </SelectItem>
                                            <SelectItem value="recent">
                                                Recently Added
                                            </SelectItem>
                                            <SelectItem value="confidence">
                                                Confidence Score
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Status
                                    </h3>
                                    <Select
                                        value={filters.status || "all"}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                status: value as
                                                    | "all"
                                                    | ContactStatus,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Contacts
                                            </SelectItem>
                                            <SelectItem value="Cold">
                                                Cold
                                            </SelectItem>
                                            <SelectItem value="Follow Up 1">
                                                Follow Up 1
                                            </SelectItem>
                                            <SelectItem value="Follow Up 2">
                                                Follow Up 2
                                            </SelectItem>
                                            <SelectItem value="Accept">
                                                Accept
                                            </SelectItem>
                                            <SelectItem value="Rejected">
                                                Rejected
                                            </SelectItem>
                                            <SelectItem value="Contacted">
                                                Contacted
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Data Quality
                                    </h3>
                                    <div className="flex flex-col gap-3 pt-1">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasEmail"
                                                checked={filters.hasEmail}
                                                onCheckedChange={(checked) =>
                                                    setFilters({
                                                        ...filters,
                                                        hasEmail:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="hasEmail"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Has Email
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasName"
                                                checked={filters.hasName}
                                                onCheckedChange={(checked) =>
                                                    setFilters({
                                                        ...filters,
                                                        hasName:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="hasName"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Has Name
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasLinkedIn"
                                                checked={filters.hasLinkedIn}
                                                onCheckedChange={(checked) =>
                                                    setFilters({
                                                        ...filters,
                                                        hasLinkedIn:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="hasLinkedIn"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Has LinkedIn
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasPhone"
                                                checked={filters.hasPhone}
                                                onCheckedChange={(checked) =>
                                                    setFilters({
                                                        ...filters,
                                                        hasPhone:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="hasPhone"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Has Phone
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasWebsite"
                                                checked={filters.hasWebsite}
                                                onCheckedChange={(checked) =>
                                                    setFilters({
                                                        ...filters,
                                                        hasWebsite:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="hasWebsite"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Has Website
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="organization"
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Company
                                    </h3>
                                    <Select
                                        value={filters.company || "any-company"}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                company:
                                                    value === "any-company"
                                                        ? undefined
                                                        : value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any-company">
                                                Any Company
                                            </SelectItem>
                                            {organizations.map((org) => (
                                                <SelectItem
                                                    key={org}
                                                    value={org}
                                                >
                                                    {org}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Liaison
                                    </h3>
                                    <Select
                                        value={filters.liaison || "any-liaison"}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                liaison:
                                                    value === "any-liaison"
                                                        ? undefined
                                                        : value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Liaison" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any-liaison">
                                                Any Liaison
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

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Country
                                    </h3>
                                    <Select
                                        value={filters.country || "any-country"}
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                country:
                                                    value === "any-country"
                                                        ? undefined
                                                        : value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any-country">
                                                Any Country
                                            </SelectItem>
                                            {countries.map((country) => (
                                                <SelectItem
                                                    key={country}
                                                    value={country}
                                                >
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Position
                                    </h3>
                                    <Select
                                        value={
                                            filters.position || "any-position"
                                        }
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                position:
                                                    value === "any-position"
                                                        ? undefined
                                                        : value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any-position">
                                                Any Position
                                            </SelectItem>
                                            {positions.map((position) => (
                                                <SelectItem
                                                    key={position}
                                                    value={position}
                                                >
                                                    {position}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="advanced" className="space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Confidence Score
                                    </h3>
                                    <div className="pt-2 px-1">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs text-muted-foreground">
                                                Low
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                High
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="Min"
                                                className="w-20"
                                                value={
                                                    filters.confidenceScore
                                                        ?.min ?? ""
                                                }
                                                onChange={(e) => {
                                                    const min =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0;
                                                    setFilters({
                                                        ...filters,
                                                        confidenceScore: {
                                                            min: min,
                                                            max:
                                                                filters
                                                                    .confidenceScore
                                                                    ?.max ??
                                                                100,
                                                        },
                                                    });
                                                }}
                                            />
                                            <div className="flex-1 h-2 bg-muted rounded-full relative">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                                                    style={{
                                                        width: `${(filters.confidenceScore?.max ?? 100) - (filters.confidenceScore?.min ?? 0)}%`,
                                                        left: `${filters.confidenceScore?.min ?? 0}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="Max"
                                                className="w-20"
                                                value={
                                                    filters.confidenceScore
                                                        ?.max ?? ""
                                                }
                                                onChange={(e) => {
                                                    const max =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 100;
                                                    setFilters({
                                                        ...filters,
                                                        confidenceScore: {
                                                            min:
                                                                filters
                                                                    .confidenceScore
                                                                    ?.min ?? 0,
                                                            max: max,
                                                        },
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">
                                        Meeting Method
                                    </h3>
                                    <Select
                                        value={
                                            filters.meetingMethod ||
                                            "any-method"
                                        }
                                        onValueChange={(value) =>
                                            setFilters({
                                                ...filters,
                                                meetingMethod:
                                                    value === "any-method"
                                                        ? undefined
                                                        : value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Meeting Method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any-method">
                                                Any Method
                                            </SelectItem>
                                            {meetingMethods.map((method) => (
                                                <SelectItem
                                                    key={method}
                                                    value={method}
                                                >
                                                    {method}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="space-y-4 pt-6 mt-4 border-t">
                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    {activeFilterCount > 0
                                        ? `${activeFilterCount} active filters`
                                        : "No filters applied"}
                                </div>
                                <div className="flex items-center gap-2">
                                    {activeFilterCount > 0 && (
                                        <div className="text-xs text-muted-foreground ml-2">
                                            Preview:{" "}
                                            <span className="font-medium">
                                                {getFilteredContactsCount()}
                                            </span>{" "}
                                            of{" "}
                                            {allContacts.length > 0
                                                ? allContacts.length
                                                : contacts.length}{" "}
                                            contacts
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                    >
                                        Reset All
                                    </Button>
                                </div>
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleApplyFilters}
                                disabled={isApplyingFilters}
                            >
                                {isApplyingFilters ? (
                                    <>
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                        Applying Filters...
                                    </>
                                ) : (
                                    "Apply Filters"
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
