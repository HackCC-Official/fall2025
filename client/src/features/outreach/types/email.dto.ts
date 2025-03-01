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
    to: Array<{
        email: string;
        name: string;
    }>;
    subject: string;
    html: string;
    templateData?: {
        sender: {
            name: string;
            email: string;
            major: string;
            year: string;
            school: string;
        };
    };
}

/**
 * Data transfer object for sending batch emails
 */
export interface SendBatchEmailsDto {
    emails: Array<{
        from: string;
        to: Array<{
            email: string;
            name: string;
        }>;
        subject: string;
        html: string;
        templateData?: {
            sender: {
                name: string;
                email: string;
                major: string;
                year: string;
                school: string;
            };
        };
    }>;
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
