"use client";

import { useState } from "react";
import { toast } from "sonner";
import { render } from "@react-email/render";
import {
    sendBatchEmails,
    sendEmail,
    updateContact,
} from "@/features/outreach/api/outreach";
import {
    renderEmailTemplate,
    type EmailTemplateType,
} from "@/lib/email/email-renderer";
import type { SendBatchEmailsDto } from "@/features/outreach/types/email.dto";
import type { OutreachTeamDto } from "@/features/outreach/types/outreach-team";
import type {
    ContactDto,
    ContactStatus,
} from "@/features/outreach/types/contact.dto";
import { EmailTemplate } from "@/lib/email/types";
import type { RecipientType } from "@/components/compose/ComposeView";
import { EmptyEmail } from "@/emails/empty-template";
import { InterestedEmail } from "@/emails/interested-template";
import { ColdEmail } from "@/emails/employers/cold-template";
import { createEmailBatches } from "@/utils/email-batcher.util";

interface UseEmailSenderProps {
    recipientType: RecipientType;
    selectedRecipients: Set<string>;
    recipientLists: Record<RecipientType, Recipient[]>;
    contacts: ContactDto[];
    emailSubject: string;
    emailContent: string;
    senderEmail: string;
    selectedTeamMember?: OutreachTeamDto;
    selectedTemplate?: EmailTemplate;
    onSuccess: () => void;
}

interface Recipient {
    id: string;
    to: { name: string; email: string }[];
    company?: string;
    status?: ContactStatus;
}

