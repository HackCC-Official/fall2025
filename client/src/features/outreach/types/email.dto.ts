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
    from: string;
    to: EmailRecipient[];
    subject: string;
    html: string;
    attachments?: EmailAttachment[];
}

/**
 * Data transfer object for sending multiple emails in batch
 */
export interface SendBatchEmailsDto {
    emails: SendEmailDto[];
}

/**
 * Data transfer object for updating an existing email
 */
export interface UpdateEmailDto {
    id: string;
    subject?: string;
    html?: string;
}

