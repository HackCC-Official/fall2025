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
    SlidersHorizontal,
    Plus,
    Filter,
    Check,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";

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
}

// Define filter condition types
type FilterOperator =
    | "equals"
    | "contains"
    | "not_equals"
    | "not_contains"
    | "is_empty"
    | "is_not_empty";
type FilterField = "name" | "email" | "company" | "liaison" | "status";

interface FilterCondition {
    id: string;
    field: FilterField;
    operator: FilterOperator;
    value: string;
}

interface AdvancedFilterDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyFilters: (conditions: FilterCondition[]) => void;
    contacts: ContactDto[];
    initialConditions?: FilterCondition[];
}

const getFieldOptions = () => [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Company", value: "company" },
    { label: "Liaison", value: "liaison" },
    { label: "Status", value: "status" },
];

const getOperatorOptions = (): Array<{
    label: string;
    value: FilterOperator;
}> => {
    const baseOperators: Array<{ label: string; value: FilterOperator }> = [
        { label: "Equals", value: "equals" },
        { label: "Contains", value: "contains" },
        { label: "Not equals", value: "not_equals" },
        { label: "Not contains", value: "not_contains" },
        { label: "Is empty", value: "is_empty" },
        { label: "Is not empty", value: "is_not_empty" },
    ];

    return baseOperators;
};

// Function to apply filter conditions to contacts
const applyFilterConditions = (
    contacts: ContactDto[],
    conditions: FilterCondition[]
): ContactDto[] => {
    if (!conditions.length) return contacts;

    return contacts.filter((contact) => {
        return conditions.every((condition) => {
            const fieldValue = getContactFieldValue(contact, condition.field);

            // Handle empty value operators
            if (condition.operator === "is_empty") {
                return !fieldValue;
            }

            if (condition.operator === "is_not_empty") {
                return !!fieldValue;
            }

            // Skip if no value to compare against
            if (!fieldValue) return false;

            const fieldValueLower = String(fieldValue).toLowerCase();
            const conditionValueLower = condition.value.toLowerCase();

            switch (condition.operator) {
                case "equals":
                    return fieldValueLower === conditionValueLower;
                case "contains":
                    return fieldValueLower.includes(conditionValueLower);
                case "not_equals":
                    return fieldValueLower !== conditionValueLower;
                case "not_contains":
                    return !fieldValueLower.includes(conditionValueLower);
                default:
                    return true;
            }
        });
    });
};

// Helper function to get field value from a contact
const getContactFieldValue = (
    contact: ContactDto,
    field: FilterField
): string => {
    switch (field) {
        case "name":
            return contact.contact_name || "";
        case "email":
            return contact.email_address || "";
        case "company":
            return contact.company || "";
        case "liaison":
            return contact.liaison || "";
        case "status":
            return contact.status || "";
        default:
            return "";
    }
};

// Get field-specific suggestions for values
const getValueSuggestions = (
    contacts: ContactDto[],
    field: FilterField
): string[] => {
    if (!contacts.length) return [];

    const values = new Set<string>();

    contacts.forEach((contact) => {
        const value = getContactFieldValue(contact, field);
        if (value) values.add(value);
    });

    return Array.from(values).sort();
};

