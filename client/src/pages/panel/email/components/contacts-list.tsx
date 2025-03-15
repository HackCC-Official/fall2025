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
    Building,
    Briefcase,
    Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContact } from "@/hooks/use-contact";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
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
import { deleteContact } from "@/features/outreach/api/outreach";
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
    organization?: string;
    department?: string;
    industry?: string;
    contactType?: string;
    status?: "all" | "contacted" | "not-contacted";
    sortBy?: "name" | "email" | "organization" | "recent";
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
    const [editingContact, setEditingContact] =
        React.useState<ContactDto | null>(null);
    const [filters, setFilters] = React.useState<FilterOptions>({
        hasEmail: false,
        hasName: false,
        status: "all",
        sortBy: "name",
    });
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = React.useState<number | null>(null);
    const [debouncedSearch, setDebouncedSearch] = React.useState("");

    const {
        data,
        isLoading,
        pagination: { page, setPage, limit, setLimit, setSearch, totalPages },
    } = useContacts({
        initialLimit: 50,
        initialSearch: debouncedSearch,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const contacts = data?.data || initialContacts || [];
    const totalContacts = data?.total || 0;

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchText);
            setDebouncedSearch(searchText);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchText, setSearch]);

    const organizations = React.useMemo(() => {
        const uniqueOrgs = new Set<string>();
        contacts.forEach((c) => {
            if (c.organization) uniqueOrgs.add(c.organization);
        });
        return Array.from(uniqueOrgs).sort();
    }, [contacts]);

    const departments = React.useMemo(() => {
        const uniqueDepts = new Set<string>();
        contacts.forEach((c) => {
            if (c.department) uniqueDepts.add(c.department);
        });
        return Array.from(uniqueDepts).sort();
    }, [contacts]);

    const industries = React.useMemo(() => {
        const uniqueIndustries = new Set<string>();
        contacts.forEach((c) => {
            if (c.industry) uniqueIndustries.add(c.industry);
        });
        return Array.from(uniqueIndustries).sort();
    }, [contacts]);

    const contactTypes = React.useMemo(() => {
        const uniqueTypes = new Set<string>();
        contacts.forEach((c) => {
            if (c.type) uniqueTypes.add(c.type);
        });
        return Array.from(uniqueTypes).sort();
    }, [contacts]);

    const virtualizer = useVirtualizer({
        count: contacts.length,
        getScrollElement: () => containerRef.current,
        estimateSize: () => 85,
        overscan: 10,
    });

    const handleDelete = async (contactId: number) => {
        try {
            await deleteContact(contactId.toString());
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const currentSelection = contact.selected;
            const currentId = contact.selectedId;
            setPage(newPage);
            if (currentSelection) {
                console.log("Changing page, preserving selection:", {
                    email: currentSelection,
                    id: currentId,
                });
            }
        }
    };

    const filteredContacts = React.useMemo(() => {
        let filtered = [...contacts];

        if (filters.hasEmail) {
            filtered = filtered.filter((c) => !!c.email);
        }

        if (filters.hasName) {
            filtered = filtered.filter((c) => !!(c.first_name || c.last_name));
        }

        if (filters.organization) {
            filtered = filtered.filter(
                (c) => c.organization === filters.organization
            );
        }

        if (filters.department) {
            filtered = filtered.filter(
                (c) => c.department === filters.department
            );
        }

        if (filters.industry) {
            filtered = filtered.filter((c) => c.industry === filters.industry);
        }

        if (filters.contactType) {
            filtered = filtered.filter((c) => c.type === filters.contactType);
        }

        if (filters.status === "contacted") {
            filtered = filtered.filter((c) => c.been_contacted);
        } else if (filters.status === "not-contacted") {
            filtered = filtered.filter((c) => !c.been_contacted);
        }

        // Apply sorting
        if (filters.sortBy === "name") {
            filtered.sort((a, b) => {
                const nameA =
                    `${a.first_name || ""} ${a.last_name || ""}`.trim();
                const nameB =
                    `${b.first_name || ""} ${b.last_name || ""}`.trim();
                return nameA.localeCompare(nameB);
            });
        } else if (filters.sortBy === "email") {
            filtered.sort((a, b) => a.email.localeCompare(b.email));
        } else if (filters.sortBy === "organization") {
            filtered.sort((a, b) =>
                (a.organization || "").localeCompare(b.organization || "")
            );
        }

        return filtered;
    }, [contacts, filters]);

    const clearFilters = () => {
        setFilters({
            hasEmail: false,
            hasName: false,
            organization: undefined,
            department: undefined,
            industry: undefined,
            contactType: undefined,
            status: "all",
            sortBy: "name",
        });
    };

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (key === "status" && value === "all") return false;
        if (key === "sortBy") return false;
        return !!value;
    }).length;

    return (
        <div className="flex flex-col h-full bg-background">
            <header className="border-b px-4 py-3 bg-background sticky top-0 z-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">Contacts</h1>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                                {totalContacts.toLocaleString()}
                            </span>
                            <span>total contacts</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search contacts..."
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
                            {filters.organization && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    {filters.organization}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                organization: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.department && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Dept: {filters.department}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                department: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.industry && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Industry: {filters.industry}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                industry: undefined,
                                            })
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {filters.contactType && (
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 gap-1 pl-2"
                                >
                                    Type: {filters.contactType}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1"
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                contactType: undefined,
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
                                    {filters.status === "contacted"
                                        ? "Contacted"
                                        : "Not Contacted"}
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

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin h-10 w-10 border-3 border-primary rounded-full border-t-transparent mb-4"></div>
                        <p className="text-muted-foreground">
                            Loading contacts...
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
                            return (
                                <div
                                    key={`${item.id}-${virtualItem.index}`}
                                    className={cn(
                                        "absolute top-0 left-0 w-full",
                                        contact.selected === item.email &&
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
                                            contact.selected === item.email
                                                ? "bg-accent border-accent shadow-sm"
                                                : "hover:bg-accent/40 border-border"
                                        )}
                                    >
                                        <button
                                            onClick={() => {
                                                setContact({
                                                    selected: item.email,
                                                    selectedId: item.id,
                                                });
                                            }}
                                            className="flex-1 text-left flex items-center gap-3"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg flex-shrink-0 relative">
                                                {item.first_name
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    item.email
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                {item.been_contacted && (
                                                    <div className="absolute -top-1 -right-1 bg-primary rounded-full h-4 w-4 flex items-center justify-center">
                                                        <Check className="h-3 w-3 text-primary-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-base truncate">
                                                    {`${item.first_name || ""} ${item.last_name || ""}`.trim() ||
                                                        item.email}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                                                    <span className="truncate max-w-[200px] flex items-center gap-1">
                                                        <Mail className="h-3 w-3 text-muted-foreground/60" />
                                                        {item.email}
                                                    </span>
                                                    {item.organization && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <span className="text-muted-foreground/60">
                                                                •
                                                            </span>
                                                            <Building className="h-3 w-3 text-muted-foreground/60" />
                                                            <span className="truncate max-w-[150px]">
                                                                {
                                                                    item.organization
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {item.position && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <span className="text-muted-foreground/60">
                                                                •
                                                            </span>
                                                            <Briefcase className="h-3 w-3 text-muted-foreground/60" />
                                                            <span className="truncate max-w-[120px]">
                                                                {item.position}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
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
                                                            `/panel/email/compose?to=${item.email}`
                                                        )
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Email
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
                                                | "organization"
                                                | "recent",
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
                                        <SelectItem value="organization">
                                            Organization
                                        </SelectItem>
                                        <SelectItem value="recent">
                                            Recently Added
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
                                                | "contacted"
                                                | "not-contacted",
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
                                        <SelectItem value="contacted">
                                            Contacted
                                        </SelectItem>
                                        <SelectItem value="not-contacted">
                                            Not Contacted
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                    Contact Type
                                </h3>
                                <Select
                                    value={filters.contactType || "any-type"}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            contactType:
                                                value === "any-type"
                                                    ? undefined
                                                    : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Contact Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any-type">
                                            Any Type
                                        </SelectItem>
                                        {contactTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
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
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="organization" className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                    Organization
                                </h3>
                                <Select
                                    value={
                                        filters.organization ||
                                        "any-organization"
                                    }
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            organization:
                                                value === "any-organization"
                                                    ? undefined
                                                    : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any-organization">
                                            Any Organization
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
                                <h3 className="text-sm font-medium">
                                    Department
                                </h3>
                                <Select
                                    value={
                                        filters.department || "any-department"
                                    }
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            department:
                                                value === "any-department"
                                                    ? undefined
                                                    : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any-department">
                                            Any Department
                                        </SelectItem>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept}>
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                    Industry
                                </h3>
                                <Select
                                    value={filters.industry || "any-industry"}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            industry:
                                                value === "any-industry"
                                                    ? undefined
                                                    : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any-industry">
                                            Any Industry
                                        </SelectItem>
                                        {industries.map((industry) => (
                                            <SelectItem
                                                key={industry}
                                                value={industry}
                                            >
                                                {industry}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="advanced" className="space-y-4">
                            <div className="bg-muted/30 rounded-lg p-4">
                                <h3 className="text-sm font-medium mb-2">
                                    Coming Soon
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Advanced filtering options will be available
                                    in a future update.
                                </p>
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
                    onOpenChange={(open) => !open && setEditingContact(null)}
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
