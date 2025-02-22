/**
 * Types for the email system
 */

export type Contact = {
    id: string;
    name: string;
    email: string;
    company: string;
    role?: string;
    phone?: string;
    linkedIn?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
};

export type EmailTemplate = {
    id: string;
    name: "Sponsorship Confirmation" | "Follow-up Request" | "Invoice Email";
    subject: string;
    content: string;
};

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
