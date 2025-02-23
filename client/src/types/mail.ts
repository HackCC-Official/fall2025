import type {
    EmailRecipient,
    EmailAttachment,
} from "@/features/outreach/types/email.dto";

export interface Mail {
    id: string;
    from: string;
    to: EmailRecipient[];
    subject: string;
    html: string;
    attachments?: EmailAttachment[];
    date: string;
    read: boolean;
    labels: string[];
}

export interface MailState {
    selected: string | null;
}
