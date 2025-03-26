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
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import { EmailTemplate } from "@/lib/email/types";
import type { RecipientType } from "@/components/compose/ComposeView";
import { EmptyEmail } from "@/emails/empty-template";
import { InterestedEmail } from "@/emails/interested-template";
import { ColdEmail } from "@/emails/employers/cold-template";

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

    const handleSendEmails = async () => {
        if (!selectedTeamMember) {
            toast.error("Could not find selected team member information");
            return;
        }

        setIsSending(true);

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

            // Safety check - if we have no recipients but the set isn't empty
            if (
                selectedRecipientsData.length === 0 &&
                selectedRecipients.size > 0
            ) {
                console.error(
                    "Recipients mismatch: Set has items but filter returned none"
                );

                // Try with string IDs as a fallback
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
                    console.log(
                        "Using single email API with email:",
                        allEmails[0]
                    );
                    await sendEmail(allEmails[0]);
                } else {
                    console.log(
                        "Using batch email API with count:",
                        allEmails.length
                    );
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

            onSuccess();
        } catch (error) {
            console.error("Error sending emails:", error);
            toast.error("Failed to send emails. Please try again.");
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