export function useEmailSender({
    recipientType,
    selectedRecipients,
    recipientLists,
    contacts,
    emailSubject,
    emailContent,
    senderEmail,
    selectedTeamMember,
    selectedTemplate,
    onSuccess,
}: UseEmailSenderProps) {
    const [isSending, setIsSending] = useState(false);

    const extractVariable = (content: string, variableName: string): string => {
        const regex = new RegExp(`\\[${variableName}\\]\\s*(?:\\n|$)`, "i");
        const match = content.match(regex);
        if (match) {
            return match[0].replace(/[\[\]]/g, "").trim();
        }
        return "";
    };

    /**
     * Attempts to send an API request with timeout handling
     * @param requestFn - The API request function to call
     * @param data - The data to pass to the request function
     * @param timeoutMs - Timeout in milliseconds
     */
    const sendWithTimeout = async <T, D>(
        requestFn: (data: D) => Promise<T>,
        data: D,
        timeoutMs = 30000
    ): Promise<T> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await Promise.race([
                requestFn(data),
                new Promise<never>((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Request timeout")),
                        timeoutMs
                    )
                ),
            ]);
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };

    const handleSendEmails = async () => {
        if (!selectedTeamMember) {
            toast.error("Could not find selected team member information");
            return;
        }

        // Check if we're already sending emails
        if (isSending) {
            toast.error(
                "Already sending emails. Please wait for the current batch to complete."
            );
            return;
        }

        setIsSending(true);
        let toastId: string | number = "";

        try {
            const allRecipients = recipientLists[recipientType];

            // Debug log for recipient counts across all types
            console.log("Recipient list sizes:", {
                employers: recipientLists.employers?.length || 0,
                registered: recipientLists.registered?.length || 0,
                interested: recipientLists.interested?.length || 0,
                currentType: recipientType,
                selectedCount: selectedRecipients.size,
            });

            const selectedRecipientsData = allRecipients.filter(
                (recipient: Recipient) => selectedRecipients.has(recipient.id)
            );

            // Debug logs
            console.log("Selected recipients set:", [...selectedRecipients]);
            console.log("All recipients count:", allRecipients.length);
            console.log(
                "Filtered recipients count:",
                selectedRecipientsData.length
            );
            console.log(
                "First few recipient IDs in list:",
                allRecipients.slice(0, 3).map((r) => r.id)
            );

            if (
                selectedRecipientsData.length === 0 &&
                selectedRecipients.size > 0
            ) {
                console.error(
                    "Recipients mismatch: Set has items but filter returned none"
                );

                const stringIdRecipientsData = allRecipients.filter(
                    (recipient: Recipient) =>
                        selectedRecipients.has(String(recipient.id))
                );

                if (stringIdRecipientsData.length > 0) {
                    console.log(
                        "Found recipients using string IDs, continuing with those"
                    );
                    selectedRecipientsData.push(...stringIdRecipientsData);
                } else {
                    toast.error(
                        "Failed to match selected recipients to your contact list"
                    );
                    setIsSending(false);
                    return;
                }
            }

            // Validate recipient count
            if (selectedRecipientsData.length === 0) {
                toast.error("No recipients selected");
                setIsSending(false);
                return;
            }

            // Create a notification that stays open during the entire sending process
            toastId = toast.loading(
                `Preparing to send ${selectedRecipientsData.length} emails. Please wait...`,
                { duration: 60000 } // Set a max duration of 1 minute instead of Infinity
            );

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
                } else if (selectedTemplate?.name === "Cold Outreach Email") {
                    renderedEmails = await Promise.all(
                        selectedRecipientsData.map(async (recipient) => {
                            return render(
                                <ColdEmail
                                    recipientName={recipient.to[0]?.name || ""}
                                    companyName={
                                        recipient.company || "[company_name]"
                                    }
                                    venue="HackCC Campus"
                                    sender={selectedTeamMember}
                                    subject={emailSubject}
                                    positionAtHackCC="Sponsorship Coordinator"
                                    socialLinks={{
                                        linkedin:
                                            "https://linkedin.com/company/hackcc",
                                    }}
                                    customEmailBody={emailContent}
                                />
                            );
                        })
                    );
                } else {
                    renderedEmails = await renderEmailTemplate({
                        templateType: (selectedTemplate?.name ||
                            "Empty") as EmailTemplateType,
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

            toast.loading(
                `Sending emails to ${selectedRecipientsData.length} recipients...`,
                { id: toastId, duration: 60000 }
            );

            // Use createEmailBatches utility to create optimally sized batches
            const batches = createEmailBatches(allEmails, { verbose: true });

            // Special case for single email
            if (allEmails.length === 1) {
                console.log("Using single email API with email:", allEmails[0]);
                await sendWithTimeout(sendEmail, allEmails[0], 30000);
                toast.success("Email sent successfully!", {
                    id: toastId,
                    duration: 5000,
                });
            } else {
                let successCount = 0;
                let failureCount = 0;

                for (let i = 0; i < batches.length; i++) {
                    const batch = batches[i];
                    toast.loading(
                        `Sending batch ${i + 1} of ${batches.length} (${batch.length} emails)...`,
                        { id: toastId, duration: 60000 }
                    );

                    try {
                        await sendWithTimeout(
                            sendBatchEmails,
                            { emails: batch } as SendBatchEmailsDto,
                            45000 // 45 second timeout
                        );

                        successCount += batch.length;
                        toast.success(
                            `Batch ${i + 1} of ${batches.length} sent successfully`,
                            { duration: 3000 }
                        );

                        // Add delay between batches
                        if (i < batches.length - 1) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 5000)
                            );
                        }
                    } catch (error) {
                        failureCount += batch.length;
                        console.error(`Error sending batch ${i + 1}:`, error);
                        toast.error(
                            `Failed to send batch ${i + 1}. Continuing with remaining batches.`
                        );

                        // Longer delay after error
                        await new Promise((resolve) =>
                            setTimeout(resolve, 10000)
                        );
                    }
                }

                if (failureCount === 0) {
                    toast.success(
                        `All ${successCount} emails sent successfully!`,
                        {
                            id: toastId,
                            duration: 5000,
                        }
                    );
                } else {
                    toast.error(
                        `Completed with errors: ${failureCount} of ${successCount + failureCount} emails failed`,
                        { id: toastId, duration: 5000 }
                    );
                }
            }

            if (recipientType === "employers") {
                try {
                    toast.loading("Updating contact statuses...", {
                        id: toastId,
                        duration: 30000,
                    });

                    const updateBatchSize = 20;
                    for (
                        let i = 0;
                        i < selectedRecipientsData.length;
                        i += updateBatchSize
                    ) {
                        const updateBatch = selectedRecipientsData.slice(
                            i,
                            i + updateBatchSize
                        );

                        await Promise.all(
                            updateBatch.map(async (recipient) => {
                                try {
                                    const templateName =
                                        selectedTemplate?.name || "";
                                    let newStatus: ContactStatus = "Contacted";

                                    // Determine status based on template type
                                    if (
                                        templateName
                                            .toLowerCase()
                                            .includes("cold")
                                    ) {
                                        newStatus = "Cold";
                                    } else if (
                                        templateName
                                            .toLowerCase()
                                            .includes("followup")
                                    ) {
                                        newStatus = "Follow Up 1";
                                    } else if (
                                        templateName
                                            .toLowerCase()
                                            .includes("follow up 1")
                                    ) {
                                        newStatus = "Follow Up 2";
                                    }

                                    await updateContact(recipient.id, {
                                        status: newStatus,
                                    });
                                } catch (error) {
                                    console.error(
                                        `Failed to update contact ${recipient.id}:`,
                                        error
                                    );
                                }
                            })
                        );

                        // Small delay between update batches
                        if (
                            i + updateBatchSize <
                            selectedRecipientsData.length
                        ) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 2000)
                            );
                        }
                    }

                    toast.success("Contact statuses updated successfully", {
                        duration: 3000,
                    });
                } catch (error) {
                    console.error(
                        "Error updating employer contact status:",
                        error
                    );
                    toast.error("Failed to update some contact statuses");
                }
            }

            onSuccess();
        } catch (error) {
            console.error("Error in email sending process:", error);
            if (toastId) {
                toast.error(
                    `Failed to send emails: ${error instanceof Error ? error.message : "Unknown error"}`,
                    { id: toastId, duration: 5000 }
                );
            } else {
                toast.error("Failed to send emails. Please try again.");
            }
        } finally {
            setIsSending(false);
        }
    };

    return {
        handleSendEmails,
        isSending,
    };
}

export default useEmailSender;
