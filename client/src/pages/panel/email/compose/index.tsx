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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Contact, EmailTemplate } from "@/lib/email/types";
import {
    renderEmailTemplate,
    type EmailTemplateType,
} from "@/lib/email/email-renderer";
import PanelLayout from "../../layout";

const MOCK_CONTACTS: Contact[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        company: "Acme Inc",
        phone: "+1234567890",
        linkedIn: "https://linkedin.com/in/johndoe",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Add more mock contacts as needed
];

const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: "1",
        name: "Sponsorship Confirmation",
        subject: "Thank you for sponsoring [Event Name]",
        content: "Dear [Name],\n\nThank you for your sponsorship...",
    },
    {
        id: "2",
        name: "Follow-up Request",
        subject: "Following up on our conversation",
        content: "Hi [Name],\n\nI wanted to follow up on...",
    },
    {
        id: "3",
        name: "Invoice Email",
        subject: "Invoice for [Service]",
        content: "Dear [Name],\n\nPlease find attached the invoice for...",
    },
];

interface TemplateData {
    // Sponsorship Confirmation
    eventName: string;
    sponsorshipTier: string;
    eventDate: string;
    nextSteps: string[];
    organizerName: string;
    organizerTitle: string;
    // Follow-up Request
    meetingDate: string;
    discussionPoints: string[];
    // Invoice Email
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    serviceDescription: string;
    paymentLink: string;
}

