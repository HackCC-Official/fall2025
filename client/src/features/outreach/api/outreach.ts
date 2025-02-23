import { ContactDto, UpdateContactDto } from "../types/contact.dto";
import {
    SendEmailDto,
    SendBatchEmailsDto,
    UpdateEmailDto,
} from "../types/email.dto";
import { outreachClient } from "../../../api/outreach-client";

/**
 * Retrieves all contacts from the outreach service
 */
export async function getContacts(): Promise<ContactDto[]> {
    const response = await outreachClient.get("/contacts");
    return response.data.data; // Extract the nested data array
}

/**
 * Retrieves a specific contact by ID
 * @param contactId - The unique identifier of the contact
 */
export async function getContactById(contactId: string): Promise<ContactDto> {
    return (
        await outreachClient.request({
            method: "GET",
            url: `contacts/${contactId}`,
        })
    ).data;
}

/**
 * Creates a new contact
 * @param contactDto - The contact data to create
 */
export async function createContact(
    contactDto: ContactDto
): Promise<ContactDto> {
    return (
        await outreachClient.request({
            method: "POST",
            url: "contacts",
            data: contactDto,
        })
    ).data;
}

/**
 * Updates an existing contact
 * @param id - The unique identifier of the contact to update
 * @param contactDto - The partial contact data to update
 */
export async function updateContact(
    id: string,
    contactDto: UpdateContactDto
): Promise<ContactDto> {
    return (
        await outreachClient.request({
            method: "PUT",
            url: `contacts/${id}`,
            data: contactDto,
        })
    ).data;
}

/**
 * Deletes a contact
 * @param id - The unique identifier of the contact to delete
 */
export async function deleteContact(id: string): Promise<void> {
    await outreachClient.request({
        method: "DELETE",
        url: `contacts/${id}`,
    });
}

/**
 * Uploads contacts from a CSV file
 * @param file - The CSV file containing contact data
 * @throws Error if the file is not a CSV
 */
export async function uploadContacts(file: File): Promise<ContactDto[]> {
    if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Only CSV files are accepted");
    }

    const formData = new FormData();
    formData.append("file", file);

    return (
        await outreachClient.request({
            method: "POST",
            url: "contacts/upload",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: formData,
        })
    ).data;
}

/**
 * Sends a single email
 * @param emailDto - The email data to send
 */
export async function sendEmail(emailDto: SendEmailDto): Promise<void> {
    await outreachClient.request({
        method: "POST",
        url: "emails/send",
        data: emailDto,
    });
}

/**
 * Sends multiple emails in batch
 * @param batchDto - The batch of emails to send
 */
export async function sendBatchEmails(
    batchDto: SendBatchEmailsDto
): Promise<void> {
    await outreachClient.request({
        method: "POST",
        url: "emails/send-batch",
        data: batchDto,
    });
}

/**
 * Retrieves all sent emails
 */
export async function getEmails(): Promise<SendEmailDto[]> {
    return (
        await outreachClient.request({
            method: "GET",
            url: "emails",
        })
    ).data;
}

/**
 * Retrieves a specific email by ID
 * @param id - The unique identifier of the email
 */
export async function getEmailById(id: string): Promise<SendEmailDto> {
    return (
        await outreachClient.request({
            method: "GET",
            url: `emails/${id}`,
        })
    ).data;
}

/**
 * Updates an existing email
 * @param updateDto - The email update data including the ID
 */
export async function updateEmail(
    updateDto: UpdateEmailDto
): Promise<SendEmailDto> {
    return (
        await outreachClient.request({
            method: "PUT",
            url: "emails/update",
            data: updateDto,
        })
    ).data;
}
