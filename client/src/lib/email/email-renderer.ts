import { render } from "@react-email/render";
import type { Contact } from "./types";
import ConfirmationEmail from "@/emails/confirmation-template";
import FollowUpEmail from "@/emails/followup-template";
import InvoiceEmail from "@/emails/invoice-template";
import * as React from "react";

export type EmailTemplateType =
    | "Sponsorship Confirmation"
    | "Follow-up Request"
    | "Invoice Email";

interface RenderEmailOptions {
    templateType: EmailTemplateType;
    recipients: Contact[];
    templateData: {
        // Sponsorship Confirmation
        eventName?: string;
        eventDate?: string;
        sponsorshipTier?: string;
        nextSteps?: string[];
        organizerName?: string;
        organizerTitle?: string;
        // Follow-up Request
        meetingDate?: string;
        discussionPoints?: string[];
        // Invoice Email
        invoiceNumber?: string;
        amount?: string;
        dueDate?: string;
        serviceDescription?: string;
        paymentLink?: string;
    };
    contactInfo: {
        email: string;
        phone: string;
    };
}

export async function renderEmailTemplate({
    templateType,
    recipients,
    templateData,
    contactInfo,
}: RenderEmailOptions): Promise<string[]> {
    const promises = recipients.map(async (recipient) => {
        switch (templateType) {
            case "Sponsorship Confirmation":
                if (
                    !templateData.eventName ||
                    !templateData.eventDate ||
                    !templateData.sponsorshipTier ||
                    !templateData.nextSteps ||
                    !templateData.organizerName ||
                    !templateData.organizerTitle
                ) {
                    throw new Error(
                        "Missing required template data for sponsorship confirmation"
                    );
                }
                return await render(
                    React.createElement(ConfirmationEmail, {
                        companyName: recipient.company,
                        contactName: recipient.name,
                        eventName: templateData.eventName,
                        eventDate: templateData.eventDate,
                        sponsorshipTier: templateData.sponsorshipTier,
                        nextSteps: templateData.nextSteps,
                        organizerName: templateData.organizerName,
                        organizerTitle: templateData.organizerTitle,
                        contactEmail: contactInfo.email,
                    })
                );

            case "Follow-up Request":
                if (
                    !templateData.meetingDate ||
                    !templateData.discussionPoints ||
                    !templateData.nextSteps ||
                    !templateData.organizerName ||
                    !templateData.organizerTitle
                ) {
                    throw new Error(
                        "Missing required template data for follow-up request"
                    );
                }
                return await render(
                    React.createElement(FollowUpEmail, {
                        recipientName: recipient.name,
                        meetingDate: templateData.meetingDate,
                        discussionPoints: templateData.discussionPoints,
                        nextSteps: templateData.nextSteps,
                        senderName: templateData.organizerName,
                        senderTitle: templateData.organizerTitle,
                        contactEmail: contactInfo.email,
                        contactPhone: contactInfo.phone,
                    })
                );

            case "Invoice Email":
                if (
                    !templateData.invoiceNumber ||
                    !templateData.amount ||
                    !templateData.dueDate ||
                    !templateData.serviceDescription ||
                    !templateData.paymentLink ||
                    !templateData.organizerName ||
                    !templateData.organizerTitle
                ) {
                    throw new Error(
                        "Missing required template data for invoice email"
                    );
                }
                return await render(
                    React.createElement(InvoiceEmail, {
                        recipientName: recipient.name,
                        companyName: recipient.company,
                        invoiceNumber: templateData.invoiceNumber,
                        amount: templateData.amount,
                        dueDate: templateData.dueDate,
                        serviceDescription: templateData.serviceDescription,
                        paymentLink: templateData.paymentLink,
                        organizerName: templateData.organizerName,
                        organizerTitle: templateData.organizerTitle,
                        contactEmail: contactInfo.email,
                        contactPhone: contactInfo.phone,
                    })
                );

            default:
                throw new Error(`Unsupported template type: ${templateType}`);
        }
    });

    return Promise.all(promises);
}
