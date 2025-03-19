"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useOutreachTeam } from "@/hooks/use-outreach-team";
import { useInterestedUsers } from "@/hooks/use-interested.user";
import { useContacts } from "@/hooks/use-contacts";
import { useSearchParams } from "next/navigation";
import { render } from "@react-email/render";
import { EmptyEmail } from "@/emails/empty-template";
import { InterestedEmail } from "@/emails/interested-template";
import { ColdEmail } from "@/emails/employers/cold-template";
import type { Mail } from "@/types/mail";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import type { RecipientConfirmationDetails } from "@/features/outreach/types/contact.dto";
import AccountSwitcher from "../../pages/panel/email/components/account-switcher";
import PanelLayout from "../../pages/panel/layout";
import {
    renderEmailTemplate,
    type EmailTemplateType,
} from "@/lib/email/email-renderer";
import type { EmailTemplate } from "@/lib/email/types";

// Import components
import RecipientSelector from "./RecipientSelector";
import EmailContentEditor from "./EmailContentEditor";
import EmailPreview from "./EmailPreview";
import ConfirmationDialog from "./ConfirmationDialog";
import useEmailSender from "./useEmailSender";

// Import type definition from original file
export type RecipientType = "employers" | "registered" | "interested";

interface RecipientItem {
    id: string;
    to: Array<{
        name: string;
        email: string;
    }>;
    company?: string;
    labels?: string[];
    status?: string;
}

interface ExtendedEmailTemplate extends EmailTemplate {
    type: "employers" | "hackers";
}

interface ComposePageProps {
    mails?: Mail[];
}

const STORAGE_KEY = "selectedOutreachAccount";

