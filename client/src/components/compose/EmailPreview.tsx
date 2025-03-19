"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import type { RecipientType } from "../../../pages/panel/email/compose";

interface EmailPreviewProps {
    recipientType: RecipientType;
    selectedRecipients: Set<string>;
    emailSubject: string;
    previewHtml: string;
    senderEmail: string;
    handleSendEmails: () => void;
    setActiveStep: React.Dispatch<
        React.SetStateAction<"recipients" | "content" | "preview">
    >;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
    recipientType,
    selectedRecipients,
    emailSubject,
    previewHtml,
    senderEmail,
    handleSendEmails,
    setActiveStep,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Email Details</h3>
                    <p className="text-sm text-muted-foreground">
                        Review your email before sending
                    </p>
                </div>
                <Badge
                    variant={
                        selectedRecipients.size > 10 ? "destructive" : "outline"
                    }
                >
                    {selectedRecipients.size}{" "}
                    {selectedRecipients.size === 1 ? "recipient" : "recipients"}
                    {selectedRecipients.size > 10 ? " (Mass Email)" : ""}
                </Badge>
            </div>

            <div className="border rounded-md p-4">
                <div className="mb-4">
                    <span className="text-sm font-medium">Subject:</span>{" "}
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
                <span className="font-medium">{senderEmail}</span>
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => setActiveStep("content")}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Edit
                </Button>
                <Button
                    variant={
                        selectedRecipients.size > 10 ? "destructive" : "default"
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
                                <line x1="12" y1="17" x2="12.01" y2="17" />
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
            </div>
        </div>
    );
};

export default EmailPreview;
