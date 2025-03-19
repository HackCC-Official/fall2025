"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { ChevronRight } from "lucide-react";
import type { EmailTemplate } from "@/lib/email/types";
import type { OutreachTeamDto } from "@/features/outreach/types/outreach-team";
import type { RecipientType } from "@/components/compose/ComposeView";

interface ExtendedEmailTemplate extends EmailTemplate {
    type: "employers" | "hackers";
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
        id: "cold-email",
        name: "Cold Outreach Email",
        subject: "Meet the best students in X town this May",
        content:
            "Hello [recipient_name],\n\nI hope this email finds you well. My name is [sender_name], and I am a [sender_year_and_major] student at [sender_school]. I am also a sponsorship coordinator with HackCC, a student-led initiative providing California community college students with the opportunity to compete in weekend-long invention marathons. Taking place May 2nd-4th at [venue], we're expecting 250 hackers this year!\n\nI am reaching out to inquire about getting [company_name] on board as a sponsor for one (or more!) of our hackathons. I was wondering if [company_name] has any interest in sponsoring hackathons at this time?\n\nBest regards,",
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

interface EmailContentEditorProps {
    recipientType: RecipientType;
    selectedRecipients: Set<string>;
    emailSubject: string;
    setEmailSubject: React.Dispatch<React.SetStateAction<string>>;
    emailContent: string;
    setEmailContent: React.Dispatch<React.SetStateAction<string>>;
    selectedTemplate: ExtendedEmailTemplate | null;
    setSelectedTemplate: React.Dispatch<
        React.SetStateAction<ExtendedEmailTemplate | null>
    >;
    handlePreview: () => void;
    setActiveStep: React.Dispatch<
        React.SetStateAction<"recipients" | "content" | "preview">
    >;
    senderInfo: OutreachTeamDto | undefined;
}

export const EmailContentEditor: React.FC<EmailContentEditorProps> = ({
    recipientType,
    selectedRecipients,
    emailSubject,
    setEmailSubject,
    emailContent,
    setEmailContent,
    selectedTemplate,
    setSelectedTemplate,
    handlePreview,
    setActiveStep,
}) => {
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Email Content</h3>
                {recipientType === "employers" && (
                    <Select onValueChange={handleTemplateChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                            {EMAIL_TEMPLATES.filter(
                                (template) => template.type === "employers"
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

            <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="mt-1"
                />
            </div>

            {recipientType !== "employers" && (
                <div>
                    <Label htmlFor="content">Email Content</Label>
                    <Textarea
                        id="content"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder="Enter email content..."
                        className="mt-1 min-h-[300px]"
                    />
                </div>
            )}

            {recipientType === "employers" && selectedTemplate && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="content">Template Content</Label>
                        <div className="text-xs text-muted-foreground">
                            Available variables: [recipient_name],
                            [company_name], [sender_name],
                            [sender_year_and_major], [sender_school]
                        </div>
                    </div>
                    <Textarea
                        id="content"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder="Enter email content with variables..."
                        className="mt-1 min-h-[300px] font-mono text-sm"
                    />
                </div>
            )}

            <div className="text-sm text-muted-foreground">
                Email will be sent to {selectedRecipients.size}{" "}
                {selectedRecipients.size === 1 ? "recipient" : "recipients"}{" "}
                using your outreach team member information.
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => setActiveStep("recipients")}
                >
                    Back to Recipients
                </Button>
                <Button
                    variant="default"
                    onClick={() => {
                        handlePreview();
                        setActiveStep("preview");
                    }}
                    disabled={
                        !emailSubject ||
                        !emailContent ||
                        selectedRecipients.size === 0
                    }
                >
                    Preview Email
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

export default EmailContentEditor;