export default function ComposePage({ mails = [] }: ComposePageProps) {
    const searchParams = useSearchParams();
    const paramsProcessedRef = React.useRef(false);

    const [selectedRecipients, setSelectedRecipients] = React.useState<
        Set<string>
    >(new Set());
    const [searchQuery, setSearchQuery] = React.useState("");
    const [recipientType, setRecipientType] =
        React.useState<RecipientType>("employers");
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

    const [allContacts, setAllContacts] = React.useState<ContactDto[]>([]);
    const [isLoadingAllContacts, setIsLoadingAllContacts] =
        React.useState(false);

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

    // Add a new state for tracking the active step
    const [activeStep, setActiveStep] = React.useState<
        "recipients" | "content" | "preview"
    >("recipients");

    // Add a new state for global filtering
    const [globalFilters, setGlobalFilters] = React.useState<{
        liaison: string | null;
        status: string | null;
        search: string;
    }>({
        liaison: null,
        status: null,
        search: "",
    });

    // Add a new function to get globally filtered contacts
    const getGloballyFilteredContacts = React.useCallback(() => {
        if (!allContacts.length) return [];

        return allContacts.filter((contact) => {
            // Apply search filter
            if (globalFilters.search && globalFilters.search.length > 1) {
                const searchLower = globalFilters.search.toLowerCase();
                const nameMatch = contact.contact_name
                    ?.toLowerCase()
                    .includes(searchLower);
                const emailMatch = contact.email_address
                    ?.toLowerCase()
                    .includes(searchLower);
                const companyMatch = contact.company
                    ?.toLowerCase()
                    .includes(searchLower);

                if (!nameMatch && !emailMatch && !companyMatch) {
                    return false;
                }
            }

            // Apply liaison filter
            if (
                globalFilters.liaison &&
                contact.liaison !== globalFilters.liaison
            ) {
                return false;
            }

            // Apply status filter
            if (
                globalFilters.status &&
                contact.status !== globalFilters.status
            ) {
                return false;
            }

            return true;
        });
    }, [allContacts, globalFilters]);

    // Load all contacts on component mount
    React.useEffect(() => {
        const loadAllContacts = async () => {
            if (recipientType !== "employers") return;

            setIsLoadingAllContacts(true);
            try {
                const allContactsList = await fetchAllContacts(1000, "");
                setAllContacts(allContactsList);

                // Extract all liaisons for filter dropdown
                const liaisonSet = new Set<string>();
                allContactsList.forEach((contact) => {
                    if (
                        contact.liaison &&
                        typeof contact.liaison === "string" &&
                        contact.liaison.trim() !== ""
                    ) {
                        liaisonSet.add(contact.liaison);
                    }
                });
                setLiaisons(Array.from(liaisonSet).sort());
            } catch (error) {
                console.error("Error loading all contacts:", error);
                toast.error(
                    "Failed to load all contacts. Some features may be limited."
                );
            } finally {
                setIsLoadingAllContacts(false);
            }
        };

        loadAllContacts();
    }, [fetchAllContacts, recipientType]);

    // Reset template when recipient type changes
    React.useEffect(() => {
        setSelectedTemplate(null);
        setEmailSubject("");
        setEmailContent("");
    }, [recipientType]);

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
        if (
            contactsView === "organizations" ||
            globalFilters.liaison !== null ||
            globalFilters.status !== null
        ) {
            return getGloballyFilteredContacts();
        }

        const baseContacts = contactsResponse?.data || [];
        return getFilteredContacts(baseContacts);
    }, [
        contactsResponse?.data,
        getFilteredContacts,
        contactsView,
        getGloballyFilteredContacts,
        globalFilters,
    ]);

    // Create the recipient lists using contacts
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
        } as Record<RecipientType, RecipientItem[]>;
    }, [contacts, mails, interestedUsers]);

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
            (member) => member.email === senderEmail
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
                } else if (selectedTemplate?.name === "Cold Outreach Email") {
                    previewContent = await render(
                        <ColdEmail
                            recipientName="Name"
                            companyName="Company"
                            venue="HackCC Campus"
                            sender={selectedTeamMember}
                            subject={emailSubject}
                            positionAtHackCC="Sponsorship Coordinator"
                            socialLinks={{
                                linkedin: "https://linkedin.com/company/hackcc",
                            }}
                            customEmailBody={emailContent}
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

    const extractVariable = (content: string, variableName: string): string => {
        const regex = new RegExp(`\\[${variableName}\\]\\s*(?:\\n|$)`, "i");
        const match = content.match(regex);
        if (match) {
            return match[0].replace(/[\[\]]/g, "").trim();
        }
        return "";
    };

    const handleSendEmails = () => {
        if (selectedRecipients.size === 0) {
            toast.error("Please select at least one recipient");
            return;
        }

        const selectedTeamMember = outreachTeamResponse?.data?.data.find(
            (member) => member.email === senderEmail
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

    // Reset form state after successful send
    const resetForm = () => {
        setSelectedRecipients(new Set());
        setSelectedTemplate(null);
        setEmailSubject("");
        setEmailContent("");
        setPreviewHtml("");
        setIsConfirmationOpen(false);
    };

    // Use the email sender hook
    const { handleSendEmails: handleConfirmedSend } = useEmailSender({
        recipientType,
        selectedRecipients,
        recipientLists,
        contacts,
        emailSubject,
        emailContent,
        senderEmail,
        selectedTeamMember: outreachTeamResponse?.data?.data.find(
            (member) => member.email === senderEmail
        ),
        selectedTemplate: selectedTemplate
            ? {
                  id: selectedTemplate.id,
                  name: selectedTemplate.name,
                  subject: selectedTemplate.subject,
                  content: selectedTemplate.content,
              }
            : undefined,
        onSuccess: resetForm,
    });

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
                    // Handle searching logic...
                } catch (error) {
                    console.error("Error searching for contact:", error);
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
    }, [mails, interestedUsers, searchParams, contacts, selectedRecipients]);

    const emailAccounts = React.useMemo(() => {
        const outreachTeamArray = outreachTeamResponse?.data?.data || [];
        return outreachTeamArray.map((member) => ({
            label: member.name,
            email: member.email,
            icon: <ChevronRight className="h-4 w-4" />,
        }));
    }, [outreachTeamResponse]);

    // Simple step indicators for process
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
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
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
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
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
                        <CardTitle>Recipients</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <RecipientSelector
                            recipientType={recipientType}
                            setRecipientType={setRecipientType}
                            selectedRecipients={selectedRecipients}
                            setSelectedRecipients={setSelectedRecipients}
                            contacts={contacts}
                            allContacts={allContacts}
                            isContactsLoading={isContactsLoading}
                            contactsResponse={contactsResponse}
                            contactsPage={contactsPage}
                            contactsTotalPages={contactsTotalPages}
                            interestedUsers={interestedUsers || []}
                            isInterestedLoading={isInterestedLoading}
                            mails={mails}
                            liaisons={liaisons}
                            fetchAllContacts={fetchAllContacts}
                            setContactsApiPage={setContactsApiPage}
                            setContactsApiSearch={setContactsApiSearch}
                            refetchContacts={refetchContacts}
                            isLoadingAllContacts={isLoadingAllContacts}
                            setIsLoadingAllContacts={setIsLoadingAllContacts}
                            contactsView={contactsView}
                            setContactsView={setContactsView}
                            setContactsPage={setContactsPage}
                            globalFilters={globalFilters}
                            setGlobalFilters={setGlobalFilters}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            getGloballyFilteredContacts={
                                getGloballyFilteredContacts
                            }
                        />
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
                        <CardTitle>Compose Email</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <EmailContentEditor
                            recipientType={recipientType}
                            selectedRecipients={selectedRecipients}
                            emailSubject={emailSubject}
                            setEmailSubject={setEmailSubject}
                            emailContent={emailContent}
                            setEmailContent={setEmailContent}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
                            handlePreview={handlePreview}
                            setActiveStep={setActiveStep}
                            senderInfo={outreachTeamResponse?.data?.data.find(
                                (member) => member.email === senderEmail
                            )}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Preview step */}
            {activeStep === "preview" && isPreviewOpen && (
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>Email Preview & Send</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <EmailPreview
                            recipientType={recipientType}
                            selectedRecipients={selectedRecipients}
                            emailSubject={emailSubject}
                            previewHtml={previewHtml}
                            senderEmail={senderEmail}
                            handleSendEmails={handleSendEmails}
                            setActiveStep={setActiveStep}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Confirmation dialog */}
            <ConfirmationDialog
                isConfirmationOpen={isConfirmationOpen}
                setIsConfirmationOpen={setIsConfirmationOpen}
                recipientsToConfirm={recipientsToConfirm}
                handleConfirmedSend={handleConfirmedSend}
                recipientType={recipientType}
            />

            {/* Loading indicator when loading all contacts */}
            {isLoadingAllContacts && (
                <div className="w-full flex items-center justify-center py-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">
                            Loading all contacts...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

ComposePage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