const AdvancedFilterDialog: React.FC<AdvancedFilterDialogProps> = ({
    isOpen,
    onOpenChange,
    onApplyFilters,
    contacts,
    initialConditions = [],
}) => {
    const [conditions, setConditions] =
        React.useState<FilterCondition[]>(initialConditions);
    const [suggestionSearch, setSuggestionSearch] = React.useState("");

    // Reset conditions when dialog opens with initialConditions
    React.useEffect(() => {
        if (isOpen) {
            setConditions(initialConditions);
        }
    }, [isOpen, initialConditions]);

    const addCondition = () => {
        const newCondition: FilterCondition = {
            id: Date.now().toString(),
            field: "name",
            operator: "contains",
            value: "",
        };
        setConditions([...conditions, newCondition]);
    };

    const removeCondition = (id: string) => {
        setConditions(conditions.filter((c) => c.id !== id));
    };

    const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
        setConditions(
            conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
    };

    const handleApply = () => {
        // Filter out incomplete conditions
        const validConditions = conditions.filter(
            (c) =>
                c.operator === "is_empty" ||
                c.operator === "is_not_empty" ||
                (c.value && c.value.trim() !== "")
        );

        onApplyFilters(validConditions);
        onOpenChange(false);
    };

    const getPreviewCount = () => {
        return applyFilterConditions(contacts, conditions).length;
    };

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
                <DialogDescription>
                    Define multiple conditions to filter contacts. All
                    conditions must match (AND logic).
                </DialogDescription>
            </DialogHeader>

            <div className="py-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {conditions.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                            <p>No filter conditions defined yet.</p>
                            <p className="text-sm">
                                Click &quot;Add Condition&quot; to start
                                building your filter.
                            </p>
                        </div>
                    ) : (
                        conditions.map((condition) => (
                            <div
                                key={condition.id}
                                className="flex items-start gap-2 p-3 border rounded-md bg-muted/20"
                            >
                                <div className="flex-1 grid grid-cols-12 gap-2">
                                    <div className="col-span-3">
                                        <Select
                                            value={condition.field}
                                            onValueChange={(value) =>
                                                updateCondition(condition.id, {
                                                    field: value as FilterField,
                                                    // Reset value when changing field
                                                    value: "",
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Field" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getFieldOptions().map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-4">
                                        <Select
                                            value={condition.operator}
                                            onValueChange={(value) =>
                                                updateCondition(condition.id, {
                                                    operator:
                                                        value as FilterOperator,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Operator" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getOperatorOptions().map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {condition.operator !== "is_empty" &&
                                        condition.operator !==
                                            "is_not_empty" && (
                                            <div className="col-span-5">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="Value"
                                                                value={
                                                                    condition.value
                                                                }
                                                                onChange={(e) =>
                                                                    updateCondition(
                                                                        condition.id,
                                                                        {
                                                                            value: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                className="w-full pr-8"
                                                            />
                                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-[250px] p-0"
                                                        align="end"
                                                    >
                                                        <div className="p-2 border-b">
                                                            <div className="relative">
                                                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                <Input
                                                                    placeholder="Search values..."
                                                                    value={
                                                                        suggestionSearch
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setSuggestionSearch(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="pl-8 h-8 text-sm"
                                                                />
                                                                {suggestionSearch && (
                                                                    <X
                                                                        onClick={() =>
                                                                            setSuggestionSearch(
                                                                                ""
                                                                            )
                                                                        }
                                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ScrollArea className="h-[200px]">
                                                            <div className="p-2">
                                                                <p className="text-sm font-medium mb-2">
                                                                    Suggestions
                                                                </p>
                                                                {getValueSuggestions(
                                                                    contacts,
                                                                    condition.field
                                                                )
                                                                    .filter(
                                                                        (
                                                                            suggestion
                                                                        ) =>
                                                                            suggestion
                                                                                .toLowerCase()
                                                                                .includes(
                                                                                    suggestionSearch.toLowerCase()
                                                                                )
                                                                    )
                                                                    .map(
                                                                        (
                                                                            suggestion,
                                                                            i
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-muted rounded-sm"
                                                                                onClick={() => {
                                                                                    updateCondition(
                                                                                        condition.id,
                                                                                        {
                                                                                            value: suggestion,
                                                                                        }
                                                                                    );
                                                                                    setSuggestionSearch(
                                                                                        ""
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {
                                                                                    suggestion
                                                                                }
                                                                            </div>
                                                                        )
                                                                    )}
                                                                {getValueSuggestions(
                                                                    contacts,
                                                                    condition.field
                                                                ).filter(
                                                                    (
                                                                        suggestion
                                                                    ) =>
                                                                        suggestion
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                suggestionSearch.toLowerCase()
                                                                            )
                                                                ).length ===
                                                                    0 && (
                                                                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                                        No
                                                                        suggestions
                                                                        match
                                                                        your
                                                                        search
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </ScrollArea>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        )}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        removeCondition(condition.id)
                                    }
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addCondition}
                        className="flex items-center gap-1"
                    >
                        <Plus className="h-4 w-4" /> Add Condition
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        Preview:{" "}
                        <span className="font-medium">{getPreviewCount()}</span>{" "}
                        contacts match
                    </div>
                </div>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                    onClick={handleApply}
                    disabled={conditions.length === 0}
                >
                    Apply Filters
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

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
                                    contact.status
                                        ? contact.status === "Cold"
                                            ? "bg-blue-100 dark:bg-blue-900/20"
                                            : contact.status ===
                                                    "Follow Up 1" ||
                                                contact.status === "Follow Up 2"
                                              ? "bg-amber-100 dark:bg-amber-900/20"
                                              : contact.status === "Accept"
                                                ? "bg-green-100 dark:bg-green-900/20"
                                                : contact.status === "Rejected"
                                                  ? "bg-red-100 dark:bg-red-900/20"
                                                  : contact.status ===
                                                      "Contacted"
                                                    ? "bg-purple-100 dark:bg-purple-900/20"
                                                    : "bg-purple-100 dark:bg-purple-900/20"
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
                                {contact.status && (
                                    <TableCell>
                                        <div
                                            className={cn(
                                                "absolute -top-1 -right-1 rounded-full h-4 w-4 flex items-center justify-center",
                                                contact.status === "Cold" &&
                                                    "bg-blue-500",
                                                contact.status ===
                                                    "Follow Up 1" &&
                                                    "bg-amber-500",
                                                contact.status ===
                                                    "Follow Up 2" &&
                                                    "bg-amber-600",
                                                contact.status === "Accept" &&
                                                    "bg-green-500",
                                                contact.status === "Rejected" &&
                                                    "bg-red-500",
                                                contact.status ===
                                                    "Contacted" &&
                                                    "bg-purple-500",
                                                ![
                                                    "Cold",
                                                    "Follow Up 1",
                                                    "Follow Up 2",
                                                    "Accept",
                                                    "Rejected",
                                                    "Contacted",
                                                ].includes(contact.status) &&
                                                    "bg-primary"
                                            )}
                                        >
                                            <Check className="h-3 w-3 text-primary-foreground" />
                                        </div>
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
                        {contacts.length > 0 && (
                            <span className="ml-1">
                                (showing {contacts.length} items)
                            </span>
                        )}
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
                                                <div
                                                    className={cn(
                                                        "absolute -top-1 -right-1 rounded-full h-4 w-4 flex items-center justify-center",
                                                        contact.status ===
                                                            "Cold" &&
                                                            "bg-blue-500",
                                                        contact.status ===
                                                            "Follow Up 1" &&
                                                            "bg-amber-500",
                                                        contact.status ===
                                                            "Follow Up 2" &&
                                                            "bg-amber-600",
                                                        contact.status ===
                                                            "Accept" &&
                                                            "bg-green-500",
                                                        contact.status ===
                                                            "Rejected" &&
                                                            "bg-red-500",
                                                        contact.status ===
                                                            "Contacted" &&
                                                            "bg-purple-500",
                                                        ![
                                                            "Cold",
                                                            "Follow Up 1",
                                                            "Follow Up 2",
                                                            "Accept",
                                                            "Rejected",
                                                            "Contacted",
                                                        ].includes(
                                                            contact.status
                                                        ) && "bg-primary"
                                                    )}
                                                >
                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                </div>
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
}) => {
    // Use globalFilters.search as the initial value for searchQuery to sync with URL parameters
    const [searchQuery, setSearchQuery] = React.useState(
        globalFilters.search || ""
    );
    const [isSearching, setIsSearching] = React.useState(false);
    const [isSelectingAll, setIsSelectingAll] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState<ContactDto[]>([]);
    const [inSearchMode, setInSearchMode] = React.useState(
        !!globalFilters.search
    );

    // Add state to store filtered contacts
    const [filteredContactsCache, setFilteredContactsCache] = React.useState<
        ContactDto[]
    >([]);
    const [totalFilteredCount, setTotalFilteredCount] = React.useState(0);

    // Log when selected recipients changes
    React.useEffect(() => {
        console.log(
            `RecipientSelector: selectedRecipients changed - count: ${selectedRecipients.size}`
        );
    }, [selectedRecipients]);

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

    // Update searchQuery when globalFilters.search changes (for URL parameters)
    React.useEffect(() => {
        if (globalFilters.search) {
            setSearchQuery(globalFilters.search);
            setInSearchMode(true);

            // If we have a specific email and we're in employers view, filter immediately
            if (
                globalFilters.search.includes("@") &&
                recipientType === "employers"
            ) {
                debouncedSearchContacts(globalFilters.search);
            }
        }
    }, [globalFilters.search, recipientType, debouncedSearchContacts]);

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

    // Add advanced filter state
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] =
        React.useState(false);
    const [advancedFilterConditions, setAdvancedFilterConditions] =
        React.useState<FilterCondition[]>([]);
    const [isUsingAdvancedFilter, setIsUsingAdvancedFilter] =
        React.useState(false);

    // Apply advanced filters
    const applyAdvancedFilters = (conditions: FilterCondition[]) => {
        setAdvancedFilterConditions(conditions);
        setIsUsingAdvancedFilter(conditions.length > 0);

        if (conditions.length > 0) {
            // Clear other filters when using advanced filters
            setGlobalFilters({
                liaison: null,
                status: null,
                search: "",
            });

            toast.success(
                `Advanced filter with ${conditions.length} condition${conditions.length !== 1 ? "s" : ""} applied`
            );
        } else {
            setIsUsingAdvancedFilter(false);
            toast.info("Advanced filters cleared");
        }
    };

    // Get the contacts to display based on search mode and filters
    const contactsToDisplay = React.useMemo(() => {
        if (inSearchMode && searchResults.length > 0) {
            return searchResults;
        }

        // If we are using advanced filters, apply those first
        if (isUsingAdvancedFilter && advancedFilterConditions.length > 0) {
            // Use allContacts as the data source for advanced filtering
            const filtered = applyFilterConditions(
                allContacts,
                advancedFilterConditions
            );

            // Store the total filtered count for logging and debugging
            if (filtered.length !== totalFilteredCount) {
                setTotalFilteredCount(filtered.length);
                console.log(
                    `Total filtered contacts (advanced): ${filtered.length}`
                );
            }

            // Store the complete filtered list for reference
            if (
                JSON.stringify(filtered) !==
                JSON.stringify(filteredContactsCache)
            ) {
                setFilteredContactsCache(filtered);
            }

            // Implement client-side pagination for filtered results
            const pageSize = 50; // Match the API page size
            const startIndex = (contactsPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            console.log(
                `Displaying filtered contacts from index ${startIndex} to ${endIndex} (Page ${contactsPage})`
            );

            return filtered.slice(startIndex, endIndex);
        }

        // If we have global filters active, apply them client-side
        if (globalFilters.liaison || globalFilters.status) {
            // Use allContacts as the data source when filters are applied
            let filtered = [...allContacts];

            // Apply liaison filter
            if (globalFilters.liaison) {
                filtered = filtered.filter(
                    (contact) => contact.liaison === globalFilters.liaison
                );
            }

            // Apply status filter
            if (globalFilters.status) {
                filtered = filtered.filter(
                    (contact) => contact.status === globalFilters.status
                );
            }

            // Apply search filter
            if (globalFilters.search && globalFilters.search.length > 1) {
                const searchLower = globalFilters.search.toLowerCase();
                filtered = filtered.filter(
                    (contact) =>
                        contact.contact_name
                            ?.toLowerCase()
                            .includes(searchLower) ||
                        contact.email_address
                            ?.toLowerCase()
                            .includes(searchLower) ||
                        contact.company?.toLowerCase().includes(searchLower)
                );
            }

            // Store the total filtered count for logging and debugging
            if (filtered.length !== totalFilteredCount) {
                setTotalFilteredCount(filtered.length);
                console.log(`Total filtered contacts: ${filtered.length}`);
            }

            // Store the complete filtered list for reference
            if (
                JSON.stringify(filtered) !==
                JSON.stringify(filteredContactsCache)
            ) {
                setFilteredContactsCache(filtered);
            }

            // Implement client-side pagination for filtered results
            const pageSize = 50; // Match the API page size
            const startIndex = (contactsPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            console.log(
                `Displaying filtered contacts from index ${startIndex} to ${endIndex} (Page ${contactsPage})`
            );

            return filtered.slice(startIndex, endIndex);
        }

        return contacts;
    }, [
        inSearchMode,
        searchResults,
        contacts,
        allContacts,
        globalFilters,
        contactsPage,
        filteredContactsCache,
        totalFilteredCount,
        isUsingAdvancedFilter,
        advancedFilterConditions,
    ]);

    // Calculate total pages for client-side pagination when filters are applied
    const effectiveTotalPages = React.useMemo(() => {
        if (
            isUsingAdvancedFilter ||
            globalFilters.liaison ||
            globalFilters.status
        ) {
            // Use the cached filtered contacts to calculate pages
            const filteredLength =
                filteredContactsCache.length > 0
                    ? filteredContactsCache.length
                    : totalFilteredCount;

            const pageSize = 50; // Match the API page size
            const calculatedPages = Math.max(
                1,
                Math.ceil(filteredLength / pageSize)
            );
            console.log(
                `Calculated ${calculatedPages} total pages for ${filteredLength} filtered contacts`
            );
            return calculatedPages;
        }

        return inSearchMode ? 1 : contactsTotalPages || 1;
    }, [
        globalFilters,
        filteredContactsCache,
        inSearchMode,
        contactsTotalPages,
        totalFilteredCount,
        isUsingAdvancedFilter,
    ]);

    const handleContactsPageChange = (newPage: number) => {
        // Don't trigger pagination when in search mode
        if (inSearchMode) return;

        console.log(`Changing page from ${contactsPage} to ${newPage}`);

        // For client-side pagination (filtered results)
        if (globalFilters.liaison || globalFilters.status) {
            // Log page change event to help with debugging
            const pageSize = 50;
            const startIndex = (newPage - 1) * pageSize;
            const endIndex = Math.min(
                startIndex + pageSize,
                totalFilteredCount
            );
            console.log(
                `Will display items ${startIndex}-${endIndex} of ${totalFilteredCount} filtered contacts`
            );
        }

        setContactsPage(newPage);

        // Only call API pagination when no filters are applied
        if (!globalFilters.liaison && !globalFilters.status) {
            setContactsApiPage(newPage);
        }
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

    // Modify handleSelectAllContacts to handle advanced filters
    const handleSelectAllContacts = async () => {
        // Show loading state
        setIsSelectingAll(true);

        try {
            toast.info("Loading all recipients...", { duration: 2000 });

            const allRecipientsIds = new Set<string>();

            if (recipientType === "employers") {
                // First, ensure we have all contacts loaded
                let allContactsData = allContacts;

                // If we're using advanced filtering or global filters, make sure we have all data
                // This is critical to ensure we don't just select the paginated subset
                if (
                    isUsingAdvancedFilter ||
                    globalFilters.liaison ||
                    globalFilters.status ||
                    globalFilters.search
                ) {
                    // Only fetch if we don't already have a large set of contacts
                    if (allContactsData.length < 1000) {
                        try {
                            // Show loading toast
                            toast.info(
                                "Loading all contacts to apply filters...",
                                { duration: 3000 }
                            );

                            // Fetch all contacts with a large limit
                            allContactsData = await fetchAllContacts(
                                5000,
                                globalFilters.search || ""
                            );
                        } catch (error) {
                            console.error("Error loading all contacts:", error);
                            toast.error(
                                "Failed to load all contacts. Selection may be incomplete."
                            );
                        }
                    }
                }

                // Apply advanced filters if active
                let filtered = allContactsData;
                if (
                    isUsingAdvancedFilter &&
                    advancedFilterConditions.length > 0
                ) {
                    filtered = applyFilterConditions(
                        allContactsData,
                        advancedFilterConditions
                    );
                }
                // Otherwise apply global filters
                else if (
                    globalFilters.liaison ||
                    globalFilters.status ||
                    globalFilters.search
                ) {
                    // Apply liaison filter
                    if (globalFilters.liaison) {
                        filtered = filtered.filter(
                            (contact) =>
                                contact.liaison === globalFilters.liaison
                        );
                    }

                    // Apply status filter
                    if (globalFilters.status) {
                        filtered = filtered.filter(
                            (contact) => contact.status === globalFilters.status
                        );
                    }

                    // Apply search filter if present
                    if (
                        globalFilters.search &&
                        globalFilters.search.length > 1
                    ) {
                        const searchLower = globalFilters.search.toLowerCase();
                        filtered = filtered.filter(
                            (contact) =>
                                contact.contact_name
                                    ?.toLowerCase()
                                    .includes(searchLower) ||
                                contact.email_address
                                    ?.toLowerCase()
                                    .includes(searchLower) ||
                                contact.company
                                    ?.toLowerCase()
                                    .includes(searchLower)
                        );
                    }
                }

                // Add all filtered contacts to the selection set
                filtered.forEach((contact: ContactDto) => {
                    allRecipientsIds.add(contact.id.toString());
                });

                // Create appropriate message based on filters applied
                let filterMessage = `Selected ${filtered.length} employer contacts`;

                if (isUsingAdvancedFilter) {
                    filterMessage += ` using advanced filter with ${advancedFilterConditions.length} condition${advancedFilterConditions.length !== 1 ? "s" : ""}`;
                } else {
                    if (globalFilters.liaison) {
                        filterMessage += ` with liaison: ${globalFilters.liaison}`;
                    }

                    if (globalFilters.status) {
                        filterMessage += `${globalFilters.liaison ? " and" : " with"} status: ${globalFilters.status}`;
                    }

                    if (globalFilters.search) {
                        filterMessage += ` matching: "${globalFilters.search}"`;
                    }
                }

                toast.success(filterMessage);
                console.log(
                    `Selected ${allRecipientsIds.size} recipients from advanced filter`
                );
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

            // Directly update the selectedRecipients state with a new Set
            setSelectedRecipients(new Set(allRecipientsIds));

            // Verify the selection was made correctly
            setTimeout(() => {
                console.log(
                    `Verification: ${allRecipientsIds.size} recipients selected`
                );
            }, 100);
        } catch (error) {
            console.error("Error selecting all recipients:", error);
            toast.error("Failed to select all recipients. Please try again.");
        } finally {
            setIsSelectingAll(false);
        }
    };

    // Handle global liaison filter change
    const handleGlobalLiaisonChange = (value: string) => {
        // Reset pagination when filter changes
        setContactsPage(1);
        setContactsApiPage(1);

        // Clear cached filter results to force recalculation
        setFilteredContactsCache([]);
        setTotalFilteredCount(0);

        const newLiaison = value === "all" ? null : value;

        setGlobalFilters((prev) => ({
            ...prev,
            liaison: newLiaison,
        }));

        if (value !== "all") {
            toast.info(
                `Filtering to show only contacts with liaison: ${value}`
            );

            // When applying a liaison filter, we need to fetch all contacts
            // since the API doesn't support filtering by liaison
            if (!isLoadingAllContacts && allContacts.length === 0) {
                setIsLoadingAllContacts(true);
                fetchAllContacts(1000, "")
                    .then((contacts) => {
                        console.log(
                            `Loaded ${contacts.length} contacts for filtering`
                        );
                        setIsLoadingAllContacts(false);
                    })
                    .catch((error) => {
                        console.error("Error loading all contacts:", error);
                        toast.error(
                            "Failed to load all contacts for filtering"
                        );
                        setIsLoadingAllContacts(false);
                    });
            }
        } else {
            toast.info("Showing contacts for all liaisons");
            // If we're removing the filter, refresh the normal paginated view
            refetchContacts();
        }

        // Update active filters as well for consistency
        setActiveFilters((prev) => ({
            ...prev,
            liaison: newLiaison,
        }));
    };

    // Add handler for status filter change
    const handleGlobalStatusChange = (value: string) => {
        // Reset pagination when filter changes
        setContactsPage(1);
        setContactsApiPage(1);

        // Clear cached filter results to force recalculation
        setFilteredContactsCache([]);
        setTotalFilteredCount(0);

        const newStatus = value === "all" ? null : value;

        setGlobalFilters((prev) => ({
            ...prev,
            status: newStatus,
        }));

        if (value !== "all") {
            toast.info(`Filtering to show only contacts with status: ${value}`);

            // When applying a status filter, we need to fetch all contacts
            // since the API doesn't support filtering by status
            if (!isLoadingAllContacts && allContacts.length === 0) {
                setIsLoadingAllContacts(true);
                fetchAllContacts(1000, "")
                    .then((contacts) => {
                        console.log(
                            `Loaded ${contacts.length} contacts for filtering`
                        );
                        setIsLoadingAllContacts(false);
                    })
                    .catch((error) => {
                        console.error("Error loading all contacts:", error);
                        toast.error(
                            "Failed to load all contacts for filtering"
                        );
                        setIsLoadingAllContacts(false);
                    });
            }
        } else {
            toast.info("Showing contacts with all statuses");
            // If we're removing the filter, refresh the normal paginated view
            refetchContacts();
        }

        // Update active filters as well for consistency
        setActiveFilters((prev) => ({
            ...prev,
            status: newStatus,
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
            {(activeFilters.liaison || activeFilters.status) &&
                !isUsingAdvancedFilter && (
                    <div className="flex flex-wrap gap-2 p-2 px-3 bg-muted/30 rounded-md items-center mb-4">
                        <span className="text-sm font-medium">
                            Active filters:
                        </span>
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
                        {globalFilters.status !== null && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "gap-1.5 pl-2",
                                    globalFilters.status === "Cold" &&
                                        "bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
                                    globalFilters.status === "Follow Up 1" &&
                                        "bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
                                    globalFilters.status === "Follow Up 2" &&
                                        "bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
                                    globalFilters.status === "Accept" &&
                                        "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800",
                                    globalFilters.status === "Rejected" &&
                                        "bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800",
                                    globalFilters.status === "Contacted" &&
                                        "bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
                                )}
                            >
                                <div
                                    className={cn(
                                        "h-2 w-2 rounded-full mr-1",
                                        globalFilters.status === "Cold" &&
                                            "bg-blue-500",
                                        globalFilters.status ===
                                            "Follow Up 1" && "bg-amber-500",
                                        globalFilters.status ===
                                            "Follow Up 2" && "bg-amber-600",
                                        globalFilters.status === "Accept" &&
                                            "bg-green-500",
                                        globalFilters.status === "Rejected" &&
                                            "bg-red-500",
                                        globalFilters.status === "Contacted" &&
                                            "bg-purple-500"
                                    )}
                                />
                                Status: {globalFilters.status}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-auto p-0 px-1.5 ml-1"
                                    onClick={() => {
                                        setGlobalFilters((prev) => ({
                                            ...prev,
                                            status: null,
                                        }));
                                    }}
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

            {/* Applied advanced filters */}
            {isUsingAdvancedFilter && advancedFilterConditions.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md items-center mb-4">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                        <Filter className="h-4 w-4" />
                        Advanced filter:
                    </span>
                    <Badge
                        variant="outline"
                        className="border-amber-300 dark:border-amber-700 bg-amber-100/50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                    >
                        {advancedFilterConditions.length} condition
                        {advancedFilterConditions.length !== 1 ? "s" : ""}
                    </Badge>

                    <div className="w-full mt-2">
                        <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                View details
                            </summary>
                            <div className="space-y-1 mt-2 text-sm">
                                {advancedFilterConditions.map((condition) => {
                                    const fieldLabel = getFieldOptions().find(
                                        (f) => f.value === condition.field
                                    )?.label;
                                    const operatorLabel =
                                        getOperatorOptions().find(
                                            (o) =>
                                                o.value === condition.operator
                                        )?.label;

                                    return (
                                        <div
                                            key={condition.id}
                                            className="flex items-center gap-1.5"
                                        >
                                            <span className="font-medium">
                                                {fieldLabel}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {operatorLabel}
                                            </span>
                                            {condition.operator !==
                                                "is_empty" &&
                                                condition.operator !==
                                                    "is_not_empty" && (
                                                    <span className="bg-muted px-1.5 py-0.5 rounded text-xs">
                                                        {condition.value}
                                                    </span>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </details>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setAdvancedFilterConditions([]);
                            setIsUsingAdvancedFilter(false);
                            toast.info("Advanced filters cleared");
                        }}
                        className="h-6 text-xs ml-auto"
                    >
                        Clear Advanced Filter
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
                        disabled={isUsingAdvancedFilter}
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
                            disabled={isUsingAdvancedFilter}
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
                            disabled={isUsingAdvancedFilter}
                        >
                            Select Visible
                        </Button>
                    )}

                    {recipientType === "employers" &&
                        !isUsingAdvancedFilter && (
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

                                {/* Status filter dropdown */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="status"
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                globalFilters.status &&
                                                    "border-primary"
                                            )}
                                        >
                                            <Filter className="mr-2 h-4 w-4" />
                                            {globalFilters.status || "Status"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-[200px]">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search status..."
                                                className="h-9"
                                            />
                                            <CommandEmpty>
                                                No status found.
                                            </CommandEmpty>
                                            <CommandGroup className="max-h-[200px] overflow-auto">
                                                {[
                                                    "Cold",
                                                    "Follow Up 1",
                                                    "Follow Up 2",
                                                    "Accept",
                                                    "Rejected",
                                                    "Contacted",
                                                ].map((status) => (
                                                    <CommandItem
                                                        key={status}
                                                        value={status}
                                                        onSelect={() =>
                                                            handleGlobalStatusChange(
                                                                status
                                                            )
                                                        }
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div
                                                            className={cn(
                                                                "h-2 w-2 rounded-full",
                                                                status ===
                                                                    "Cold" &&
                                                                    "bg-blue-500",
                                                                status ===
                                                                    "Follow Up 1" &&
                                                                    "bg-amber-500",
                                                                status ===
                                                                    "Follow Up 2" &&
                                                                    "bg-amber-600",
                                                                status ===
                                                                    "Accept" &&
                                                                    "bg-green-500",
                                                                status ===
                                                                    "Rejected" &&
                                                                    "bg-red-500",
                                                                status ===
                                                                    "Contacted" &&
                                                                    "bg-purple-500"
                                                            )}
                                                        />
                                                        <span>{status}</span>
                                                        {globalFilters.status ===
                                                            status && (
                                                            <Check className="ml-auto h-4 w-4" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                    {recipientType === "employers" && (
                        <Dialog
                            open={isAdvancedFilterOpen}
                            onOpenChange={setIsAdvancedFilterOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={
                                        isUsingAdvancedFilter
                                            ? "default"
                                            : "outline"
                                    }
                                    className="flex items-center gap-1 whitespace-nowrap"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Advanced Filter
                                </Button>
                            </DialogTrigger>
                            <AdvancedFilterDialog
                                isOpen={isAdvancedFilterOpen}
                                onOpenChange={setIsAdvancedFilterOpen}
                                onApplyFilters={applyAdvancedFilters}
                                contacts={allContacts}
                                initialConditions={advancedFilterConditions}
                            />
                        </Dialog>
                    )}

                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex items-center gap-1 whitespace-nowrap"
                        onClick={handleSelectAllContacts}
                        disabled={isSelectingAll}
                        title={
                            recipientType === "employers"
                                ? isUsingAdvancedFilter
                                    ? `Select all contacts matching advanced filter conditions`
                                    : globalFilters.liaison ||
                                        globalFilters.status
                                      ? `Select all contacts with ${globalFilters.liaison ? `liaison: ${globalFilters.liaison}` : ""}${globalFilters.liaison && globalFilters.status ? " and " : ""}${globalFilters.status ? `status: ${globalFilters.status}` : ""}`
                                      : "Select all available recipients"
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
                        {recipientType === "employers"
                            ? isUsingAdvancedFilter
                                ? "Select All (Advanced Filter)"
                                : globalFilters.liaison || globalFilters.status
                                  ? `Select All${globalFilters.liaison ? ` (${globalFilters.liaison})` : ""}${globalFilters.status ? ` (${globalFilters.status})` : ""}`
                                  : "Select All"
                            : "Select All"}
                    </Button>
                </div>
            </div>

            {/* Loading indicator */}
            {(isSelectingAll || isLoadingAllContacts) && (
                <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                    <div className="bg-primary h-2.5 rounded-full animate-pulse w-full"></div>
                    {isLoadingAllContacts && (
                        <p className="text-xs text-center mt-1 text-muted-foreground">
                            Loading all contacts for filtering...
                        </p>
                    )}
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
                        className={`flex-1 rounded-none ${selectedRecipients.size > 0 ? "bg-primary/10" : ""}`}
                        onClick={() => setContactsView("selected")}
                        disabled={selectedRecipients.size === 0}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Selected{" "}
                        {selectedRecipients.size > 0 &&
                            `(${selectedRecipients.size})`}
                    </Button>
                </div>
            )}

            {/* Contact lists */}
            {recipientType === "employers" &&
                contactsView === "individuals" && (
                    <RecipientSelectionTable
                        key={`page-${contactsPage}-filter-${globalFilters.liaison || "none"}-${globalFilters.status || "none"}`}
                        contacts={contactsToDisplay}
                        currentPage={contactsPage}
                        totalPages={effectiveTotalPages}
                        selectedRecipients={selectedRecipients}
                        onSelectRecipient={handleRecipientToggle}
                        onSelectAll={handleSelectAll}
                        onPageChange={handleContactsPageChange}
                        loading={
                            (isContactsLoading && !inSearchMode) ||
                            isLoadingAllContacts
                        }
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
                    contacts={
                        // Always use allContacts for the selected view to ensure we show all selected items
                        // This ensures advanced filtering selections are properly displayed when returning to step 1
                        allContacts.filter((contact) =>
                            selectedRecipients.has(contact.id.toString())
                        )
                    }
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
