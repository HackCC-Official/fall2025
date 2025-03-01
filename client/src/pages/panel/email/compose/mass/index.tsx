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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CircleUser, ChevronRight, MinusCircle } from "lucide-react";
import Link from "next/link";
import { useOutreachTeam } from "@/hooks/use-outreach-team";
import type { OutreachTeamDto } from "@/features/outreach/types/outreach-team";
import { sendBatchEmails } from "@/features/outreach/api/outreach";
import type { SendBatchEmailsDto } from "@/features/outreach/types/email.dto";
import { Mail } from "@/types/mail";
import AccountSwitcher from "../../components/account-switcher";
import PanelLayout from "../../../layout";
import { useInterestedUsers } from "@/hooks/use-interested.user";
import type { EmailTemplate } from "@/lib/email/types";
import {
    renderEmailTemplate,
    type EmailTemplateType,
} from "@/lib/email/email-renderer";

const STORAGE_KEY = "selectedOutreachAccount";

type RecipientType = "registered" | "interested";

const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: "1",
        name: "FollowUpEmail",
        subject: "Follow Up from HackCC",
        content: "Hi [Name],\n\nThank you for your interest in HackCC...",
    },
];

interface MassEmailComposeProps {
    mails?: Mail[];
}

export default function MassEmailCompose({
    mails = [],
}: MassEmailComposeProps) {
    const [selectedHackers, setSelectedHackers] = React.useState<Set<string>>(
        new Set()
    );
    const [searchQuery, setSearchQuery] = React.useState("");
    const [emailSubject, setEmailSubject] = React.useState("");
    const [emailContent, setEmailContent] = React.useState("");
    const [recipientType, setRecipientType] =
        React.useState<RecipientType>("registered");
    const [selectedTemplate, setSelectedTemplate] =
        React.useState<EmailTemplate | null>(null);
    const [previewHtml] = React.useState<string>("");
    const [senderEmail, setSenderEmail] = React.useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(STORAGE_KEY) || "";
        }
        return "";
    });

    // Fetch outreach team data
    const { data: outreachTeamResponse } = useOutreachTeam();
    // Fetch interested users data
    const { data: interestedUsers, isLoading } = useInterestedUsers();

    // Transform outreach team data into account format
    const emailAccounts = React.useMemo(() => {
        const outreachTeamArray = outreachTeamResponse?.data?.data || [];
        return outreachTeamArray.map((member: OutreachTeamDto) => ({
            label: member.name,
            email: member.email,
            icon: <CircleUser className="h-4 w-4" />,
        }));
    }, [outreachTeamResponse]);

    // Prepare recipient lists
    const recipientLists = React.useMemo(() => {
        const registeredHackers = mails.map((hacker) => ({
            ...hacker,
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
            registered: registeredHackers,
            interested: interestedHackers,
        };
    }, [mails, interestedUsers]);

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
                    .includes(searchQuery.toLowerCase())
        );
    }, [recipientLists, recipientType, searchQuery]);

    const handleTemplateChange = (templateId: string) => {
        const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplate(template);
            setEmailSubject(template.subject);
        }
    };

    // Calculate selection states
    const areAllFilteredSelected = React.useMemo(() => {
        return (
            filteredRecipients.length > 0 &&
            filteredRecipients.every((recipient) =>
                selectedHackers.has(recipient.id)
            )
        );
    }, [filteredRecipients, selectedHackers]);

    const areSomeFilteredSelected = React.useMemo(() => {
        return (
            filteredRecipients.some((recipient) =>
                selectedHackers.has(recipient.id)
            ) && !areAllFilteredSelected
        );
    }, [filteredRecipients, selectedHackers, areAllFilteredSelected]);

    const handleSelectAll = React.useCallback(
        (checked: boolean) => {
            if (checked) {
                const newSelected = new Set(selectedHackers);
                filteredRecipients.forEach((recipient) => {
                    newSelected.add(recipient.id);
                });
                setSelectedHackers(newSelected);
            } else {
                const newSelected = new Set(selectedHackers);
                filteredRecipients.forEach((recipient) => {
                    newSelected.delete(recipient.id);
                });
                setSelectedHackers(newSelected);
            }
        },
        [filteredRecipients, selectedHackers]
    );

    const handleRecipientToggle = (recipientId: string) => {
        const newSelected = new Set(selectedHackers);
        if (newSelected.has(recipientId)) {
            newSelected.delete(recipientId);
        } else {
            newSelected.add(recipientId);
        }
        setSelectedHackers(newSelected);
    };

    const handleAccountChange = (email: string) => {
        setSenderEmail(email);
        localStorage.setItem(STORAGE_KEY, email);
    };

    const handlePreview = async () => {
        if (!selectedTemplate || selectedHackers.size === 0) {
            toast.error("Please select a template and at least one recipient");
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
            const allRecipients = [
                ...recipientLists.registered,
                ...recipientLists.interested,
            ];
            const selectedRecipients = allRecipients.filter((recipient) =>
                selectedHackers.has(recipient.id)
            );

            const renderedEmails = await renderEmailTemplate({
                templateType: "Empty" as EmailTemplateType,
                recipients: selectedRecipients.map((recipient, index) => ({
                    id: index + 1,
                    first_name: recipient.to?.[0]?.name?.split(" ")[0] || "",
                    last_name: recipient.to?.[0]?.name?.split(" ")[1] || "",
                    email: recipient.to?.[0]?.email || "",
                    organization: "",
                    domain_name: recipient.to?.[0]?.email?.split("@")[1] || "",
                    position: "",
                    industry: "",
                    phone_number: "",
                    linkedin_url: "",
                    been_contacted: false,
                })),
                templateData: {
                    sender: selectedTeamMember,
                    emailContent: emailContent,
                },
                contactInfo: {
                    email: senderEmail,
                    phone: "+1234567890",
                },
            });

            if (!renderedEmails || renderedEmails.length === 0) {
                throw new Error("Failed to generate email content");
            }

            // Create the email data object
            const emailData: SendBatchEmailsDto = {
                emails: selectedRecipients.map((recipient, index) => ({
                    from: senderEmail,
                    to:
                        recipient.to?.map((to) => ({
                            email: to.email,
                            name: to.name || to.email.split("@")[0],
                        })) || [],
                    subject: emailSubject,
                    html: renderedEmails[index],
                    templateData: {
                        sender: {
                            name: selectedTeamMember.name,
                            email: selectedTeamMember.email,
                            major: selectedTeamMember.major,
                            year: selectedTeamMember.year,
                            school: selectedTeamMember.school,
                        },
                    },
                })),
            };

            // Log the email payload
            console.log("Email payload:", emailData);

            // Send the email using the outreach API
            await sendBatchEmails(emailData);

            toast.success("Emails sent successfully!");

            // Reset form
            setSelectedHackers(new Set());
            setEmailSubject("");
            setEmailContent("");
        } catch (error) {
            console.error("Error sending emails:", error);
            toast.error("Failed to send emails. Please try again.");
        }
    };

    if (isLoading) {
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
                <span className="font-medium">Mass Email</span>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="font-bold text-3xl">Send Email to Recipients</h1>
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
                                !selectedTemplate || selectedHackers.size === 0
                            }
                        >
                            Preview Email
                        </Button>
                        <Button
                            onClick={handlePreview}
                            disabled={
                                !selectedTemplate || selectedHackers.size === 0
                            }
                        >
                            Send Emails ({selectedHackers.size})
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
                                        setSelectedHackers(new Set());
                                    }}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select recipient type" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                            placeholder="Search by name or email..."
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
                                                    >
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedHackers.has(
                                                                    recipient.id
                                                                )}
                                                                onCheckedChange={() =>
                                                                    handleRecipientToggle(
                                                                        recipient.id
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                recipient
                                                                    .to?.[0]
                                                                    ?.name
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                recipient
                                                                    .to?.[0]
                                                                    ?.email
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {recipient.labels.map(
                                                                (label) => (
                                                                    <Badge
                                                                        key={
                                                                            label
                                                                        }
                                                                        variant="secondary"
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

MassEmailCompose.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
