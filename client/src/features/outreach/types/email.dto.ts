/**
 * Represents an email attachment with file path and name
 */
export interface EmailAttachment {
    path: string;
    filename: string;
}

/**
 * Represents an email recipient with email and optional name
 */
export interface EmailRecipient {
    email: string;
    name?: string;
}

/**
 * Data transfer object for sending a single email
 */
export interface SendEmailDto {
    id?: string; // Unique identifier
    from: string;
    to: Array<string | EmailRecipient>; // Can be either string emails or recipient objects
    subject: string;
    html: string;
    createdAt?: string; // Creation timestamp
    updatedAt?: string; // Update timestamp
    status?: "delivered" | "sent" | "failed"; // Email delivery status
}

/**
 * Data transfer object for a recipient in an email
 */
export interface EmailRecipientDto {
    email: string;
    name?: string;
}

/**
 * Data transfer object for a single email in a batch
 */
export interface BatchEmailDto {
    from: string;
    to: EmailRecipientDto[];
    subject: string;
    html: string;
}

/**
 * Data transfer object for sending multiple emails in a batch
 */
export interface SendBatchEmailsDto {
    emails: BatchEmailDto[];
}

/**
 * Data transfer object for updating an email
 */
export interface UpdateEmailDto {
    id: string;
    subject?: string;
    content?: string;
    status?: "sent" | "delivered" | "failed";
    replyStatus?: "pending" | "replied" | "no-reply";
}
