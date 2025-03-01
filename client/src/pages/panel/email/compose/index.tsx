"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { EmailTemplate } from "@/lib/email/types";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import {
    renderEmailTemplate,
    type EmailTemplateType,
} from "@/lib/email/email-renderer";
import PanelLayout from "../../layout";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useContacts } from "@/hooks/use-contacts";
import { sendEmail } from "@/features/outreach/api/outreach";
import { toast } from "sonner";
import AccountSwitcher from "../components/account-switcher";
import { CircleUser, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useOutreachTeam } from "@/hooks/use-outreach-team";
import type { OutreachTeamDto } from "@/features/outreach/types/outreach-team";
import Link from "next/link";

const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: "1",
        name: "Sponsorship Confirmation",
        subject: "Sponsorship Opportunity with HackCC",
        content: "Dear [Name],\n\nI hope this email finds you well...",
    },
    {
        id: "2",
        name: "Follow-Up Email",
        subject: "Re: Meet the best students in X town this May",
        content: "Hi [Name],\n\nI hope this email finds you well...",
    },
];

const STORAGE_KEY = "selectedOutreachAccount";

export default function ComposePage() {
    const searchParams = useSearchParams();
    const [selectedContacts, setSelectedContacts] = React.useState<Set<string>>(
        new Set()
    );
    const [companyFilter, setCompanyFilter] = React.useState("");
    const [selectedTemplate, setSelectedTemplate] =
        React.useState<EmailTemplate | null>(null);
    const [emailSubject, setEmailSubject] = React.useState("");
    const [previewHtml, setPreviewHtml] = React.useState<string>("");
    const [selectedContact, setSelectedContact] =
        React.useState<ContactDto | null>(null);
    const [senderEmail, setSenderEmail] = React.useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(STORAGE_KEY) || "";
        }
        return "";
    });

    // Fetch outreach team data
    const { data: outreachTeamResponse } = useOutreachTeam();

    // Fetch contacts data
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

    // Load the saved email account from local storage
    useEffect(() => {
        if (typeof window !== "undefined" && emailAccounts.length > 0) {
            // Only set email if current email is empty or not in the accounts list
            if (
                !senderEmail ||
                !emailAccounts.some((account) => account.email === senderEmail)
            ) {
                const newEmail = emailAccounts[0].email;
                setSenderEmail(newEmail);
                localStorage.setItem(STORAGE_KEY, newEmail);
            }
        }
    }, [emailAccounts, senderEmail]);

    // Handle auto-selection of contact from URL parameter
    React.useEffect(() => {
        if (!searchParams) return;

        const contactId = searchParams.get("contactId");
        if (contactId) {
            setSelectedContacts(new Set([contactId]));
            const contact = contacts.find((c) => c.id.toString() === contactId);
            if (contact) {
                setSelectedContact(contact);
            }
        }
    }, [searchParams, contacts]);

    const filteredContacts = React.useMemo(() => {
        return contacts.filter((contact) =>
            contact.organization
                .toLowerCase()
                .includes(companyFilter.toLowerCase())
        );
    }, [contacts, companyFilter]);

    const handleTemplateChange = (templateId: string) => {
        const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplate(template);
            setEmailSubject(template.subject);
        }
    };

    const handleContactToggle = (contactId: string) => {
        const newSelected = new Set(selectedContacts);
        if (newSelected.has(contactId)) {
            newSelected.delete(contactId);
        } else {
            newSelected.add(contactId);
        }
        setSelectedContacts(newSelected);
    };

    const handleAccountChange = (email: string) => {
        setSenderEmail(email);
        localStorage.setItem(STORAGE_KEY, email);
    };

    const handlePreview = async () => {
        if (!selectedTemplate || selectedContacts.size === 0) return;

        const selectedContactDetails = contacts.filter((contact) =>
            selectedContacts.has(contact.id.toString())
        );

        // Get the selected outreach team member
        const selectedTeamMember = outreachTeamResponse?.data?.data.find(
            (member: OutreachTeamDto) => member.email === senderEmail
        );

        if (!selectedTeamMember) {
            toast.error("Could not find selected team member information");
            return;
        }

        try {
            const renderedEmails = await renderEmailTemplate({
                templateType: selectedTemplate.name as EmailTemplateType,
                recipients: selectedContactDetails,
                templateData: {
                    sender: selectedTeamMember,
                },
                contactInfo: {
                    email: senderEmail,
                    phone: "+1234567890",
                },
            });

            // Ensure we're getting a string from the rendered email
            if (renderedEmails && renderedEmails.length > 0) {
                const htmlContent = await renderedEmails[0];
                setPreviewHtml(htmlContent);
            } else {
                setPreviewHtml("No preview available");
            }
        } catch (error) {
            console.error("Error rendering email preview:", error);
            setPreviewHtml("Error generating preview");
        }
    };

    const handleSendEmail = async () => {
        if (!selectedTemplate || selectedContacts.size === 0) {
            toast.error("Please select a template and at least one recipient");
            return;
        }

        const selectedContactDetails = contacts.filter((contact) =>
            selectedContacts.has(contact.id.toString())
        );

        // Get the selected outreach team member
        const selectedTeamMember = outreachTeamResponse?.data?.data.find(
            (member: OutreachTeamDto) => member.email === senderEmail
        );

        if (!selectedTeamMember) {
            toast.error("Could not find selected team member information");
            return;
        }

        try {
            const renderedEmails = await renderEmailTemplate({
                templateType: selectedTemplate.name as EmailTemplateType,
                recipients: selectedContactDetails,
                templateData: {
                    sender: selectedTeamMember,
                },
                contactInfo: {
                    email: senderEmail,
                    phone: "+1234567890",
                },
            });

            if (!renderedEmails || renderedEmails.length === 0) {
                throw new Error("Failed to generate email content");
            }

            const htmlContent = await renderedEmails[0];

            // Create the email data object
            const emailData = {
                from: senderEmail,
                to: selectedContactDetails.map((contact) => ({
                    email: contact.email,
                    name: `${contact.first_name} ${contact.last_name}`,
                })),
                subject: emailSubject,
                html: htmlContent,
            };

            // Send the email using the outreach API
            await sendEmail(emailData);

            toast.success("Email sent successfully!");

            // Reset form
            setSelectedContacts(new Set());
            setSelectedTemplate(null);
            setEmailSubject("");
            setPreviewHtml("");
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email. Please try again.");
        }
    };

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
                <h1 className="font-bold text-3xl">Send email to Employers</h1>
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
                            disabled={
                                !selectedTemplate || selectedContacts.size === 0
                            }
                        >
                            Preview Email
                        </Button>
                        <Button
                            onClick={handleSendEmail}
                            disabled={
                                !selectedTemplate || selectedContacts.size === 0
                            }
                        >
                            Send Email
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Recipients */}
                <div className="lg:col-span-5">
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Recipients</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="company-filter"
                                        className="text-sm font-semibold"
                                    >
                                        Search Organizations
                                    </Label>
                                    <div className="relative mt-1 mb-4">
                                        <Input
                                            id="company-filter"
                                            value={companyFilter}
                                            onChange={(e) =>
                                                setCompanyFilter(e.target.value)
                                            }
                                            placeholder="Type to filter organizations..."
                                            className="pl-3 pr-10 py-2 w-full border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden shadow-sm bg-card">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-12 py-3"></TableHead>
                                                <TableHead className="py-3 font-semibold">
                                                    Name
                                                </TableHead>
                                                <TableHead className="py-3 font-semibold">
                                                    Organization
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell py-3 font-semibold">
                                                    Email
                                                </TableHead>
                                                <TableHead className="w-20 py-3"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredContacts.map((contact) => (
                                                <TableRow
                                                    key={contact.id}
                                                    className={`
                                                        transition-colors duration-200
                                                        ${contact.been_contacted ? "bg-purple-100 dark:bg-purple-900/20" : "hover:bg-muted/50"}
                                                    `}
                                                >
                                                    <TableCell className="py-3">
                                                        <Checkbox
                                                            checked={selectedContacts.has(
                                                                contact.id.toString()
                                                            )}
                                                            onCheckedChange={() =>
                                                                handleContactToggle(
                                                                    contact.id.toString()
                                                                )
                                                            }
                                                            className="ml-2"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-3 font-medium">
                                                        {`${contact.first_name} ${contact.last_name}`}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        {contact.organization}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell py-3 text-muted-foreground">
                                                        {contact.email}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <Dialog>
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setSelectedContact(
                                                                            contact
                                                                        )
                                                                    }
                                                                >
                                                                    Details
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Contact
                                                                        Details
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div className="gap-2 grid grid-cols-2">
                                                                        <div className="font-semibold">
                                                                            Name:
                                                                        </div>
                                                                        <div>
                                                                            {selectedContact &&
                                                                                `${selectedContact.first_name} ${selectedContact.last_name}`}
                                                                        </div>

                                                                        <div className="font-semibold">
                                                                            Email:
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                selectedContact?.email
                                                                            }
                                                                        </div>

                                                                        <div className="font-semibold">
                                                                            Organization:
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                selectedContact?.organization
                                                                            }
                                                                        </div>

                                                                        {selectedContact?.position && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    Position:
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        selectedContact.position
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {selectedContact?.phone_number && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    Phone:
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        selectedContact.phone_number
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {selectedContact?.linkedin_url && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    LinkedIn:
                                                                                </div>
                                                                                <div>
                                                                                    <a
                                                                                        href={
                                                                                            selectedContact.linkedin_url
                                                                                        }
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-blue-500 hover:underline"
                                                                                    >
                                                                                        View
                                                                                        Profile
                                                                                    </a>
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {selectedContact?.industry && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    Industry:
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        selectedContact.industry
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {selectedContact?.been_contacted && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    Status:
                                                                                </div>
                                                                                <div>
                                                                                    <Badge variant="default">
                                                                                        Contacted
                                                                                    </Badge>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Email Composition */}
                <div className="lg:col-span-7">
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Email Content</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
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
                                            {EMAIL_TEMPLATES.map((template) => (
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

                                {selectedTemplate && (
                                    <div className="space-y-6 pt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Email will be sent using your
                                            outreach team member information.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview Section */}
                    {previewHtml && (
                        <Card className="mt-6">
                            <CardHeader className="border-b">
                                <CardTitle>Email Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: previewHtml,
                                    }}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

ComposePage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
