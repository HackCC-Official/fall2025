"use client";

import * as React from "react";
import { Calendar, Filter, Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMail } from "@/hooks/use-mail";
import type { SendEmailDto } from "@/features/outreach/types/email.dto";
import type { Mail } from "@/types/mail";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

/**
 * Type definition for email filter criteria
 */
interface EmailFilters {
    status: string[];
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    showBatchOnly: boolean;
}

interface InboxProps {
    className?: string;
    emails: SendEmailDto[];
}

export default function Inbox({ className, emails = [] }: InboxProps) {
    const [mail, setMail] = useMail();
    const [filteredEmails, setFilteredEmails] = React.useState<Mail[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [searchQuery, setSearchQuery] = React.useState<string>("");

    // Filter states
    const [showFilters, setShowFilters] = React.useState<boolean>(false);
    const [filters, setFilters] = React.useState<EmailFilters>({
        status: [],
        dateRange: {
            from: undefined,
            to: undefined,
        },
        showBatchOnly: false,
    });

    // Available status options for filtering
    const statusOptions = ["delivered", "sent", "failed"];

    // Get the selected account from localStorage
    const selectedAccount = React.useMemo(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("selectedOutreachAccount") || "";
        }
        return "";
    }, []);

    // Transform SendEmailDto to Mail type
    React.useEffect(() => {
        console.log("Inbox received emails:", emails);

        if (!emails.length) {
            setFilteredEmails([]);
            return;
        }

        setIsLoading(true);

        try {
            const transformed = emails.map((email): Mail => {
                // Make sure to preserve the original ID for proper selection
                const emailId = email.id || crypto.randomUUID();

                // Format recipients appropriately - handle both string emails and objects
                const formattedRecipients = Array.isArray(email.to)
                    ? email.to.map((recipient) => {
                          if (typeof recipient === "string") {
                              return { email: recipient };
                          }
                          return recipient;
                      })
                    : [];

                return {
                    id: emailId,
                    from: email.from,
                    to: formattedRecipients,
                    subject: email.subject || "(No subject)",
                    html: email.html,
                    date: email.createdAt || new Date().toISOString(),
                    read: false,
                    labels: [email.status || "sent"],
                };
            });

            console.log("Transformed emails:", transformed);
            setFilteredEmails(transformed);
        } catch (error) {
            console.error("Error transforming emails:", error);
        } finally {
            setIsLoading(false);
        }
    }, [emails]);

    const updateFilter = React.useCallback(
        (key: keyof EmailFilters, value: unknown) => {
            setFilters((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        []
    );

    const toggleStatusFilter = React.useCallback((status: string) => {
        setFilters((prev) => {
            const newStatuses = prev.status.includes(status)
                ? prev.status.filter((s) => s !== status)
                : [...prev.status, status];

            return {
                ...prev,
                status: newStatuses,
            };
        });
    }, []);

    const resetFilters = React.useCallback(() => {
        setFilters({
            status: [],
            dateRange: {
                from: undefined,
                to: undefined,
            },
            showBatchOnly: false,
        });
    }, []);

    const hasActiveFilters = React.useMemo(() => {
        return (
            filters.status.length > 0 ||
            filters.dateRange.from !== undefined ||
            filters.dateRange.to !== undefined ||
            filters.showBatchOnly
        );
    }, [filters]);

    const displayedEmails = React.useMemo(() => {
        let result = filteredEmails;

        if (searchQuery.trim()) {
            result = result.filter(
                (email) =>
                    email.subject
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    email.html
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    email.to.some((recipient) =>
                        recipient.email
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    ) ||
                    email.from.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.status.length > 0) {
            result = result.filter((email) =>
                email.labels?.some((label) =>
                    filters.status.includes(label.toLowerCase())
                )
            );
        }

        if (filters.dateRange.from || filters.dateRange.to) {
            result = result.filter((email) => {
                const emailDate = new Date(email.date);

                if (filters.dateRange.from && filters.dateRange.to) {
                    return (
                        emailDate >= filters.dateRange.from &&
                        emailDate <= filters.dateRange.to
                    );
                } else if (filters.dateRange.from) {
                    return emailDate >= filters.dateRange.from;
                } else if (filters.dateRange.to) {
                    return emailDate <= filters.dateRange.to;
                }

                return true;
            });
        }

        if (filters.showBatchOnly) {
            result = result.filter((email) => email.id.startsWith("batch-"));
        }

        return result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA; // Descending order (newest first)
        });
    }, [filteredEmails, searchQuery, filters]);

    return (
        <div className={cn("flex flex-col h-full min-h-0", className)}>
            <div className="flex justify-between items-center px-4 py-2">
                <h1 className="font-bold text-lg lg:text-xl">Sent</h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(hasActiveFilters && "text-primary")}
                >
                    <Filter className="mr-2 w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                        <Badge className="ml-2" variant="secondary">
                            {filters.status.length +
                                (filters.dateRange.from || filters.dateRange.to
                                    ? 1
                                    : 0) +
                                (filters.showBatchOnly ? 1 : 0)}
                        </Badge>
                    )}
                </Button>
            </div>
            <Separator />

            {showFilters && (
                <div className="bg-muted/40 p-4 md:p-6">
                    <div className="gap-6 grid grid-cols-1">
                        <div className="space-y-3">
                            <h3 className="font-medium text-sm">Status</h3>
                            <div className="flex flex-wrap gap-4">
                                {statusOptions.map((status) => (
                                    <div
                                        key={status}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`status-${status}`}
                                            checked={filters.status.includes(
                                                status
                                            )}
                                            onCheckedChange={() =>
                                                toggleStatusFilter(status)
                                            }
                                        />
                                        <Label
                                            htmlFor={`status-${status}`}
                                            className="capitalize"
                                        >
                                            {status}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-medium text-sm">Date Range</h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="w-full sm:w-auto">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="justify-start w-full sm:w-[200px] font-normal text-left"
                                            >
                                                <Calendar className="flex-shrink-0 mr-2 w-4 h-4" />
                                                <span className="truncate">
                                                    {filters.dateRange.from
                                                        ? format(
                                                              filters.dateRange
                                                                  .from,
                                                              "PPP"
                                                          )
                                                        : "Start date"}
                                                </span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="p-0 w-auto"
                                            align="start"
                                        >
                                            <CalendarComponent
                                                mode="single"
                                                selected={
                                                    filters.dateRange.from
                                                }
                                                onSelect={(date) =>
                                                    updateFilter("dateRange", {
                                                        ...filters.dateRange,
                                                        from: date,
                                                    })
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="w-full sm:w-auto">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="justify-start w-full sm:w-[200px] font-normal text-left"
                                            >
                                                <Calendar className="flex-shrink-0 mr-2 w-4 h-4" />
                                                <span className="truncate">
                                                    {filters.dateRange.to
                                                        ? format(
                                                              filters.dateRange
                                                                  .to,
                                                              "PPP"
                                                          )
                                                        : "End date"}
                                                </span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="p-0 w-auto"
                                            align="start"
                                        >
                                            <CalendarComponent
                                                mode="single"
                                                selected={filters.dateRange.to}
                                                onSelect={(date) =>
                                                    updateFilter("dateRange", {
                                                        ...filters.dateRange,
                                                        to: date,
                                                    })
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-medium text-sm">
                                Other Filters
                            </h3>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="batch-only"
                                    checked={filters.showBatchOnly}
                                    onCheckedChange={(checked) =>
                                        updateFilter(
                                            "showBatchOnly",
                                            Boolean(checked)
                                        )
                                    }
                                />
                                <Label htmlFor="batch-only">
                                    Batch emails only
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="mr-2"
                        >
                            Reset
                        </Button>
                        <Button onClick={() => setShowFilters(false)}>
                            Apply
                        </Button>
                    </div>
                </div>
            )}

            <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur p-4">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="relative">
                        <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="top-1 right-1 absolute p-0 w-7 h-7"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </form>

                {hasActiveFilters && (
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                        <span>Filters:</span>
                        {filters.status.map((status) => (
                            <Badge
                                key={status}
                                variant="outline"
                                className="capitalize"
                            >
                                {status}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="ml-1 p-0 w-4 h-4"
                                    onClick={() => toggleStatusFilter(status)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        ))}
                        {(filters.dateRange.from || filters.dateRange.to) && (
                            <Badge variant="outline">
                                Date range
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="ml-1 p-0 w-4 h-4"
                                    onClick={() =>
                                        updateFilter("dateRange", {
                                            from: undefined,
                                            to: undefined,
                                        })
                                    }
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        )}
                        {filters.showBatchOnly && (
                            <Badge variant="outline">
                                Batch only
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="ml-1 p-0 w-4 h-4"
                                    onClick={() =>
                                        updateFilter("showBatchOnly", false)
                                    }
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        )}
                        <Button
                            size="sm"
                            variant="link"
                            className="ml-auto p-0 h-auto"
                            onClick={resetFilters}
                        >
                            Clear all
                        </Button>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">Loading emails...</p>
                </div>
            ) : displayedEmails.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground text-sm lg:text-base">
                        {selectedAccount
                            ? hasActiveFilters
                                ? "No emails match your filters"
                                : `No emails found for ${selectedAccount}`
                            : "Select an account to view emails"}
                    </p>
                </div>
            ) : (
                <ScrollArea className="h-full min-h-0">
                    <div className="flex flex-col gap-2 p-4 pt-0">
                        {displayedEmails.map((item) => (
                            <button
                                key={item.id}
                                className={cn(
                                    "flex flex-col items-start gap-2 hover:bg-accent p-3 border rounded-lg text-sm text-left transition-all",
                                    mail.selected === item.id && "bg-muted"
                                )}
                                onClick={() => {
                                    // Find the original email in the emails array by id
                                    const originalEmail = emails.find(
                                        (email) => email.id === item.id
                                    );
                                    console.log(
                                        "Selected email:",
                                        originalEmail
                                    );

                                    setMail({
                                        ...mail,
                                        selected: item.id,
                                    });
                                }}
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="font-semibold">
                                                <span className="mr-1 text-muted-foreground">
                                                    From:
                                                </span>
                                                {item.from || "Unknown sender"}
                                            </div>
                                            {!item.read && (
                                                <span className="flex bg-blue-600 rounded-full w-2 h-2" />
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                "ml-auto text-xs",
                                                mail.selected === item.id
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            {formatDistanceToNow(
                                                new Date(item.date),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs">
                                        <span className="mr-1 text-muted-foreground">
                                            To:
                                        </span>
                                        {item.to && item.to.length > 0
                                            ? item.to[0].name ||
                                              item.to[0].email
                                            : "Unknown recipient"}
                                    </div>
                                    <div className="font-medium text-xs">
                                        {item.subject || "(No subject)"}
                                    </div>
                                </div>
                                <div className="text-muted-foreground text-xs line-clamp-2">
                                    {item.html
                                        .replace(/<[^>]*>/g, "")
                                        .replace(/&nbsp;/g, " ")
                                        .replace(/\s+/g, " ")
                                        .trim()
                                        .substring(0, 300)}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {item.labels?.map((label) => (
                                        <Badge
                                            key={label}
                                            variant={getBadgeVariantFromLabel(
                                                label
                                            )}
                                        >
                                            {label}
                                        </Badge>
                                    ))}

                                    {item.id.startsWith("batch-") && (
                                        <Badge variant="outline">Batch</Badge>
                                    )}
                                </div>
                                {item.to && item.to.length > 1 && (
                                    <div className="mt-2 text-muted-foreground text-xs">
                                        <span className="font-medium">
                                            All recipients:{" "}
                                        </span>
                                        {item.to.map((recipient, index) => (
                                            <span
                                                key={`${recipient.email}-${index}`}
                                            >
                                                {recipient.name ||
                                                    recipient.email}
                                                {index < item.to.length - 1
                                                    ? ", "
                                                    : ""}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}

function getBadgeVariantFromLabel(
    label: string
): ComponentProps<typeof Badge>["variant"] {
    switch (label.toLowerCase()) {
        case "delivered":
            return "default";
        case "sent":
            return "outline";
        case "failed":
            return "destructive";
        case "important":
            return "destructive";
        case "personal":
            return "secondary";
        default:
            return "secondary";
    }
}
