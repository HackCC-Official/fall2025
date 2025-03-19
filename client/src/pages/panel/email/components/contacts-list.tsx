"use client";

import * as React from "react";
import {
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Sliders,
    X,
    Check,
    Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContact } from "@/hooks/use-contact";
import type {
    ContactDto,
    ContactStatus,
} from "@/features/outreach/types/contact.dto";
import { cn } from "@/lib/utils";
import EditContactDrawer from "./edit-contact-drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    deleteContact,
    searchContacts,
} from "@/features/outreach/api/outreach";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useContacts } from "@/hooks/use-contacts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FilterOptions = {
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

export default function ContactsList({
    contacts: initialContacts,
}: {
    contacts: ContactDto[];
}) {
    const router = useRouter();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [contact, setContact] = useContact();
    const [searchText, setSearchText] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<ContactDto[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [editingContact, setEditingContact] =
        React.useState<ContactDto | null>(null);
    const [filters, setFilters] = React.useState<FilterOptions>({
        hasEmail: false,
        hasName: false,
        hasLinkedIn: false,
        hasPhone: false,
        hasWebsite: false,
        status: "all",
        sortBy: "name",
        confidenceScore: undefined,
    });
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = React.useState<number | null>(null);

    const {
        data,
        isLoading,
        pagination: { page, setPage, limit, setLimit, totalPages },
    } = useContacts({
        initialLimit: 50,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const contacts = data?.data || initialContacts || [];
    const totalContacts = data?.total || 0;

    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchText.trim()) {
                setIsSearching(true);
                try {
                    const results = await searchContacts(searchText);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Error searching contacts:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchText]);

    const filteredContacts = React.useMemo(() => {
        let filtered = [...contacts];

        if (searchText.trim()) {
            filtered = filtered.filter((c) => {
                const query = searchText.toLowerCase();
                return (
                    c.contact_name?.toLowerCase().includes(query) ||
                    c.email_address?.toLowerCase().includes(query) ||
                    c.company?.toLowerCase().includes(query) ||
                    c.position?.toLowerCase().includes(query) ||
                    c.country?.toLowerCase().includes(query)
                );
            });
        }

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
        } else if (filters.status === "all") {
            // Keep all contacts
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

        if (filters.sortBy === "name") {
            filtered.sort((a, b) => {
                const nameA = a.contact_name || "";
                const nameB = b.contact_name || "";
                return nameA.localeCompare(nameB);
            });
        } else if (filters.sortBy === "email") {
            filtered.sort((a, b) =>
                a.email_address.localeCompare(b.email_address)
            );
        } else if (filters.sortBy === "company") {
            filtered.sort((a, b) =>
                (a.company || "").localeCompare(b.company || "")
            );
        } else if (filters.sortBy === "confidence") {
            filtered.sort((a, b) => {
                const scoreA = a.confidence_score || 0;
                const scoreB = b.confidence_score || 0;
                return scoreB - scoreA; // Higher scores first
            });
        }

        return filtered;
    }, [contacts, searchText, filters]);

    const virtualizer = useVirtualizer({
        count: filteredContacts.length,
        getScrollElement: () => containerRef.current,
        estimateSize: () => 85,
        overscan: 10,
    });

    const displayedContactsCount = searchText.trim()
        ? searchResults.length
        : totalContacts;

    const organizations = React.useMemo(() => {
        const uniqueOrgs = new Set<string>();
        contacts.forEach((c) => {
            if (c.company) uniqueOrgs.add(c.company);
        });
        return Array.from(uniqueOrgs).sort();
    }, [contacts]);

    const handleDelete = async (contactId: number) => {
        try {
            await deleteContact(contactId.toString());
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            setSearchResults([]);
            setSearchText("");
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const currentSelection = contact.selected;
            const currentId = contact.selectedId;
            setPage(newPage);
            setSearchText("");
            setSearchResults([]);
            if (currentSelection) {
                console.log("Changing page, preserving selection:", {
                    email: currentSelection,
                    id: currentId,
                });
            }
        }
    };

    const clearFilters = () => {
        setFilters({
            hasEmail: false,
            hasName: false,
            hasLinkedIn: false,
            hasPhone: false,
            hasWebsite: false,
            company: undefined,
            country: undefined,
            position: undefined,
            liaison: undefined,
            status: "all",
            confidenceScore: undefined,
            meetingMethod: undefined,
            sortBy: "name",
        });
    };

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (key === "status" && value === "all") return false;
        if (key === "sortBy") return false;
        return !!value;
    }).length;

    const handleContactUpdate = React.useCallback(() => {
        // Invalidate both contacts and search queries
        queryClient.invalidateQueries({ queryKey: ["contacts"] });

        // If we're currently searching, re-trigger the search
        if (searchText.trim()) {
            setIsSearching(true);
            searchContacts(searchText)
                .then((results) => {
                    setSearchResults(results);
                })
                .catch((error) => {
                    console.error("Error refreshing search results:", error);
                    setSearchResults([]);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        }
    }, [queryClient, searchText]);

    return (
        <div className="flex flex-col h-full bg-background">
            <header className="border-b px-4 py-3 bg-background sticky top-0 z-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">Contacts</h1>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                                {displayedContactsCount.toLocaleString()}
                            </span>
                            <span>
                                {searchText.trim() ? "found" : "total"} contacts
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <Search
                                className={cn(
                                    "absolute left-2.5 top-2.5 h-4 w-4",
                                    isSearching
                                        ? "text-primary animate-pulse"
                                        : "text-muted-foreground"
                                )}
                            />
                            <Input
                                placeholder={
                                    isSearching
                                        ? "Searching..."
                                        : "Search contacts..."
                                }
                                className="pl-9 pr-4 py-2 h-10"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            {searchText && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1 h-8 w-8"
                                    onClick={() => setSearchText("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            activeFilterCount > 0
                                                ? "default"
                                                : "outline"
                                        }
                                        size="icon"
                                        className="h-10 w-10 relative"
                                        onClick={() => setIsFilterOpen(true)}
                                    >
                                        <Sliders className="h-4 w-4" />
                                        {activeFilterCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    Filter contacts
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => setLimit(parseInt(value))}
                        >
                            <SelectTrigger className="w-[120px] h-10">
                                <SelectValue placeholder="Show" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                                <SelectItem value="100">
                                    100 per page
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {activeFilterCount > 0 && (
                        <div className="flex gap-1.5 flex-wrap pt-1">
                            {filters.hasEmail && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Has Email
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                hasEmail: false,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.hasName && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Has Name
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                hasName: false,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.hasLinkedIn && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Has LinkedIn
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                hasLinkedIn: false,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.hasPhone && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Has Phone
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                hasPhone: false,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.hasWebsite && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Has Website
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                hasWebsite: false,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.company && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    {filters.company}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                company: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.country && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    {filters.country}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                country: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.position && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    {filters.position}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                position: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.liaison && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Liaison: {filters.liaison}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                liaison: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.status !== "all" && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    {filters.status}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                status: "all",
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.meetingMethod && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    {filters.meetingMethod}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                meetingMethod: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.confidenceScore && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Confidence:{" "}
                                    {filters.confidenceScore?.min ?? 0}-
                                    {filters.confidenceScore?.max ?? 100}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                confidenceScore: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={clearFilters}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                <div className="text-sm font-medium">
                    Showing{" "}
                    <span className="font-semibold text-primary">
                        {filteredContacts.length > 0
                            ? (page - 1) * limit + 1
                            : 0}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-primary">
                        {Math.min(page * limit, totalContacts)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-primary">
                        {totalContacts}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1 || isLoading}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium bg-background px-3 py-1 rounded-md border">
                        Page {page} of {totalPages || 1}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages || isLoading}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isLoading || (searchText.trim() && isSearching) ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin h-10 w-10 border-3 border-primary rounded-full border-t-transparent mb-4"></div>
                        <p className="text-muted-foreground">
                            {searchText.trim()
                                ? "Searching contacts..."
                                : "Loading contacts..."}
                        </p>
                    </div>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="rounded-full bg-muted h-16 w-16 flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-medium mb-2 text-foreground">
                        No contacts found
                    </p>
                    <p className="text-sm mb-6 max-w-md text-center">
                        {searchText ? (
                            <>
                                No contacts match your search for{" "}
                                <span className="font-medium text-foreground">
                                    &ldquo;{searchText}&rdquo;
                                </span>
                            </>
                        ) : activeFilterCount > 0 ? (
                            <>
                                Your current filter settings don&apos;t match
                                any contacts
                            </>
                        ) : (
                            <>
                                You don&apos;t have any contacts yet. Try adding
                                some!
                            </>
                        )}
                    </p>
                    {(activeFilterCount > 0 || searchText) && (
                        <div className="flex gap-3">
                            {searchText && (
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchText("")}
                                >
                                    Clear search
                                </Button>
                            )}
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="default"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="flex-1 min-h-0 overflow-auto"
                    style={{ height: `calc(100% - 140px)` }}
                >
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {virtualizer.getVirtualItems().map((virtualItem) => {
                            const item = filteredContacts[virtualItem.index];
                            if (!item) return null;
                            return (
                                <div
                                    key={virtualItem.key}
                                    className={cn(
                                        "absolute top-0 left-0 w-full",
                                        contact.selected ===
                                            (item?.email_address || "") &&
                                            "bg-accent"
                                    )}
                                    style={{
                                        height: `${virtualItem.size}px`,
                                        transform: `translateY(${virtualItem.start}px)`,
                                    }}
                                >
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 h-full border-b transition-colors mx-2 rounded-md",
                                            contact.selected ===
                                                (item?.email_address || "")
                                                ? "bg-accent border-accent shadow-sm"
                                                : "hover:bg-accent/40 border-border"
                                        )}
                                        onClick={() => {
                                            setContact({
                                                selected:
                                                    item?.email_address || "",
                                                selectedId: item?.id,
                                            });
                                        }}
                                        tabIndex={0}
                                    >
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg flex-shrink-0 relative">
                                            {item?.contact_name
                                                ?.charAt(0)
                                                .toUpperCase() ||
                                                item?.email_address
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                "?"}
                                            {item.status === "Contacted" && (
                                                <div className="absolute -top-1 -right-1 bg-primary rounded-full h-4 w-4 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-base truncate">
                                                {item.contact_name ||
                                                    item.email_address}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                                                <span className="truncate max-w-[200px] flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-muted-foreground/60" />
                                                    {item?.email_address ||
                                                        "No email"}
                                                </span>
                                                {item.company && (
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <span className="text-muted-foreground/60">
                                                            •
                                                        </span>
                                                        <span className="truncate max-w-[150px]">
                                                            {item.company}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-56"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/panel/email/compose?to=${item?.email_address || ""}`
                                                        )
                                                    }
                                                    className="cursor-pointer"
                                                    disabled={
                                                        !item?.email_address
                                                    }
                                                >
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    {item?.email_address
                                                        ? "Send Email"
                                                        : "No email available"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditingContact(item)
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Contact
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive cursor-pointer"
                                                    onClick={() =>
                                                        setDeleteId(item.id)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Contact
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={page <= 1 || isLoading}
                    className="h-8 px-3"
                >
                    First
                </Button>
                <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map(
                        (_, i) => {
                            const pageNumber = page <= 2 ? i + 1 : page - 2 + i;
                            if (pageNumber > totalPages) return null;

                            return (
                                <Button
                                    key={pageNumber}
                                    variant={
                                        pageNumber === page
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => handlePageChange(pageNumber)}
                                    disabled={isLoading}
                                    className="h-8 w-8"
                                >
                                    {pageNumber}
                                </Button>
                            );
                        }
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page >= totalPages || isLoading}
                    className="h-8 px-3"
                >
                    Last
                </Button>
            </div>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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

                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="basic">Basic</TabsTrigger>
                            <TabsTrigger value="organization">
                                Organization
                            </TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Sort By</h3>
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
                                <h3 className="text-sm font-medium">Status</h3>
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
                                                    hasEmail: checked === true,
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
                                                    hasName: checked === true,
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
                                                    hasPhone: checked === true,
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

                        <TabsContent value="organization" className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Company</h3>
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
                                            <SelectItem key={org} value={org}>
                                                {org}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Liaison</h3>
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
                                        {Array.from(
                                            new Set(
                                                contacts
                                                    .map((c) => c.liaison)
                                                    .filter(Boolean)
                                            )
                                        )
                                            .sort()
                                            .map((liaison) => (
                                                <SelectItem
                                                    key={liaison}
                                                    value={liaison as string}
                                                >
                                                    {liaison}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Country</h3>
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
                                        {Array.from(
                                            new Set(
                                                contacts
                                                    .map((c) => c.country)
                                                    .filter(Boolean)
                                            )
                                        )
                                            .sort()
                                            .map((country) => (
                                                <SelectItem
                                                    key={country}
                                                    value={country as string}
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
                                    value={filters.position || "any-position"}
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
                                        {Array.from(
                                            new Set(
                                                contacts
                                                    .map((c) => c.position)
                                                    .filter(Boolean)
                                            )
                                        )
                                            .sort()
                                            .map((position) => (
                                                <SelectItem
                                                    key={position}
                                                    value={position as string}
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
                                                filters.confidenceScore?.min ??
                                                ""
                                            }
                                            onChange={(e) => {
                                                const min =
                                                    parseInt(e.target.value) ||
                                                    0;
                                                setFilters({
                                                    ...filters,
                                                    confidenceScore: {
                                                        min: min,
                                                        max:
                                                            filters
                                                                .confidenceScore
                                                                ?.max ?? 100,
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
                                                filters.confidenceScore?.max ??
                                                ""
                                            }
                                            onChange={(e) => {
                                                const max =
                                                    parseInt(e.target.value) ||
                                                    100;
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
                                        filters.meetingMethod || "any-method"
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
                                        {Array.from(
                                            new Set(
                                                contacts
                                                    .map(
                                                        (c) => c.meeting_method
                                                    )
                                                    .filter(Boolean)
                                            )
                                        )
                                            .sort()
                                            .map((method) => (
                                                <SelectItem
                                                    key={method}
                                                    value={method as string}
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                            >
                                Reset All
                            </Button>
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => setIsFilterOpen(false)}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {editingContact && (
                <EditContactDrawer
                    contact={editingContact}
                    open={!!editingContact}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingContact(null);
                            handleContactUpdate();
                        }
                    }}
                />
            )}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the contact and remove their data from our
                            servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) handleDelete(deleteId);
                                setDeleteId(null);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
