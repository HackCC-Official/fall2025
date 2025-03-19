"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import {
    CircleUser,
    ChevronRight,
    MinusCircle,
    ChevronLeft,
    Users,
    Building,
    Search,
    X,
    CheckCircle2,
    Circle,
} from "lucide-react";
import Link from "next/link";
import { useOutreachTeam } from "@/hooks/use-outreach-team";
import type { OutreachTeamDto } from "@/features/outreach/types/outreach-team";
import {
    sendBatchEmails,
    sendEmail,
    updateContact,
    searchContacts,
} from "@/features/outreach/api/outreach";
import type {
    EmailRecipient,
    SendBatchEmailsDto,
} from "@/features/outreach/types/email.dto";
import type { Mail } from "@/types/mail";
import AccountSwitcher from "../components/account-switcher";
import PanelLayout from "../../layout";
import { useInterestedUsers } from "@/hooks/use-interested.user";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { EmptyEmail } from "@/emails/empty-template";
import { render } from "@react-email/render";
import { useContacts } from "@/hooks/use-contacts";
import type { EmailTemplate } from "@/lib/email/types";
import {
    renderEmailTemplate,
    type EmailTemplateType,
} from "@/lib/email/email-renderer";
import { useSearchParams } from "next/navigation";
import type {
    ContactDto,
    ContactStatus,
} from "@/features/outreach/types/contact.dto";
import { debounce } from "lodash";
import InterestedEmail from "@/emails/interested-template";

const STORAGE_KEY = "selectedOutreachAccount";

type RecipientType = "employers" | "registered" | "interested";

interface ExtendedEmailTemplate extends EmailTemplate {
    type: "employers" | "hackers";
}

interface Recipient {
    id: string;
    to: EmailRecipient[];
    labels: string[];
    company?: string;
    status?: ContactStatus;
}

const EMAIL_TEMPLATES: ExtendedEmailTemplate[] = [
    {
        id: "0",
        name: "Empty Template",
        subject: "",
        content: "",
        type: "employers",
    },
    {
        id: "1",
        name: "Sponsorship Confirmation",
        subject: "Sponsorship Opportunity with HackCC",
        content: "Dear [Name],\n\nI hope this email finds you well...",
        type: "employers",
    },
    {
        id: "2",
        name: "Follow-Up Email",
        subject: "Re: Meet the best students in X town this May",
        content: "Hi [Name],\n\nI hope this email finds you well...",
        type: "employers",
    },
    {
        id: "4",
        name: "Post-Call Follow-Up",
        subject: "HackCC Sponsorship Next Steps",
        content: "Hi [Name],\n\nThank you for your time on our call...",
        type: "employers",
    },
    {
        id: "5",
        name: "Sponsorship Agreement",
        subject: "HackCC x [company_name] Sponsorship Confirmation!",
        content: "Hi [Name],\n\nThank you for confirming your sponsorship...",
        type: "employers",
    },
    {
        id: "3",
        name: "FollowUpEmail",
        subject: "Follow Up from HackCC",
        content: "Hi [Name],\n\nThank you for your interest in HackCC...",
        type: "hackers",
    },
];

interface ComposePageProps {
    mails?: Mail[];
}

interface RecipientConfirmationDetails {
    name: string;
    email: string;
    organization?: string;
}

const extractVariable = (content: string, variableName: string): string => {
    const regex = new RegExp(`\\[${variableName}\\]\\s*(?:\\n|$)`, "i");
    const match = content.match(regex);
    if (match) {
        return match[0].replace(/[\[\]]/g, "").trim();
    }
    return "";
};

