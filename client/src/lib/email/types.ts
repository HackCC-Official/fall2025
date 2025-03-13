/**
 * Types for the email system
 */

export interface Contact {
    id: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    linkedIn: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
}

export type Email = {
    id: string;
    templateId: string;
    subject: string;
    content: string;
    recipients: Contact[];
    sentAt: Date;
    status: "sent" | "delivered" | "failed";
    replyStatus: "pending" | "replied" | "no-reply";
};

export type CSVContact = Omit<Contact, "id" | "createdAt" | "updatedAt">;
