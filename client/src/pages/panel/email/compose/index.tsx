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
import { CircleUser, ChevronRight, MinusCircle } from "lucide-react";
import Link from "next/link";
import { useOutreachTeam } from "@/hooks/use-outreach-team";
import type { OutreachTeamDto } from "@/features/outreach/types/outreach-team";
import {
    sendBatchEmails,
    sendEmail,
    updateContact,
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

const STORAGE_KEY = "selectedOutreachAccount";

type RecipientType = "employers" | "registered" | "interested";

// Update EmailTemplate interface to include type
interface ExtendedEmailTemplate extends EmailTemplate {
    type: "employers" | "hackers";
}

// Update recipient interface to include organization and been_contacted
interface Recipient {
    id: string;
    to: EmailRecipient[];
    labels: string[];
    organization?: string;
    been_contacted?: boolean;
}

// Update EMAIL_TEMPLATES type annotation
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

// Helper function to extract variables from email content
const extractVariable = (content: string, variableName: string): string => {
    const regex = new RegExp(`\\[${variableName}\\]\\s*(?:\\n|$)`, "i");
    const match = content.match(regex);
    if (match) {
        return match[0].replace(/[\[\]]/g, "").trim();
    }
    return "";
};

export default function ComposePage({ mails = [] }: ComposePageProps) {
    const searchParams = useSearchParams();
    // Add a ref to track if URL params have been processed
    const paramsProcessedRef = React.useRef(false);

    // State for recipient selection
    const [selectedRecipients, setSelectedRecipients] = React.useState<
        Set<string>
    >(new Set());
    const [searchQuery, setSearchQuery] = React.useState("");
    const [recipientType, setRecipientType] =
        React.useState<RecipientType>("employers");

    // State for email content
    const [selectedTemplate, setSelectedTemplate] =
        React.useState<ExtendedEmailTemplate | null>(null);
    const [emailSubject, setEmailSubject] = React.useState("");
    const [emailContent, setEmailContent] = React.useState("");
    const [previewHtml, setPreviewHtml] = React.useState("");
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    // State for sender account
    const [senderEmail, setSenderEmail] = React.useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(STORAGE_KEY) || "";
        }
        return "";
    });

    // Fetch necessary data
    const { data: outreachTeamResponse } = useOutreachTeam();
    const { data: interestedUsers, isLoading: isInterestedLoading } =
        useInterestedUsers();
    const { data: contactsResponse } = useContacts();
    const contacts = React.useMemo(
        () => contactsResponse?.data || [],
        [contactsResponse?.data]
    );

    // Transform outreach team data into account format
    const emailAccounts = React.useMemo(() => {
        const outreachTeamArray = outreachTeamResponse?.data?.data || [];
        return outreachTeamArray.map((member: OutreachTeamDto) => ({
            label: member.name,
            email: member.email,
            icon: <CircleUser className="h-4 w-4" />,
        }));
    }, [outreachTeamResponse]);

    // Update recipientLists type annotation
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

    // Filter recipients based on type and search query
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

    // Calculate selection states
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

    // Handlers
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
                // Use email template renderer for employer emails
                const renderedEmails = await renderEmailTemplate({
                    templateType: selectedTemplate.name as EmailTemplateType,
                    recipients: contacts.filter((contact) =>
                        selectedRecipients.has(contact.id.toString())
                    ),
                    templateData: {
                        sender: selectedTeamMember,
                        emailContent: emailContent,
                        // Add additional data for Post-Call template
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
                // Use EmptyEmail template for hacker emails
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
                // Handle employer emails
                const renderedEmails = await renderEmailTemplate({
                    templateType: selectedTemplate?.name as EmailTemplateType,
                    recipients: contacts.filter((contact) =>
                        selectedRecipients.has(contact.id.toString())
                    ),
                    templateData: {
                        sender: selectedTeamMember,
                        emailContent: emailContent,
                        // Add additional data for Post-Call template
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
                                    HackCC: "https://hackcc.dev",
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

            // Update been_contacted flag for employers
            if (recipientType === "employers") {
                try {
                    // Process in parallel for better performance
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
                    // Don't show error toast here as emails were still sent successfully
                }
            }

            toast.success("Emails sent successfully!");

            // Reset form
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

            // Set default content for email templates
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

    // Handle auto-selection from URL parameters
    React.useEffect(() => {
        // Skip if we've already processed the params
        if (paramsProcessedRef.current) {
            return;
        }

        const contactId = searchParams?.get("contactId");
        const recipientTypeParam = searchParams?.get("recipientType");
        const toEmail = searchParams?.get("to");

        // Skip if no params are present
        if (!searchParams || (!contactId && !recipientTypeParam && !toEmail)) {
            return;
        }

        // Handle contact selection
        if (contactId) {
            setSelectedRecipients(new Set([contactId]));
            setRecipientType("employers");
            paramsProcessedRef.current = true;
            return;
        }

        // Handle hacker selection
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
    }, [mails, interestedUsers, searchParams]);

    if (isInterestedLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                Loading...
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 max-w-7xl">
            {/* Breadcrumb Navigation */}
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
                {/* Left Column - Recipients */}
                <div className="lg:col-span-5">
                    <Card>
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    Recipients ({filteredRecipients.length})
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
                                <div>
                                    <Label
                                        htmlFor="recipient-filter"
                                        className="text-sm font-semibold"
                                    >
                                        Search Recipients
                                    </Label>
                                    <div className="relative mt-1 mb-4">
                                        <Input
                                            id="recipient-filter"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder={
                                                recipientType === "employers"
                                                    ? "Search by name, email, or organization..."
                                                    : "Search by name or email..."
                                            }
                                            className="pl-3 pr-10 py-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden shadow-sm bg-card">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-12 py-3">
                                                    <div className="flex items-center justify-center">
                                                        <Checkbox
                                                            checked={
                                                                areAllFilteredSelected
                                                            }
                                                            onCheckedChange={
                                                                handleSelectAll
                                                            }
                                                            aria-label="Select all recipients"
                                                        />
                                                        {areSomeFilteredSelected && (
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
                                                {recipientType ===
                                                    "employers" && (
                                                    <TableHead className="py-3 font-semibold">
                                                        Organization
                                                    </TableHead>
                                                )}
                                                <TableHead className="w-20 py-3">
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredRecipients.map(
                                                (recipient) => (
                                                    <TableRow
                                                        key={recipient.id}
                                                        className={
                                                            recipientType ===
                                                                "employers" &&
                                                            recipient.been_contacted
                                                                ? "bg-purple-100 dark:bg-purple-900/20"
                                                                : "hover:bg-muted/50"
                                                        }
                                                    >
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedRecipients.has(
                                                                    recipient.id
                                                                )}
                                                                onCheckedChange={() =>
                                                                    handleRecipientToggle(
                                                                        recipient.id
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {
                                                                recipient
                                                                    .to?.[0]
                                                                    ?.name
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {
                                                                recipient
                                                                    .to?.[0]
                                                                    ?.email
                                                            }
                                                        </TableCell>
                                                        {recipientType ===
                                                            "employers" && (
                                                            <TableCell>
                                                                {
                                                                    recipient.organization
                                                                }
                                                            </TableCell>
                                                        )}
                                                        <TableCell>
                                                            {recipient.labels.map(
                                                                (label) => (
                                                                    <Badge
                                                                        key={
                                                                            label
                                                                        }
                                                                        variant="secondary"
                                                                        className="mr-1"
                                                                    >
                                                                        {label}
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Email Content */}
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

                    {/* Preview Dialog */}
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