const RecipientSelectionTable = ({
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
                                        <MinusCircle className="h-4 w-4 text-muted-foreground absolute" />
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

const OrganizationsView = ({
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

export default function ComposePage({ mails = [] }: ComposePageProps) {
    const searchParams = useSearchParams();
    const paramsProcessedRef = React.useRef(false);

    const [selectedRecipients, setSelectedRecipients] = React.useState<
        Set<string>
    >(new Set());
    const [searchQuery, setSearchQuery] = React.useState("");
    const [recipientType, setRecipientType] =
        React.useState<RecipientType>("employers");
    const [selectedLiaison, setSelectedLiaison] = React.useState<string>("");
    const [showLiaisonSelect, setShowLiaisonSelect] = React.useState(false);
    const [liaisons, setLiaisons] = React.useState<string[]>([]);

    const [selectedTemplate, setSelectedTemplate] =
        React.useState<ExtendedEmailTemplate | null>(null);
    const [emailSubject, setEmailSubject] = React.useState("");
    const [emailContent, setEmailContent] = React.useState("");
    const [previewHtml, setPreviewHtml] = React.useState("");
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    const [senderEmail, setSenderEmail] = React.useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(STORAGE_KEY) || "";
        }
        return "";
    });

    const { data: outreachTeamResponse } = useOutreachTeam();
    const { data: interestedUsers, isLoading: isInterestedLoading } =
        useInterestedUsers();
    const {
        data: contactsResponse,
        isLoading: isContactsLoading,
        pagination: {
            setPage: setContactsApiPage,
            setSearch: setContactsApiSearch,
            totalPages: contactsTotalPages,
        },
        fetchAllContacts,
        refetch: refetchContacts,
    } = useContacts({
        initialLimit: 50,
        initialSearch: searchQuery,
    });

    const [contactsView, setContactsView] = React.useState<
        "individuals" | "organizations" | "selected"
    >("individuals");
    const [contactsPage, setContactsPage] = React.useState(1);

    const [isSearching, setIsSearching] = React.useState(false);
    const [, setAllContacts] = React.useState<ContactDto[]>([]);
    const [, setIsLoadingAllContacts] = React.useState(false);
    const [isSelectingAll, setIsSelectingAll] = React.useState(false);

    const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
    const [recipientsToConfirm, setRecipientsToConfirm] = React.useState<
        RecipientConfirmationDetails[]
    >([]);

    // Add active filters state
    const [activeFilters, setActiveFilters] = React.useState<{
        liaison: string | null;
        status: string | null;
    }>({
        liaison: null,
        status: null,
    });
    const [showFiltersPanel, setShowFiltersPanel] =
        React.useState<boolean>(false);

    // Add a new state for tracking the active step
    const [activeStep, setActiveStep] = React.useState<
        "recipients" | "content" | "preview"
    >("recipients");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearchContacts = React.useCallback(
        debounce(async (value: string) => {
            if (!value || value.length < 2) {
                setContactsApiSearch("");
                if (!value) {
                    setContactsApiPage(1);
                    refetchContacts();
                    setSelectedRecipients(new Set());
                    if (contactsView === "organizations") {
                        setAllContacts([]);
                        setIsLoadingAllContacts(true);
                        try {
                            const allContactsList = await fetchAllContacts(
                                100,
                                ""
                            );
                            setAllContacts(allContactsList);
                        } catch (error) {
                            console.error(
                                "Error refreshing all contacts:",
                                error
                            );
                        } finally {
                            setIsLoadingAllContacts(false);
                        }
                    }
                }
                return;
            }

            try {
                setIsSearching(true);
                // Use searchContacts directly for better searching
                const results = await searchContacts(value).catch((error) => {
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
                });

                if (contactsResponse && results) {
                    contactsResponse.data = results;
                    // Refresh the view with search results
                    setContactsApiPage(1);
                }
            } catch (error) {
                console.error("Error searching contacts:", error);
                toast.error("Failed to search contacts. Please try again.");
                setContactsApiSearch(value);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        [
            contactsResponse,
            contactsView,
            fetchAllContacts,
            refetchContacts,
            setContactsApiPage,
            setContactsApiSearch,
        ]
    );

    const handleContactsPageChange = React.useCallback(
        (newPage: number) => {
            setContactsPage(newPage);
            setContactsApiPage(newPage);
        },
        [setContactsApiPage]
    );

    const handleSelectAllVisible = () => {
        const newSelected = new Set(selectedRecipients);
        contactsResponse?.data?.forEach((contact) => {
            newSelected.add(contact.id.toString());
        });
        setSelectedRecipients(newSelected);
    };

    // Add filtered contacts function
    const getFilteredContacts = React.useCallback(
        (contactsList: ContactDto[]) => {
            if (!activeFilters.liaison && !activeFilters.status) {
                return contactsList;
            }

            return contactsList.filter((contact) => {
                // Apply liaison filter
                if (
                    activeFilters.liaison &&
                    contact.liaison !== activeFilters.liaison
                ) {
                    return false;
                }

                // Apply status filter
                if (
                    activeFilters.status &&
                    contact.status !== activeFilters.status
                ) {
                    return false;
                }

                return true;
            });
        },
        [activeFilters]
    );

    // Modify the existing contacts memo to include filtering
    const contacts = React.useMemo(() => {
        const baseContacts = contactsResponse?.data || [];
        return getFilteredContacts(baseContacts);
    }, [contactsResponse?.data, getFilteredContacts]);

    React.useEffect(() => {
        if (contacts && contacts.length > 0 && recipientType === "employers") {
            const liaisonSet = new Set<string>();
            contacts.forEach((contact) => {
                if (
                    contact.liaison &&
                    typeof contact.liaison === "string" &&
                    contact.liaison.trim() !== ""
                ) {
                    liaisonSet.add(contact.liaison);
                }
            });
            setLiaisons(Array.from(liaisonSet).sort());
        }
    }, [contacts, recipientType]);

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

    const handleSelectAll = React.useCallback(
        (checked: boolean) => {
            const newSelected = new Set(selectedRecipients);
            filteredRecipients.forEach((recipient) => {
                if (checked) {
                    newSelected.add(recipient.id);
                } else {
                    newSelected.delete(recipient.id);
                }
            });
            setSelectedRecipients(newSelected);
        },
        [filteredRecipients, selectedRecipients]
    );

    const handleRecipientToggle = (recipientId: string) => {
        const newSelected = new Set(selectedRecipients);
        if (newSelected.has(recipientId)) {
            newSelected.delete(recipientId);
        } else {
            newSelected.add(recipientId);
        }
        setSelectedRecipients(newSelected);
    };

    const handleAccountChange = (email: string) => {
        setSenderEmail(email);
        localStorage.setItem(STORAGE_KEY, email);
    };

    const handlePreview = async () => {
        if (selectedRecipients.size === 0) {
            toast.error("Please select at least one recipient");
            return;
        }

        const selectedTeamMember = outreachTeamResponse?.data?.data.find(
            (member: OutreachTeamDto) => member.email === senderEmail
        );

        if (!selectedTeamMember) {
            toast.error("Please select a sender account");
            return;
        }

        try {
            let previewContent;
            if (recipientType === "employers") {
                if (selectedTemplate?.name === "Empty Template") {
                    previewContent = await render(
                        <EmptyEmail
                            recipientName="Name"
                            emailContent={emailContent}
                            sender={selectedTeamMember}
                            companyName="Company"
                            socialLinks={{
                                HackCC: "https://hackcc.net",
                                LinkedIn: "https://linkedin.com/company/hackcc",
                            }}
                            subject={emailSubject}
                        />
                    );
                } else {
                    const renderedEmails = await renderEmailTemplate({
                        templateType:
                            selectedTemplate?.name as EmailTemplateType,
                        recipients: contacts.filter((contact) =>
                            selectedRecipients.has(contact.id.toString())
                        ),
                        templateData: {
                            sender: selectedTeamMember,
                            emailContent: emailContent,
                            ...(selectedTemplate?.name ===
                                "Post-Call Follow-Up" && {
                                followupDate: extractVariable(
                                    emailContent,
                                    "followup_date"
                                ),
                                followupTime: extractVariable(
                                    emailContent,
                                    "followup_time"
                                ),
                                requestedMaterials: extractVariable(
                                    emailContent,
                                    "requested_materials"
                                ),
                            }),
                            subject: emailSubject,
                        },
                        contactInfo: {
                            email: senderEmail,
                            phone: "+1234567890",
                        },
                    });
                    previewContent = renderedEmails[0];
                }
            } else {
                previewContent = await render(
                    <InterestedEmail
                        recipientName="Name"
                        emailContent={emailContent}
                        sender={selectedTeamMember}
                        socialLinks={{
                            HackCC: "https://hackcc.net",
                            LinkedIn: "https://linkedin.com/company/hackcc",
                        }}
                    />
                );
            }

            setPreviewHtml(previewContent);
            setIsPreviewOpen(true);
        } catch (error) {
            console.error("Error generating preview:", error);
            toast.error("Failed to generate preview");
        }
    };

    const handleSendEmails = async () => {
        if (selectedRecipients.size === 0) {
            toast.error("Please select at least one recipient");
            return;
        }

        const selectedTeamMember = outreachTeamResponse?.data?.data.find(
            (member: OutreachTeamDto) => member.email === senderEmail
        );

        if (!selectedTeamMember) {
            toast.error("Could not find selected team member information");
            return;
        }

        // Prepare recipients list for confirmation
        const recipientsList: RecipientConfirmationDetails[] = [];

        if (recipientType === "employers") {
            contacts.forEach((contact) => {
                if (selectedRecipients.has(contact.id.toString())) {
                    recipientsList.push({
                        name: contact.contact_name || "",
                        email: contact.email_address,
                        organization: contact.company,
                    });
                }
            });
        } else {
            const allRecipients = recipientLists[recipientType];
            allRecipients.forEach((recipient) => {
                if (selectedRecipients.has(recipient.id)) {
                    recipientsList.push({
                        name:
                            recipient.to[0]?.name ||
                            recipient.to[0]?.email.split("@")[0],
                        email: recipient.to[0]?.email,
                    });
                }
            });
        }

        setRecipientsToConfirm(recipientsList);
        setIsConfirmationOpen(true);
    };

    const handleConfirmedSend = async () => {
        try {
            const allRecipients = recipientLists[recipientType];
            const selectedRecipientsData = allRecipients.filter((recipient) =>
                selectedRecipients.has(recipient.id)
            );

            const selectedTeamMember = outreachTeamResponse?.data?.data.find(
                (member: OutreachTeamDto) => member.email === senderEmail
            );

            if (!selectedTeamMember) {
                toast.error("Could not find selected team member information");
                return;
            }

            // Create a notification that stays open during the entire sending process
            const toastId = toast.loading(
                `Preparing to send ${selectedRecipientsData.length} emails. Please do not close this tab.`,
                { duration: Infinity }
            );

            // If we have more than 100 recipients, send in batches
            const BATCH_SIZE = 100;
            const needsBatching = selectedRecipientsData.length > BATCH_SIZE;

            let renderedEmails: string[] = [];

            // Render all emails first based on recipient type
            if (recipientType === "employers") {
                if (selectedTemplate?.name === "Empty Template") {
                    renderedEmails = await Promise.all(
                        selectedRecipientsData.map(async (recipient) => {
                            return render(
                                <EmptyEmail
                                    recipientName={recipient.to[0]?.name || ""}
                                    emailContent={emailContent}
                                    sender={selectedTeamMember}
                                    companyName={
                                        recipient.company || "[company_name]"
                                    }
                                    socialLinks={{
                                        HackCC: "https://hackcc.net",
                                        LinkedIn:
                                            "https://linkedin.com/company/hackcc",
                                    }}
                                    subject={emailSubject}
                                />
                            );
                        })
                    );
                } else {
                    renderedEmails = await renderEmailTemplate({
                        templateType:
                            selectedTemplate?.name as EmailTemplateType,
                        recipients: contacts.filter((contact) =>
                            selectedRecipients.has(contact.id.toString())
                        ),
                        templateData: {
                            sender: selectedTeamMember,
                            emailContent: emailContent,
                            ...(selectedTemplate?.name ===
                                "Post-Call Follow-Up" && {
                                followupDate: extractVariable(
                                    emailContent,
                                    "followup_date"
                                ),
                                followupTime: extractVariable(
                                    emailContent,
                                    "followup_time"
                                ),
                                requestedMaterials: extractVariable(
                                    emailContent,
                                    "requested_materials"
                                ),
                            }),
                            subject: emailSubject,
                        },
                        contactInfo: {
                            email: senderEmail,
                            phone: "+1234567890",
                        },
                    });
                }
            } else {
                renderedEmails = await Promise.all(
                    selectedRecipientsData.map(async (recipient) => {
                        const recipientName = recipient.to[0]?.name || "Hacker";
                        return render(
                            <InterestedEmail
                                recipientName={recipientName}
                                emailContent={emailContent}
                                sender={selectedTeamMember}
                                socialLinks={{
                                    HackCC: "https://hackcc.net",
                                    LinkedIn:
                                        "https://linkedin.com/company/hackcc",
                                }}
                            />
                        );
                    })
                );
            }

            // Prepare all email objects
            const allEmails = selectedRecipientsData.map((recipient, index) => {
                // Parse the subject line to replace variables
                let parsedSubject = emailSubject;
                if (recipientType === "employers") {
                    if (
                        parsedSubject.includes("[company_name]") &&
                        recipient.company
                    ) {
                        parsedSubject = parsedSubject.replace(
                            /\[company_name\]/g,
                            recipient.company
                        );
                    }
                }

                if (
                    parsedSubject.includes("[recipient_name]") &&
                    recipient.to[0]?.name
                ) {
                    parsedSubject = parsedSubject.replace(
                        /\[recipient_name\]/g,
                        recipient.to[0].name
                    );
                }

                return {
                    from: senderEmail,
                    to: recipient.to.map((to) => ({
                        email: to.email,
                        name: to.name || to.email.split("@")[0],
                    })),
                    subject: parsedSubject,
                    html: renderedEmails[index],
                };
            });

            // Update toast to show we're starting to send
            toast.loading(
                `Sending emails to ${selectedRecipientsData.length} recipients. Please do not close this tab.`,
                { id: toastId }
            );

            if (needsBatching) {
                // Split into batches
                const batches = [];
                for (let i = 0; i < allEmails.length; i += BATCH_SIZE) {
                    batches.push(allEmails.slice(i, i + BATCH_SIZE));
                }

                let batchCounter = 1;
                const totalBatches = batches.length;

                // Send each batch with a delay
                for (const batch of batches) {
                    // Update toast with current batch info
                    toast.loading(
                        `Sending batch ${batchCounter} of ${totalBatches} (${batch.length} emails). Please do not close this tab.`,
                        { id: toastId }
                    );

                    try {
                        // Send the current batch
                        await sendBatchEmails({
                            emails: batch,
                        } as SendBatchEmailsDto);

                        // Update toast with success for this batch
                        toast.success(
                            `Batch ${batchCounter} of ${totalBatches} sent successfully! (${batch.length} emails)`,
                            { duration: 3000 }
                        );

                        // If we have more batches to go, update the main toast
                        if (batchCounter < totalBatches) {
                            toast.loading(
                                `Sending email batches: ${batchCounter} of ${totalBatches} completed. Please do not close this tab.`,
                                { id: toastId }
                            );

                            // Wait for 5 seconds before sending the next batch
                            await new Promise((resolve) =>
                                setTimeout(resolve, 5000)
                            );
                        }
                    } catch (error) {
                        console.error(
                            `Error sending batch ${batchCounter}:`,
                            error
                        );
                        toast.error(
                            `Failed to send batch ${batchCounter}. Continuing with remaining batches.`
                        );
                    }

                    batchCounter++;
                }
            } else {
                // For small batches, send directly
                if (allEmails.length === 1) {
                    await sendEmail(allEmails[0]);
                } else {
                    await sendBatchEmails({
                        emails: allEmails,
                    } as SendBatchEmailsDto);
                }
            }

            // Update recipients as contacted if they're employers
            if (recipientType === "employers") {
                try {
                    toast.loading("Updating contact statuses...", {
                        id: toastId,
                    });

                    await Promise.all(
                        selectedRecipientsData.map(async (recipient) => {
                            await updateContact(recipient.id, {
                                status: "Contacted",
                            });
                        })
                    );
                    console.log("Successfully marked employers as contacted");
                } catch (error) {
                    console.error(
                        "Error updating employer contact status:",
                        error
                    );
                    toast.error("Failed to update some contact statuses");
                }
            }

            // Final success message
            toast.success(
                `All ${selectedRecipientsData.length} emails sent successfully!`,
                {
                    id: toastId,
                    duration: 5000,
                }
            );

            setSelectedRecipients(new Set());
            setSelectedTemplate(null);
            setEmailSubject("");
            setEmailContent("");
            setPreviewHtml("");
            setIsConfirmationOpen(false);
        } catch (error) {
            console.error("Error sending emails:", error);
            toast.error("Failed to send emails. Please try again.");
            setIsConfirmationOpen(false);
        }
    };

    const handleTemplateChange = (templateId: string) => {
        const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplate(template);
            setEmailSubject(template.subject);

            if (template.name === "Sponsorship Confirmation") {
                setEmailContent(
                    "Hello [recipient_name],\n\n" +
                        "I hope this email finds you well. My name is [sender_name], and I am a [sender_year_and_major] student at [sender_school]. I am also a sponsorship coordinator with HackCC, a student-led initiative providing California community college students with the opportunity to compete in weekend-long invention marathons. Taking place May 2nd-4th at [venue], we're expecting 250 hackers this year!\n\n" +
                        "I am reaching out to inquire about getting [company_name] on board as a sponsor for one (or more!) of our hackathons. I was wondering if [company_name] has any interest in sponsoring hackathons at this time?\n\n" +
                        "Best regards,"
                );
            } else if (template.name === "Follow-Up Email") {
                setEmailContent(
                    "Hi [recipient_name],\n\n" +
                        "I hope this email finds you well. My name is [sender_name], and I am a [sender_year_and_major] student at [sender_school]. I am also a sponsorship coordinator with HackCC, a student-led initiative providing California community college students with the opportunity to compete in weekend-long invention marathons. Taking place May 2nd-4th at [venue], we're expecting 250 hackers this year!\n\n" +
                        "I reached out to you on Tuesday about getting [company_name] on board as a sponsor for one (or more!) of our hackathons. I was wondering if [company_name] has any interest in sponsoring hackathons at this time?\n\n" +
                        "Best regards,"
                );
            } else if (template.name === "Post-Call Follow-Up") {
                setEmailContent(
                    "Hi [recipient_name],\n\n" +
                        "It was a pleasure speaking with you today about HackCC and how [company_name] can get involved. I appreciate your time and insights!\n\n" +
                        "Recap from Our Call:\n\n" +
                        "• Key points discussed\n" +
                        "• Benefits [company_name] expressed interest in\n" +
                        "• Any additional concerns raised and how they were addressed\n\n" +
                        "Just confirming our follow-up call on [followup_date] at [followup_time]. In the meantime, I've attached the [requested_materials] for your review. If you have any questions or need further information, feel free to reach out. Looking forward to hearing your thoughts!\n\n" +
                        "Best,"
                );
            } else if (template.name === "Sponsorship Agreement") {
                setEmailContent(
                    "Hi [recipient_name],\n\n" +
                        "Thank you for confirming your sponsorship for HackCC! We're thrilled to have [company_name] supporting our hackathon and can't wait to collaborate with you.\n\n" +
                        "Next Steps:\n\n" +
                        "• Sponsorship Agreement & Invoice: [Attach any necessary documents]\n" +
                        "• Logistics & Branding: Please send over your logo and any promotional materials you'd like us to feature.\n" +
                        "• Engagement Opportunities: Let us know if your team would like to host a workshop, provide mentors, or have a booth at the event.\n\n" +
                        "If there's anything else we can do to make this partnership a success, please don't hesitate to reach out. Looking forward to working together!\n\n" +
                        "Best,"
                );
            } else {
                setEmailContent(template.content);
            }
        }
    };

    React.useEffect(() => {
        if (paramsProcessedRef.current) {
            return;
        }

        const contactId = searchParams?.get("contactId");
        const recipientTypeParam = searchParams?.get("recipientType");
        const toEmail = searchParams?.get("to");

        if (!searchParams || (!contactId && !recipientTypeParam && !toEmail)) {
            return;
        }

        if (contactId) {
            setSelectedRecipients(new Set([contactId]));
            setRecipientType("employers");
            paramsProcessedRef.current = true;
            return;
        }

        // If toEmail is provided without a specific recipient type, assume employers
        if (toEmail && !recipientTypeParam) {
            setRecipientType("employers");
            setSearchQuery(toEmail);

            // Search for the contact with this email and select it when found
            const searchAndSelectContact = async () => {
                try {
                    setIsSearching(true);
                    const results = await searchContacts(toEmail);
                    if (results && results.length > 0) {
                        // Find the exact match for the email
                        const exactMatch = results.find(
                            (contact) =>
                                contact.email_address.toLowerCase() ===
                                toEmail.toLowerCase()
                        );

                        if (exactMatch) {
                            // Add this contact to selected recipients instead of replacing
                            const newSelected = new Set(selectedRecipients);
                            newSelected.add(exactMatch.id.toString());
                            setSelectedRecipients(newSelected);

                            // Update the contactsResponse data with the search results
                            // but don't limit to just this one result
                            if (contactsResponse) {
                                contactsResponse.data = results;
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error searching for contact:", error);
                } finally {
                    setIsSearching(false);
                }
            };

            searchAndSelectContact();
            paramsProcessedRef.current = true;
            return;
        }

        if (
            recipientTypeParam &&
            (recipientTypeParam === "registered" ||
                recipientTypeParam === "interested")
        ) {
            setRecipientType(recipientTypeParam as RecipientType);

            if (toEmail) {
                if (recipientTypeParam === "registered") {
                    const registeredHacker = mails.find(
                        (mail) => mail.to?.[0]?.email === toEmail
                    );
                    if (registeredHacker) {
                        setSelectedRecipients(new Set([registeredHacker.id]));
                    }
                } else if (recipientTypeParam === "interested") {
                    const interestedUser = interestedUsers?.find(
                        (user) => user.email === toEmail
                    );
                    if (interestedUser) {
                        setSelectedRecipients(new Set([interestedUser.email]));
                    }
                }
            }
            paramsProcessedRef.current = true;
        }
    }, [
        mails,
        interestedUsers,
        searchParams,
        contactsResponse,
        selectedRecipients,
    ]);

    const emailAccounts = React.useMemo(() => {
        const outreachTeamArray = outreachTeamResponse?.data?.data || [];
        return outreachTeamArray.map((member: OutreachTeamDto) => ({
            label: member.name,
            email: member.email,
            icon: <CircleUser className="h-4 w-4" />,
        }));
    }, [outreachTeamResponse]);

    // Add the handleSelectAllContacts function here
    const handleSelectAllContacts = async () => {
        // Show loading state
        setIsSelectingAll(true);

        try {
            toast.info("Loading all recipients...", { duration: 2000 });

            const allRecipientsIds = new Set<string>();

            if (recipientType === "employers") {
                // Fetch all contacts without pagination for employers
                const allContactsList = await fetchAllContacts(
                    1000,
                    searchQuery
                );

                // Apply liaison filter if selected
                const filtered =
                    selectedLiaison && selectedLiaison !== "all"
                        ? allContactsList.filter(
                              (contact: ContactDto) =>
                                  contact.liaison === selectedLiaison
                          )
                        : allContactsList;

                filtered.forEach((contact: ContactDto) => {
                    allRecipientsIds.add(contact.id.toString());
                });

                const filterMessage =
                    selectedLiaison && selectedLiaison !== "all"
                        ? `Selected ${filtered.length} employer contacts with liaison: ${selectedLiaison}`
                        : `Selected ${filtered.length} employer contacts`;

                toast.success(filterMessage);

                // Reset liaison selection only if we don't want to keep it visible
                // setSelectedLiaison("");
                // setShowLiaisonSelect(false);
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

    // Add some helper functions for the UI
    const StepIndicator = ({
        label,
        isActive,
        isCompleted,
        onClick,
    }: {
        step: "recipients" | "content" | "preview";
        label: string;
        isActive: boolean;
        isCompleted: boolean;
        onClick: () => void;
    }) => (
        <div
            className={`flex items-center gap-2 cursor-pointer ${
                isActive ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={onClick}
        >
            <div
                className={`flex items-center justify-center rounded-full w-6 h-6 ${
                    isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                }`}
            >
                {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                ) : (
                    <Circle className="h-5 w-5" />
                )}
            </div>
            <span className={`${isActive ? "font-medium" : ""}`}>{label}</span>
        </div>
    );

    if (isInterestedLoading || isContactsLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">
                    {isContactsLoading
                        ? "Loading contacts for email composition..."
                        : "Loading interested users..."}
                </p>
                <p className="text-sm text-muted-foreground">
                    This may take a moment
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 max-w-7xl">
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link
                    href="/panel/email"
                    className="text-muted-foreground hover:text-primary transition-colors"
                >
                    Email
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Compose</span>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="font-bold text-3xl">Compose Email</h1>
                <div className="flex items-center gap-4">
                    <AccountSwitcher
                        isCollapsed={false}
                        accounts={emailAccounts}
                        onAccountChange={handleAccountChange}
                        defaultEmail={senderEmail}
                    />
                </div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-8 mb-8 border-b pb-4">
                <StepIndicator
                    step="recipients"
                    label="1. Select Recipients"
                    isActive={activeStep === "recipients"}
                    isCompleted={selectedRecipients.size > 0}
                    onClick={() => setActiveStep("recipients")}
                />
                <div className="h-px w-8 bg-border"></div>
                <StepIndicator
                    step="content"
                    label="2. Compose Email"
                    isActive={activeStep === "content"}
                    isCompleted={
                        emailSubject.length > 0 && emailContent.length > 0
                    }
                    onClick={() => setActiveStep("content")}
                />
                <div className="h-px w-8 bg-border"></div>
                <StepIndicator
                    step="preview"
                    label="3. Preview & Send"
                    isActive={activeStep === "preview"}
                    isCompleted={false}
                    onClick={() => {
                        if (selectedRecipients.size > 0) {
                            handlePreview();
                            setActiveStep("preview");
                        } else {
                            toast.error(
                                "Please select at least one recipient first"
                            );
                        }
                    }}
                />
            </div>

            {/* Recipients step */}
            {activeStep === "recipients" && (
                <Card>
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    Recipients
                                    {selectedRecipients.size > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            {selectedRecipients.size} selected
                                        </Badge>
                                    )}
                                </div>
                            </CardTitle>

                            <div className="flex items-center gap-3">
                                <Select
                                    value={recipientType}
                                    onValueChange={(value: RecipientType) => {
                                        setRecipientType(value);
                                        setSelectedRecipients(new Set());
                                        setSelectedTemplate(null);
                                        setEmailSubject("");
                                        setEmailContent("");
                                    }}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select recipient type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employers">
                                            Employers (
                                            {recipientLists.employers.length})
                                        </SelectItem>
                                        <SelectItem value="registered">
                                            Registered Hackers (
                                            {recipientLists.registered.length})
                                        </SelectItem>
                                        <SelectItem value="interested">
                                            Interested Users (
                                            {recipientLists.interested.length})
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setShowFiltersPanel(!showFiltersPanel)
                                    }
                                    className="relative"
                                >
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
                                    Filters
                                    {(activeFilters.liaison ||
                                        activeFilters.status) && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-1"
                                        >
                                            {(activeFilters.liaison ? 1 : 0) +
                                                (activeFilters.status ? 1 : 0)}
                                        </Badge>
                                    )}
                                    {showFiltersPanel && (
                                        <div className="absolute right-0 top-10 mt-1 w-64 bg-background border rounded-md shadow-lg z-20">
                                            <div className="p-3">
                                                <h4 className="font-medium mb-2">
                                                    Filter Options
                                                </h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <Label
                                                            htmlFor="filter-liaison"
                                                            className="text-xs"
                                                        >
                                                            Liaison
                                                        </Label>
                                                        <Select
                                                            value={
                                                                activeFilters.liaison ||
                                                                "all"
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) =>
                                                                setActiveFilters(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        liaison:
                                                                            value ===
                                                                            "all"
                                                                                ? null
                                                                                : value,
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                id="filter-liaison"
                                                                className="w-full"
                                                            >
                                                                <SelectValue placeholder="Select liaison" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    All Liaisons
                                                                </SelectItem>
                                                                {liaisons.map(
                                                                    (
                                                                        liaison
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                liaison
                                                                            }
                                                                            value={
                                                                                liaison
                                                                            }
                                                                        >
                                                                            {
                                                                                liaison
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label
                                                            htmlFor="filter-status"
                                                            className="text-xs"
                                                        >
                                                            Status
                                                        </Label>
                                                        <Select
                                                            value={
                                                                activeFilters.status ||
                                                                "all"
                                                            }
                                                            onValueChange={(
                                                                value
                                                            ) =>
                                                                setActiveFilters(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        status:
                                                                            value ===
                                                                            "all"
                                                                                ? null
                                                                                : value,
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                id="filter-status"
                                                                className="w-full"
                                                            >
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">
                                                                    All Statuses
                                                                </SelectItem>
                                                                <SelectItem value="Contacted">
                                                                    Contacted
                                                                </SelectItem>
                                                                <SelectItem value="Not Contacted">
                                                                    Not
                                                                    Contacted
                                                                </SelectItem>
                                                                <SelectItem value="Interested">
                                                                    Interested
                                                                </SelectItem>
                                                                <SelectItem value="Not Interested">
                                                                    Not
                                                                    Interested
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex justify-between pt-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setActiveFilters(
                                                                    {
                                                                        liaison:
                                                                            null,
                                                                        status: null,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            Clear
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                setShowFiltersPanel(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            Apply
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            {/* Applied filters */}
                            {(activeFilters.liaison ||
                                activeFilters.status) && (
                                <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md items-center mb-4">
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
                                                    setActiveFilters(
                                                        (prev) => ({
                                                            ...prev,
                                                            liaison: null,
                                                        })
                                                    )
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
                                                    setActiveFilters(
                                                        (prev) => ({
                                                            ...prev,
                                                            status: null,
                                                        })
                                                    )
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
                                            setSearchQuery(value);
                                            debouncedSearchContacts(value);
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
                                                setSearchQuery("");
                                                setContactsApiSearch("");
                                                setContactsPage(1);
                                                setContactsApiPage(1);
                                                refetchContacts();
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
                                            {showLiaisonSelect ? (
                                                <Select
                                                    value={selectedLiaison}
                                                    onValueChange={(value) => {
                                                        setSelectedLiaison(
                                                            value
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 w-[180px]">
                                                        <SelectValue placeholder="Filter by liaison" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            All Liaisons
                                                        </SelectItem>
                                                        {liaisons.map(
                                                            (liaison) => (
                                                                <SelectItem
                                                                    key={
                                                                        liaison
                                                                    }
                                                                    value={
                                                                        liaison
                                                                    }
                                                                >
                                                                    {liaison}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowLiaisonSelect(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Filter by Liaison
                                                </Button>
                                            )}
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
                                            selectedLiaison
                                                ? `Select all contacts with liaison: ${selectedLiaison}`
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
                                        {selectedLiaison &&
                                        recipientType === "employers"
                                            ? `Select All (${selectedLiaison})`
                                            : "Select All"}
                                    </Button>
                                </div>
                            </div>

                            {/* Loading indicator or selection count */}
                            {isSelectingAll && (
                                <div className="w-full bg-muted rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full animate-pulse w-full"></div>
                                </div>
                            )}

                            {selectedRecipients.size > 0 && (
                                <div className="flex items-center justify-between p-2 px-3 bg-primary/10 rounded-md">
                                    <div className="text-sm">
                                        <span className="font-medium">
                                            {selectedRecipients.size}
                                        </span>{" "}
                                        {selectedRecipients.size === 1
                                            ? "recipient"
                                            : "recipients"}
                                        selected
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs"
                                        onClick={() =>
                                            setSelectedRecipients(new Set())
                                        }
                                    >
                                        Clear Selection
                                    </Button>
                                </div>
                            )}

                            {/* Simple view switcher for employers */}
                            {recipientType === "employers" && (
                                <div className="flex border rounded-md overflow-hidden mb-4">
                                    <Button
                                        size="sm"
                                        variant={
                                            contactsView === "individuals"
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="flex-1 rounded-none"
                                        onClick={() =>
                                            setContactsView("individuals")
                                        }
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
                                        onClick={() =>
                                            setContactsView("organizations")
                                        }
                                    >
                                        <Building className="h-4 w-4 mr-2" />
                                        Organizations
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            contactsView === "selected"
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="flex-1 rounded-none"
                                        onClick={() =>
                                            setContactsView("selected")
                                        }
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
                                        contacts={contacts}
                                        currentPage={contactsPage}
                                        totalPages={contactsTotalPages || 1}
                                        selectedRecipients={selectedRecipients}
                                        onSelectRecipient={
                                            handleRecipientToggle
                                        }
                                        onSelectAll={handleSelectAll}
                                        onPageChange={handleContactsPageChange}
                                        loading={isContactsLoading}
                                        areAllSelected={areAllFilteredSelected}
                                        areSomeSelected={
                                            areSomeFilteredSelected
                                        }
                                    />
                                )}

                            {recipientType === "employers" &&
                                contactsView === "organizations" && (
                                    <OrganizationsView
                                        contacts={contacts}
                                        isLoading={isContactsLoading}
                                        selectedRecipients={selectedRecipients}
                                        onToggleRecipient={
                                            handleRecipientToggle
                                        }
                                        onUpdateSelected={setSelectedRecipients}
                                    />
                                )}

                            {recipientType === "employers" &&
                                contactsView === "selected" && (
                                    <RecipientSelectionTable
                                        contacts={contacts.filter((contact) =>
                                            selectedRecipients.has(
                                                contact.id.toString()
                                            )
                                        )}
                                        currentPage={1}
                                        totalPages={1}
                                        selectedRecipients={selectedRecipients}
                                        onSelectRecipient={
                                            handleRecipientToggle
                                        }
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
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 p-2 px-6 flex justify-end gap-2">
                        <Button
                            variant="default"
                            disabled={selectedRecipients.size === 0}
                            onClick={() => setActiveStep("content")}
                        >
                            Continue to Compose
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Content step */}
            {activeStep === "content" && (
                <Card>
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle>Compose Email</CardTitle>
                            {recipientType === "employers" && (
                                <Select onValueChange={handleTemplateChange}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EMAIL_TEMPLATES.filter(
                                            (template) =>
                                                template.type === "employers"
                                        ).map((template) => (
                                            <SelectItem
                                                key={template.id}
                                                value={template.id}
                                            >
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="subject">Email Subject</Label>
                                <Input
                                    id="subject"
                                    value={emailSubject}
                                    onChange={(e) =>
                                        setEmailSubject(e.target.value)
                                    }
                                    placeholder="Enter email subject..."
                                    className="mt-1"
                                />
                            </div>

                            {recipientType !== "employers" && (
                                <div>
                                    <Label htmlFor="content">
                                        Email Content
                                    </Label>
                                    <Textarea
                                        id="content"
                                        value={emailContent}
                                        onChange={(e) =>
                                            setEmailContent(e.target.value)
                                        }
                                        placeholder="Enter email content..."
                                        className="mt-1 min-h-[300px]"
                                    />
                                </div>
                            )}

                            {recipientType === "employers" &&
                                selectedTemplate && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Label htmlFor="content">
                                                Template Content
                                            </Label>
                                            <div className="text-xs text-muted-foreground">
                                                Available variables:
                                                [recipient_name],
                                                [company_name], [sender_name],
                                                [sender_year_and_major],
                                                [sender_school]
                                            </div>
                                        </div>
                                        <Textarea
                                            id="content"
                                            value={emailContent}
                                            onChange={(e) =>
                                                setEmailContent(e.target.value)
                                            }
                                            placeholder="Enter email content with variables..."
                                            className="mt-1 min-h-[300px] font-mono text-sm"
                                        />
                                    </div>
                                )}

                            <div className="text-sm text-muted-foreground">
                                Email will be sent to {selectedRecipients.size}{" "}
                                {selectedRecipients.size === 1
                                    ? "recipient"
                                    : "recipients"}
                                using your outreach team member information.
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 p-2 px-6 flex justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveStep("recipients")}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Recipients
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                handlePreview();
                                setActiveStep("preview");
                            }}
                            disabled={!emailSubject || !emailContent}
                        >
                            Preview Email
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Preview step */}
            {activeStep === "preview" && isPreviewOpen && (
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>Email Preview & Send</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium">
                                        Email Details
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Review your email before sending
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        selectedRecipients.size > 10
                                            ? "destructive"
                                            : "outline"
                                    }
                                >
                                    {selectedRecipients.size}{" "}
                                    {selectedRecipients.size === 1
                                        ? "recipient"
                                        : "recipients"}
                                    {selectedRecipients.size > 10
                                        ? " (Mass Email)"
                                        : ""}
                                </Badge>
                            </div>

                            <div className="border rounded-md p-4">
                                <div className="mb-4">
                                    <span className="text-sm font-medium">
                                        Subject:
                                    </span>{" "}
                                    {emailSubject}
                                </div>
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: previewHtml,
                                    }}
                                />
                            </div>

                            <div className="text-sm text-muted-foreground">
                                This email will be sent from{" "}
                                <span className="font-medium">
                                    {senderEmail}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 p-2 px-6 flex justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveStep("content")}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Edit
                        </Button>
                        <Button
                            variant={
                                selectedRecipients.size > 10
                                    ? "destructive"
                                    : "default"
                            }
                            onClick={handleSendEmails}
                            className="gap-2"
                        >
                            {selectedRecipients.size > 10 ? (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line
                                            x1="12"
                                            y1="17"
                                            x2="12.01"
                                            y2="17"
                                        />
                                    </svg>
                                    Send Mass Email ({selectedRecipients.size})
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <path d="M22 2L11 13" />
                                        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                                    </svg>
                                    Send Email
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Confirmation dialog */}
            <Dialog
                open={isConfirmationOpen}
                onOpenChange={setIsConfirmationOpen}
            >
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Confirm Email Recipients</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            You are about to send emails to the following{" "}
                            {recipientsToConfirm.length} recipient
                            {recipientsToConfirm.length !== 1 ? "s" : ""}:
                        </p>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="py-3 font-semibold">
                                            Name
                                        </TableHead>
                                        <TableHead className="py-3 font-semibold">
                                            Email
                                        </TableHead>
                                        {recipientType === "employers" && (
                                            <TableHead className="py-3 font-semibold">
                                                Organization
                                            </TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recipientsToConfirm.map(
                                        (recipient, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {recipient.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {recipient.email}
                                                </TableCell>
                                                {recipientType ===
                                                    "employers" && (
                                                    <TableCell>
                                                        {recipient.organization ||
                                                            "-"}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmationOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmedSend}>
                            Confirm & Send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

ComposePage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
