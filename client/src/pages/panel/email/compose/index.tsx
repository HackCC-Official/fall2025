"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    ChevronDown,
    X,
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
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import { debounce } from "lodash";

const STORAGE_KEY = "selectedOutreachAccount";

type RecipientType = "employers" | "registered" | "interested";

interface ExtendedEmailTemplate extends EmailTemplate {
    type: "employers" | "hackers";
}

interface Recipient {
    id: string;
    to: EmailRecipient[];
    labels: string[];
    organization?: string;
    department?: string;
    been_contacted?: boolean;
}

const EMAIL_TEMPLATES: ExtendedEmailTemplate[] = [
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
        subject: "HackCC x [Company] Sponsorship Confirmation!",
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
                            {"organization" in contacts[0] && (
                                <TableHead className="py-3 font-semibold">
                                    Organization
                                </TableHead>
                            )}
                            <TableHead className="w-20 py-3">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow
                                key={contact.id}
                                className={
                                    "been_contacted" in contact &&
                                    contact.been_contacted
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
                                        ("first_name" in contact &&
                                            `${contact.first_name} ${contact.last_name}`)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {("to" in contact &&
                                        contact.to?.[0]?.email) ||
                                        ("email" in contact && contact.email)}
                                </TableCell>
                                {"organization" in contact && (
                                    <TableCell>
                                        {contact.organization}
                                    </TableCell>
                                )}
                                <TableCell>
                                    {"labels" in contact && contact.labels ? (
                                        contact.labels.map((label: string) => (
                                            <Badge
                                                key={label}
                                                variant="secondary"
                                                className="mr-1"
                                            >
                                                {label}
                                            </Badge>
                                        ))
                                    ) : "been_contacted" in contact &&
                                      contact.been_contacted ? (
                                        <Badge variant="secondary">
                                            Contacted
                                        </Badge>
                                    ) : null}
                                </TableCell>
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

export default function ComposePage({ mails = [] }: ComposePageProps) {
    const searchParams = useSearchParams();
    const paramsProcessedRef = React.useRef(false);

    const [selectedRecipients, setSelectedRecipients] = React.useState<
        Set<string>
    >(new Set());
    const [searchQuery, setSearchQuery] = React.useState("");
    const [recipientType, setRecipientType] =
        React.useState<RecipientType>("employers");

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

    const [selectedOrganizations, setSelectedOrganizations] = React.useState<
        Set<string>
    >(new Set());

    const [contactsView, setContactsView] = React.useState<
        "individuals" | "organizations" | "selected"
    >("individuals");
    const [contactsPage, setContactsPage] = React.useState(1);

    const [isSearching, setIsSearching] = React.useState(false);
    const [allContacts, setAllContacts] = React.useState<ContactDto[]>([]);
    const [isLoadingAllContacts, setIsLoadingAllContacts] =
        React.useState(false);

    // Debounced search for contacts using searchContacts API function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearchContacts = React.useCallback(
        debounce(async (value: string) => {
            if (!value || value.length < 2) {
                setContactsApiSearch("");
                // If search is completely cleared, refetch the initial state and clear selections
                if (!value) {
                    setContactsApiPage(1);
                    refetchContacts();
                    // Clear selected recipients
                    setSelectedRecipients(new Set());
                    // If in organizations view, refresh all contacts
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
                    // If the API returns data in a different format than expected,
                    // try to handle the response directly
                    if (
                        error.message ===
                        "Invalid response format from contacts search API."
                    ) {
                        // The response might be a direct array rather than having a data property
                        const responseData = error.response?.data;
                        if (Array.isArray(responseData)) {
                            return responseData;
                        }
                    }
                    throw error;
                });

                // Update contacts directly instead of using API pagination
                if (contactsResponse && results) {
                    contactsResponse.data = results;
                }
            } catch (error) {
                console.error("Error searching contacts:", error);
                toast.error("Failed to search contacts. Please try again.");
                // Fall back to regular search if specialized search fails
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

    // Handle page changes more efficiently
    const handleContactsPageChange = React.useCallback(
        (newPage: number) => {
            setContactsPage(newPage);
            setContactsApiPage(newPage);
        },
        [setContactsApiPage]
    );

    // Handle bulk selection
    const handleSelectAllVisible = () => {
        const newSelected = new Set(selectedRecipients);
        contactsResponse?.data?.forEach((contact) => {
            newSelected.add(contact.id.toString());
        });
        setSelectedRecipients(newSelected);
    };

    const handleSelectOrganization = (org: string, selected: boolean) => {
        const newSelectedOrgs = new Set(selectedOrganizations);
        if (selected) {
            newSelectedOrgs.add(org);
        } else {
            newSelectedOrgs.delete(org);
        }
        setSelectedOrganizations(newSelectedOrgs);

        // Update individual recipient selection based on organization
        const newSelectedRecipients = new Set(selectedRecipients);
        contactsResponse?.data?.forEach((contact) => {
            if (contact.organization === org) {
                if (selected) {
                    newSelectedRecipients.add(contact.id.toString());
                } else {
                    newSelectedRecipients.delete(contact.id.toString());
                }
            }
        });
        setSelectedRecipients(newSelectedRecipients);
    };

    const totalSelectedContacts = React.useMemo(() => {
        return selectedRecipients.size;
    }, [selectedRecipients]);

    const contacts = React.useMemo(() => {
        return contactsResponse?.data || [];
    }, [contactsResponse?.data]);

    // Load all contacts when switching to organization view
    React.useEffect(() => {
        if (
            contactsView === "organizations" &&
            allContacts.length === 0 &&
            !isLoadingAllContacts
        ) {
            const loadAllContacts = async () => {
                try {
                    setIsLoadingAllContacts(true);
                    // Use the fetchAllContacts method from the hook
                    const allContactsList = await fetchAllContacts(
                        100,
                        searchQuery
                    );
                    setAllContacts(allContactsList);
                } catch (error) {
                    console.error("Error fetching all contacts:", error);
                    toast.error(
                        "Failed to load all organizations. Some may be missing."
                    );
                } finally {
                    setIsLoadingAllContacts(false);
                }
            };

            loadAllContacts();
        }
    }, [
        contactsView,
        allContacts.length,
        isLoadingAllContacts,
        fetchAllContacts,
        searchQuery,
    ]);

    // Modify the groupedByOrganization to use allContacts when in organization view
    const groupedByOrganization = React.useMemo(() => {
        const groups: Record<string, ContactDto[]> = {};
        const noOrg: ContactDto[] = [];

        // Use allContacts when in organization view and allContacts is populated
        const contactsToGroup =
            contactsView === "organizations" && allContacts.length > 0
                ? allContacts
                : contacts;

        contactsToGroup.forEach((contact) => {
            if (contact.organization) {
                if (!groups[contact.organization]) {
                    groups[contact.organization] = [];
                }
                groups[contact.organization].push(contact);
            } else {
                noOrg.push(contact);
            }
        });

        if (noOrg.length > 0) {
            groups["No Organization"] = noOrg;
        }

        return groups;
    }, [contacts, contactsView, allContacts]);

    const recipientLists = React.useMemo(() => {
        const employerContacts = contacts.map((contact) => ({
            id: contact.id.toString(),
            to: [
                {
                    name: `${contact.first_name} ${contact.last_name}`,
                    email: contact.email,
                },
            ],
            organization: contact.organization,
            department: contact.department,
            labels: ["Employer"],
            been_contacted: contact.been_contacted,
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
                recipient.organization
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
            if (recipientType === "employers" && selectedTemplate) {
                const renderedEmails = await renderEmailTemplate({
                    templateType: selectedTemplate.name as EmailTemplateType,
                    recipients: contacts.filter((contact) =>
                        selectedRecipients.has(contact.id.toString())
                    ),
                    templateData: {
                        sender: selectedTeamMember,
                        emailContent: emailContent,
                        ...(selectedTemplate.name === "Post-Call Follow-Up" && {
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
                    },
                    contactInfo: {
                        email: senderEmail,
                        phone: "+1234567890",
                    },
                });
                previewContent = renderedEmails[0];
            } else {
                previewContent = await render(
                    <EmptyEmail
                        recipientName="Preview User"
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

        try {
            const allRecipients = recipientLists[recipientType];
            const selectedRecipientsData = allRecipients.filter((recipient) =>
                selectedRecipients.has(recipient.id)
            );

            let emailData: SendBatchEmailsDto;

            if (recipientType === "employers") {
                const renderedEmails = await renderEmailTemplate({
                    templateType: selectedTemplate?.name as EmailTemplateType,
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
                    },
                    contactInfo: {
                        email: senderEmail,
                        phone: "+1234567890",
                    },
                });

                emailData = {
                    emails: selectedRecipientsData.map((recipient, index) => ({
                        from: senderEmail,
                        to: recipient.to.map((to) => ({
                            email: to.email,
                            name: to.name || to.email.split("@")[0],
                        })),
                        subject: emailSubject,
                        html: renderedEmails[index],
                    })),
                };
            } else {
                // Handle hacker emails
                const renderedEmails = await Promise.all(
                    selectedRecipientsData.map(async (recipient) => {
                        const recipientName = recipient.to[0]?.name || "Hacker";
                        return render(
                            <EmptyEmail
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

                emailData = {
                    emails: selectedRecipientsData.map((recipient, index) => ({
                        from: senderEmail,
                        to: recipient.to.map((to) => ({
                            email: to.email,
                            name: to.name || to.email.split("@")[0],
                        })),
                        subject: emailSubject,
                        html: renderedEmails[index],
                    })),
                };
            }

            // Send emails
            if (selectedRecipientsData.length === 1) {
                await sendEmail(emailData.emails[0]);
            } else {
                await sendBatchEmails(emailData);
            }

            if (recipientType === "employers") {
                try {
                    await Promise.all(
                        selectedRecipientsData.map(async (recipient) => {
                            await updateContact(recipient.id, {
                                been_contacted: true,
                            });
                        })
                    );
                    console.log("Successfully marked employers as contacted");
                } catch (error) {
                    console.error(
                        "Error updating employer contact status:",
                        error
                    );
                }
            }

            toast.success("Emails sent successfully!");

            setSelectedRecipients(new Set());
            setSelectedTemplate(null);
            setEmailSubject("");
            setEmailContent("");
            setPreviewHtml("");
        } catch (error) {
            console.error("Error sending emails:", error);
            toast.error("Failed to send emails. Please try again.");
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
                                contact.email.toLowerCase() ===
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

    const isOrganizationFullySelected = React.useCallback(
        (org: string) => {
            const orgContacts = groupedByOrganization[org];
            if (!orgContacts || orgContacts.length === 0) return false;

            return orgContacts.every((contact) =>
                selectedRecipients.has(contact.id.toString())
            );
        },
        [groupedByOrganization, selectedRecipients]
    );

    const isOrganizationPartiallySelected = React.useCallback(
        (org: string) => {
            const orgContacts = groupedByOrganization[org];
            if (!orgContacts || orgContacts.length === 0) return false;

            return (
                orgContacts.some((contact) =>
                    selectedRecipients.has(contact.id.toString())
                ) && !isOrganizationFullySelected(org)
            );
        },
        [groupedByOrganization, selectedRecipients, isOrganizationFullySelected]
    );

    const emailAccounts = React.useMemo(() => {
        const outreachTeamArray = outreachTeamResponse?.data?.data || [];
        return outreachTeamArray.map((member: OutreachTeamDto) => ({
            label: member.name,
            email: member.email,
            icon: <CircleUser className="h-4 w-4" />,
        }));
    }, [outreachTeamResponse]);

    const ViewSelector = () => (
        <div className="flex items-center gap-2 mb-4">
            <Button
                size="sm"
                variant={contactsView === "individuals" ? "default" : "outline"}
                onClick={() => setContactsView("individuals")}
            >
                <Users className="h-4 w-4 mr-2" />
                Individuals
            </Button>
            <Button
                size="sm"
                variant={
                    contactsView === "organizations" ? "default" : "outline"
                }
                onClick={() => setContactsView("organizations")}
            >
                <Building className="h-4 w-4 mr-2" />
                Organizations
                {isLoadingAllContacts && (
                    <span className="ml-2 h-3 w-3 animate-spin rounded-full border-b-2 border-current"></span>
                )}
            </Button>
            <Button
                size="sm"
                variant={contactsView === "selected" ? "default" : "outline"}
                onClick={() => setContactsView("selected")}
                disabled={selectedRecipients.size === 0}
            >
                <Checkbox className="h-4 w-4 mr-2" checked={true} />
                Selected ({selectedRecipients.size})
            </Button>
        </div>
    );

    // Add state to track expanded organizations
    const [expandedOrgs, setExpandedOrgs] = React.useState<Set<string>>(
        new Set()
    );

    // Toggle organization expansion
    const toggleOrgExpansion = (org: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent triggering the checkbox toggle
        const newExpanded = new Set(expandedOrgs);
        if (newExpanded.has(org)) {
            newExpanded.delete(org);
        } else {
            newExpanded.add(org);
        }
        setExpandedOrgs(newExpanded);
    };

    // Add a function to calculate contacted counts for organizations
    const getOrganizationContactedCount = React.useCallback(
        (org: string) => {
            const orgContacts = groupedByOrganization[org];
            if (!orgContacts || orgContacts.length === 0) return 0;

            return orgContacts.filter((contact) => contact.been_contacted)
                .length;
        },
        [groupedByOrganization]
    );

    // Add a helper function to get selected contacts
    const getSelectedContacts = React.useCallback(() => {
        return contacts.filter((contact) =>
            selectedRecipients.has(contact.id.toString())
        );
    }, [contacts, selectedRecipients]);

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
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePreview}
                            disabled={selectedRecipients.size === 0}
                        >
                            Preview Email
                        </Button>
                        <Button
                            onClick={handleSendEmails}
                            disabled={selectedRecipients.size === 0}
                        >
                            Send Emails ({selectedRecipients.size})
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                    <Card>
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    Recipients ({totalSelectedContacts})
                                    {recipientType === "employers" &&
                                        contactsResponse?.total && (
                                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                from {contactsResponse.total}{" "}
                                                total contacts
                                            </span>
                                        )}
                                </CardTitle>
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
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
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

                                                    // Clear selected recipients
                                                    setSelectedRecipients(
                                                        new Set()
                                                    );

                                                    // Fully refresh the contacts data to initial state
                                                    refetchContacts();

                                                    // If in organizations view, refresh all contacts
                                                    if (
                                                        contactsView ===
                                                        "organizations"
                                                    ) {
                                                        setAllContacts([]);
                                                        setIsLoadingAllContacts(
                                                            true
                                                        );
                                                        fetchAllContacts(
                                                            100,
                                                            ""
                                                        )
                                                            .then((data) => {
                                                                setAllContacts(
                                                                    data
                                                                );
                                                            })
                                                            .catch((error) => {
                                                                console.error(
                                                                    "Error refreshing all contacts:",
                                                                    error
                                                                );
                                                                toast.error(
                                                                    "Failed to refresh organization data"
                                                                );
                                                            })
                                                            .finally(() => {
                                                                setIsLoadingAllContacts(
                                                                    false
                                                                );
                                                            });
                                                    }
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

                                    {recipientType === "employers" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-1"
                                            onClick={handleSelectAllVisible}
                                        >
                                            <Checkbox
                                                className="h-3 w-3 mr-1"
                                                id="select-all-visible"
                                            />
                                            Select Page
                                        </Button>
                                    )}
                                </div>

                                {recipientType === "employers" && (
                                    <ViewSelector />
                                )}

                                {recipientType === "employers" &&
                                    contactsView === "individuals" && (
                                        <RecipientSelectionTable
                                            contacts={contacts}
                                            currentPage={contactsPage}
                                            totalPages={contactsTotalPages || 1}
                                            selectedRecipients={
                                                selectedRecipients
                                            }
                                            onSelectRecipient={
                                                handleRecipientToggle
                                            }
                                            onSelectAll={handleSelectAll}
                                            onPageChange={
                                                handleContactsPageChange
                                            }
                                            loading={isContactsLoading}
                                            areAllSelected={
                                                areAllFilteredSelected
                                            }
                                            areSomeSelected={
                                                areSomeFilteredSelected
                                            }
                                        />
                                    )}

                                {recipientType === "employers" &&
                                    contactsView === "organizations" && (
                                        <div className="space-y-2">
                                            {isLoadingAllContacts &&
                                            allContacts.length === 0 ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Loading all
                                                            organizations...
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                Object.entries(
                                                    groupedByOrganization
                                                ).map(([org, orgContacts]) => (
                                                    <div
                                                        key={org}
                                                        className="border rounded-md overflow-hidden"
                                                    >
                                                        {/* Organization header with checkbox */}
                                                        <div
                                                            className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer"
                                                            onClick={() =>
                                                                handleSelectOrganization(
                                                                    org,
                                                                    !isOrganizationFullySelected(
                                                                        org
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    checked={isOrganizationFullySelected(
                                                                        org
                                                                    )}
                                                                    className={
                                                                        isOrganizationPartiallySelected(
                                                                            org
                                                                        )
                                                                            ? "opacity-70"
                                                                            : ""
                                                                    }
                                                                />
                                                                <span className="font-medium">
                                                                    {org}
                                                                </span>
                                                                <Badge variant="outline">
                                                                    {
                                                                        orgContacts.length
                                                                    }
                                                                </Badge>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={
                                                                        getOrganizationContactedCount(
                                                                            org
                                                                        ) === 0
                                                                            ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                                                            : ""
                                                                    }
                                                                >
                                                                    Contacted{" "}
                                                                    {getOrganizationContactedCount(
                                                                        org
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) =>
                                                                    toggleOrgExpansion(
                                                                        org,
                                                                        e
                                                                    )
                                                                }
                                                                className="p-0 h-8 w-8"
                                                            >
                                                                <ChevronDown
                                                                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                                                        expandedOrgs.has(
                                                                            org
                                                                        )
                                                                            ? "transform rotate-180"
                                                                            : ""
                                                                    }`}
                                                                />
                                                            </Button>
                                                        </div>

                                                        {expandedOrgs.has(
                                                            org
                                                        ) && (
                                                            <div className="border-t border-border">
                                                                <div className="max-h-60 overflow-y-auto">
                                                                    <Table>
                                                                        <TableBody>
                                                                            {orgContacts.map(
                                                                                (
                                                                                    contact
                                                                                ) => (
                                                                                    <TableRow
                                                                                        key={
                                                                                            contact.id
                                                                                        }
                                                                                        className={
                                                                                            contact.been_contacted
                                                                                                ? "bg-purple-100 dark:bg-purple-900/20"
                                                                                                : "hover:bg-muted/50"
                                                                                        }
                                                                                    >
                                                                                        <TableCell className="w-12">
                                                                                            <Checkbox
                                                                                                checked={selectedRecipients.has(
                                                                                                    contact.id.toString()
                                                                                                )}
                                                                                                onCheckedChange={() =>
                                                                                                    handleRecipientToggle(
                                                                                                        contact.id.toString()
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell className="font-medium truncate max-w-[150px]">
                                                                                            {`${contact.first_name} ${contact.last_name}`}
                                                                                        </TableCell>
                                                                                        <TableCell className="text-muted-foreground truncate max-w-[200px]">
                                                                                            {
                                                                                                contact.email
                                                                                            }
                                                                                        </TableCell>
                                                                                        <TableCell className="w-20">
                                                                                            {contact.been_contacted && (
                                                                                                <Badge variant="secondary">
                                                                                                    Contacted
                                                                                                </Badge>
                                                                                            )}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )
                                                                            )}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                {recipientType === "employers" &&
                                    contactsView === "selected" && (
                                        <>
                                            {selectedRecipients.size === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                                    <Checkbox className="h-12 w-12 text-muted-foreground mb-2" />
                                                    <h3 className="font-medium text-lg">
                                                        No contacts selected
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Select contacts to see
                                                        them here
                                                    </p>
                                                </div>
                                            ) : (
                                                <RecipientSelectionTable
                                                    contacts={getSelectedContacts()}
                                                    currentPage={1}
                                                    totalPages={1}
                                                    selectedRecipients={
                                                        selectedRecipients
                                                    }
                                                    onSelectRecipient={
                                                        handleRecipientToggle
                                                    }
                                                    onSelectAll={(checked) => {
                                                        if (!checked) {
                                                            setSelectedRecipients(
                                                                new Set()
                                                            );
                                                        }
                                                    }}
                                                    onPageChange={() => {}}
                                                    loading={false}
                                                    areAllSelected={true}
                                                    areSomeSelected={false}
                                                />
                                            )}
                                        </>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-7">
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Email Content</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {recipientType === "employers" && (
                                    <div>
                                        <Label htmlFor="template">
                                            Email Template
                                        </Label>
                                        <Select
                                            onValueChange={handleTemplateChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EMAIL_TEMPLATES.filter(
                                                    (template) =>
                                                        template.type ===
                                                        "employers"
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
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="subject">Subject</Label>
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
                                        <Label htmlFor="content">Content</Label>
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
                                                    You can use these variables:
                                                    [recipient_name],
                                                    [company_name],
                                                    [sender_name],
                                                    [sender_year_and_major],
                                                    [sender_school], [venue],
                                                    [location]
                                                </div>
                                            </div>
                                            <Textarea
                                                id="content"
                                                value={emailContent}
                                                onChange={(e) =>
                                                    setEmailContent(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter email content with variables..."
                                                className="mt-1 min-h-[300px] font-mono text-sm"
                                            />
                                        </div>
                                    )}

                                <div className="text-sm text-muted-foreground">
                                    Email will be sent using your outreach team
                                    member information.
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Dialog
                        open={isPreviewOpen}
                        onOpenChange={setIsPreviewOpen}
                    >
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Email Preview</DialogTitle>
                            </DialogHeader>
                            <div
                                className="prose dark:prose-invert max-w-none mt-4"
                                dangerouslySetInnerHTML={{
                                    __html: previewHtml,
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

ComposePage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