export default function ComposePage() {
    const [selectedContacts, setSelectedContacts] = React.useState<Set<string>>(
        new Set()
    );
    const [companyFilter, setCompanyFilter] = React.useState("");
    const [selectedTemplate, setSelectedTemplate] =
        React.useState<EmailTemplate | null>(null);
    const [emailContent, setEmailContent] = React.useState("");
    const [emailSubject, setEmailSubject] = React.useState("");
    const [previewHtml, setPreviewHtml] = React.useState<string>("");
    const [templateData, setTemplateData] = React.useState<
        Partial<TemplateData>
    >({
        eventName: "",
        sponsorshipTier: "",
        eventDate: "",
        meetingDate: "",
        discussionPoints: [],
        nextSteps: [],
        invoiceNumber: "",
        amount: "",
        dueDate: "",
        serviceDescription: "",
        paymentLink: "",
        organizerName: "",
        organizerTitle: "",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedContact, setSelectedContact] =
        React.useState<Contact | null>(null);

    const filteredContacts = React.useMemo(() => {
        return MOCK_CONTACTS.filter((contact) =>
            contact.company.toLowerCase().includes(companyFilter.toLowerCase())
        );
    }, [companyFilter]);

    const handleTemplateChange = (templateId: string) => {
        const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplate(template);
            setEmailSubject(template.subject);
            setEmailContent(template.content);
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

    const handleTemplateDataChange = (
        field: keyof TemplateData,
        value: string | string[]
    ) => {
        setTemplateData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isTemplateDataValid = React.useMemo(() => {
        if (!selectedTemplate) return false;

        switch (selectedTemplate.name as EmailTemplateType) {
            case "Sponsorship Confirmation":
                return !!(
                    templateData.eventName &&
                    templateData.sponsorshipTier &&
                    templateData.eventDate &&
                    templateData.nextSteps?.length &&
                    templateData.organizerName &&
                    templateData.organizerTitle
                );

            case "Follow-up Request":
                return !!(
                    templateData.meetingDate &&
                    templateData.discussionPoints?.length &&
                    templateData.nextSteps?.length &&
                    templateData.organizerName &&
                    templateData.organizerTitle
                );

            case "Invoice Email":
                return !!(
                    templateData.invoiceNumber &&
                    templateData.amount &&
                    templateData.dueDate &&
                    templateData.serviceDescription &&
                    templateData.paymentLink &&
                    templateData.organizerName &&
                    templateData.organizerTitle
                );

            default:
                return false;
        }
    }, [selectedTemplate, templateData]);

    const handlePreview = async () => {
        if (
            !selectedTemplate ||
            selectedContacts.size === 0 ||
            !isTemplateDataValid
        )
            return;

        const selectedContactDetails = MOCK_CONTACTS.filter((contact) =>
            selectedContacts.has(contact.id)
        );

        try {
            const renderedEmails = await renderEmailTemplate({
                templateType: selectedTemplate.name as EmailTemplateType,
                recipients: selectedContactDetails,
                templateData: {
                    ...templateData,
                    organizerName: templateData.organizerName,
                    organizerTitle: templateData.organizerTitle,
                },
                contactInfo: {
                    email: "your.email@example.com",
                    phone: "+1234567890",
                },
            });

            // Show preview for the first recipient
            setPreviewHtml(renderedEmails[0]);
        } catch (error) {
            console.error("Error rendering email preview:", error);
            setPreviewHtml(""); // Clear preview on error
        }
    };

    const handleSendEmail = () => {
        // TODO: Implement email sending functionality
        const selectedContactDetails = MOCK_CONTACTS.filter((contact) =>
            selectedContacts.has(contact.id)
        );
        console.log({
            recipients: selectedContactDetails,
            subject: emailSubject,
            content: emailContent,
            template: selectedTemplate,
            templateData,
        });
    };

    const renderTemplateFields = () => {
        if (!selectedTemplate) return null;

        switch (selectedTemplate.name as EmailTemplateType) {
            case "Sponsorship Confirmation":
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="eventName">Event Name</Label>
                            <Input
                                id="eventName"
                                value={templateData.eventName || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "eventName",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="sponsorshipTier">
                                Sponsorship Tier
                            </Label>
                            <Input
                                id="sponsorshipTier"
                                value={templateData.sponsorshipTier || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "sponsorshipTier",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="eventDate">Event Date</Label>
                            <Input
                                id="eventDate"
                                type="date"
                                value={templateData.eventDate || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "eventDate",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="nextSteps">
                                Next Steps (one per line)
                            </Label>
                            <Textarea
                                id="nextSteps"
                                value={templateData.nextSteps?.join("\n") || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "nextSteps",
                                        e.target.value
                                            .split("\n")
                                            .filter(Boolean)
                                    )
                                }
                                style={{
                                    whiteSpace: "pre-wrap",
                                    minHeight: "120px",
                                }}
                                rows={4}
                                placeholder="Enter next steps, one per line..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="organizerName">
                                Organizer Name
                            </Label>
                            <Input
                                id="organizerName"
                                value={templateData.organizerName || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "organizerName",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="organizerTitle">
                                Organizer Title
                            </Label>
                            <Input
                                id="organizerTitle"
                                value={templateData.organizerTitle || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "organizerTitle",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>
                );

            case "Follow-up Request":
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="meetingDate">Meeting Date</Label>
                            <Input
                                id="meetingDate"
                                type="date"
                                value={templateData.meetingDate || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "meetingDate",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="discussionPoints">
                                Discussion Points
                            </Label>
                            <Textarea
                                id="discussionPoints"
                                value={
                                    (templateData.discussionPoints || []).join(
                                        "\n"
                                    ) || ""
                                }
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "discussionPoints",
                                        e.target.value.split("\n")
                                    )
                                }
                                style={{
                                    whiteSpace: "pre-wrap",
                                    minHeight: "120px",
                                }}
                                rows={4}
                                placeholder="Enter discussion points (one per line)..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="nextSteps">Next Steps</Label>
                            <Textarea
                                id="nextSteps"
                                value={
                                    (templateData.nextSteps || []).join("\n") ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "nextSteps",
                                        e.target.value.split("\n")
                                    )
                                }
                                style={{
                                    whiteSpace: "pre-wrap",
                                    minHeight: "120px",
                                }}
                                rows={4}
                                placeholder="Enter next steps, one per line..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="organizerName">
                                Organizer Name
                            </Label>
                            <Input
                                id="organizerName"
                                value={templateData.organizerName || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "organizerName",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter organizer name..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="organizerTitle">
                                Organizer Title
                            </Label>
                            <Input
                                id="organizerTitle"
                                value={templateData.organizerTitle || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "organizerTitle",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter organizer title..."
                            />
                        </div>
                    </div>
                );

            case "Invoice Email":
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="invoiceNumber">
                                Invoice Number
                            </Label>
                            <Input
                                id="invoiceNumber"
                                value={templateData.invoiceNumber || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "invoiceNumber",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter invoice number..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                value={templateData.amount || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "amount",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter amount..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={templateData.dueDate || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "dueDate",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="serviceDescription">
                                Service Description
                            </Label>
                            <Textarea
                                id="serviceDescription"
                                value={templateData.serviceDescription || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "serviceDescription",
                                        e.target.value
                                    )
                                }
                                style={{
                                    whiteSpace: "pre-wrap",
                                    minHeight: "120px",
                                }}
                                rows={4}
                                placeholder="Enter service description..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="paymentLink">Payment Link</Label>
                            <Input
                                id="paymentLink"
                                value={templateData.paymentLink || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "paymentLink",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter payment link..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="organizerName">
                                Organizer Name
                            </Label>
                            <Input
                                id="organizerName"
                                value={templateData.organizerName || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "organizerName",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter organizer name..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="organizerTitle">
                                Organizer Title
                            </Label>
                            <Input
                                id="organizerTitle"
                                value={templateData.organizerTitle || ""}
                                onChange={(e) =>
                                    handleTemplateDataChange(
                                        "organizerTitle",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter organizer title..."
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="mx-auto py-10">
            <h1 className="mb-8 font-bold text-4xl">Compose Email</h1>

            <Tabs defaultValue="compose" className="space-y-6">
                <TabsList className="grid grid-cols-2 w-full max-w-[400px]">
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger
                        value="preview"
                        onClick={handlePreview}
                        disabled={
                            !selectedTemplate ||
                            selectedContacts.size === 0 ||
                            !isTemplateDataValid
                        }
                    >
                        Preview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="compose">
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Recipients</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="company-filter">
                                            Filter by Company
                                        </Label>
                                        <Input
                                            id="company-filter"
                                            value={companyFilter}
                                            onChange={(e) =>
                                                setCompanyFilter(e.target.value)
                                            }
                                            placeholder="Enter company name..."
                                        />
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    Select
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Company</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredContacts.map((contact) => (
                                                <TableRow key={contact.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedContacts.has(
                                                                contact.id
                                                            )}
                                                            onCheckedChange={() =>
                                                                handleContactToggle(
                                                                    contact.id
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {contact.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {contact.company}
                                                    </TableCell>
                                                    <TableCell>
                                                        {contact.email}
                                                    </TableCell>
                                                    <TableCell>
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
                                                                    More Info
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
                                                                            {
                                                                                contact.name
                                                                            }
                                                                        </div>

                                                                        <div className="font-semibold">
                                                                            Email:
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                contact.email
                                                                            }
                                                                        </div>

                                                                        <div className="font-semibold">
                                                                            Company:
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                contact.company
                                                                            }
                                                                        </div>

                                                                        {contact.role && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    Role:
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        contact.role
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {contact.phone && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    Phone:
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        contact.phone
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {contact.linkedIn && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    LinkedIn:
                                                                                </div>
                                                                                <div>
                                                                                    <a
                                                                                        href={
                                                                                            contact.linkedIn
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

                                                                        {contact.notes && (
                                                                            <>
                                                                                <div className="font-semibold">
                                                                                    Notes:
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        contact.notes
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        <div className="font-semibold">
                                                                            Created:
                                                                        </div>
                                                                        <div>
                                                                            {formatDate(
                                                                                contact.createdAt
                                                                            )}
                                                                        </div>

                                                                        <div className="font-semibold">
                                                                            Last
                                                                            Updated:
                                                                        </div>
                                                                        <div>
                                                                            {formatDate(
                                                                                contact.updatedAt
                                                                            )}
                                                                        </div>
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Compose Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
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
                                                {EMAIL_TEMPLATES.map(
                                                    (template) => (
                                                        <SelectItem
                                                            key={template.id}
                                                            value={template.id}
                                                        >
                                                            {template.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {renderTemplateFields()}

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={handlePreview}
                                            disabled={
                                                !selectedTemplate ||
                                                selectedContacts.size === 0
                                            }
                                        >
                                            Preview
                                        </Button>
                                        <Button
                                            onClick={handleSendEmail}
                                            disabled={
                                                selectedContacts.size === 0
                                            }
                                        >
                                            Send Email
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="preview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {previewHtml ? (
                                <div
                                    className="dark:prose-invert max-w-none prose"
                                    dangerouslySetInnerHTML={{
                                        __html: previewHtml,
                                    }}
                                />
                            ) : (
                                <div className="py-8 text-muted-foreground text-center">
                                    {!selectedTemplate
                                        ? "Select a template to preview the email."
                                        : !selectedContacts.size
                                          ? "Select at least one recipient to preview the email."
                                          : !isTemplateDataValid
                                            ? "Fill in all required fields to preview the email."
                                            : "Click Preview to see the email."}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

ComposePage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
