/**
 * Utility functions to help with email batching and payload size management
 */

import type {
    SendEmailDto,
    EmailAttachment,
} from "@/features/outreach/types/email.dto";

interface BatchOptions {
    /**
     * Maximum number of emails per batch
     * @default 20
     */
    maxBatchSize?: number;

    /**
     * Estimated maximum size per email in bytes
     * @default 100000 (100KB)
     */
    estimatedMaxEmailSize?: number;

    /**
     * Maximum total payload size in bytes
     * @default 45000000 (45MB)
     */
    maxPayloadSize?: number;

    /**
     * Whether to log batch information to console
     * @default false
     */
    verbose?: boolean;
}

/**
 * Splits a large array of emails into appropriately sized batches
 * This prevents "request entity too large" errors when sending many emails
 *
 * @param emails - Array of email objects to batch
 * @param options - Batching configuration options
 * @returns Array of email batches, each batch is an array of emails
 */
export function createEmailBatches(
    emails: SendEmailDto[],
    options: BatchOptions = {}
): SendEmailDto[][] {
    // Set defaults
    const {
        maxBatchSize = 20,
        estimatedMaxEmailSize = 100000,
        maxPayloadSize = 45 * 1024 * 1024,
        verbose = false,
    } = options;

    if (!emails.length) {
        return [];
    }

    const estimatedTotalSize = emails.reduce((size, email) => {
        const contentSize = (email.html?.length || 0) * 2;
        const subjectSize = (email.subject?.length || 0) * 2;
        const recipientsSize =
            email.to?.reduce((size, recipient) => {
                if (typeof recipient === "string") {
                    return size + recipient.length * 2;
                } else {
                    return (
                        size +
                        ((recipient.name?.length || 0) +
                            recipient.email.length) *
                            2
                    );
                }
            }, 0) || 0;

        return (
            size +
            Math.max(
                contentSize + subjectSize + recipientsSize,
                estimatedMaxEmailSize
            )
        );
    }, 0);

    if (verbose) {
        console.log(
            `Total email batch: ${emails.length} emails, ~${Math.round(estimatedTotalSize / 1024 / 1024)}MB estimated`
        );
    }

    // Determine if we need to batch by size or count
    const batchBySize = estimatedTotalSize > maxPayloadSize;
    const maxEmailsPerBatch = batchBySize
        ? Math.floor(maxPayloadSize / (estimatedTotalSize / emails.length))
        : maxBatchSize;

    // Use the more restrictive limit
    const effectiveBatchSize = Math.min(maxEmailsPerBatch, maxBatchSize);

    if (verbose) {
        console.log(
            `Batching by ${batchBySize ? "size" : "count"}, ${effectiveBatchSize} emails per batch`
        );
    }

    // Create batches
    const batches: SendEmailDto[][] = [];
    for (let i = 0; i < emails.length; i += effectiveBatchSize) {
        batches.push(emails.slice(i, i + effectiveBatchSize));
    }

    if (verbose) {
        console.log(`Created ${batches.length} batches of emails`);
        batches.forEach((batch, i) => {
            console.log(`Batch ${i + 1}: ${batch.length} emails`);
        });
    }

    return batches;
}

/**
 * Estimates the size of an email in bytes
 * Useful for determining if an email will exceed size limits
 *
 * @param email - The email to estimate size for
 * @returns Estimated size in bytes
 */
export function estimateEmailSize(email: SendEmailDto): number {
    let size = 1000;

    size += (email.html?.length || 0) * 2;
    size += (email.subject?.length || 0) * 2;

    size += email.to.reduce((size, recipient) => {
        if (typeof recipient === "string") {
            return size + recipient.length * 2;
        } else {
            return (
                size +
                ((recipient.name?.length || 0) + recipient.email.length) * 2
            );
        }
    }, 0);

    size += (email.from?.length || 0) * 2;

    if (
        "attachments" in email &&
        email.attachments &&
        Array.isArray(email.attachments)
    ) {
        email.attachments.forEach((attachment: EmailAttachment) => {
            size += attachment.filename.length * 2;
            size += 50 * 1024;
        });
    }

    return size;
}
