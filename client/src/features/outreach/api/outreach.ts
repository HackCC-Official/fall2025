import { ContactDto, UpdateContactDto } from "../types/contact.dto";
import {
    SendEmailDto,
    SendBatchEmailsDto,
    UpdateEmailDto,
} from "../types/email.dto";
import { outreachClient } from "../../../api/outreach-client";
import axios from "axios";
import { InterestedUserDto } from "../types/interested-users.dto";

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
            url: `/contacts/${contactId}`,
        })
    ).data;
}

/**
 * Creates a new contact
 * @param contactDto - The contact data to create
 */
export async function createContact(
    contactDto: Partial<ContactDto>
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
    console.log("Updating contact:", { id, data: contactDto });
    try {
        // Debug logging
        console.log("Making request to:", `/contacts/${id}`);
        console.log("Request configuration:", {
            method: "PATCH",
            baseURL: outreachClient.defaults.baseURL,
            headers: outreachClient.defaults.headers,
        });

        const response = await outreachClient.request({
            method: "PATCH",
            url: `/contacts/${id}`,
            data: contactDto,
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        });

        console.log("Update response:", response.data);
        // Handle both nested and direct response formats
        return response.data.data || response.data;
    } catch (error) {
        // Type guard for AxiosError
        if (axios.isAxiosError(error)) {
            console.error("Detailed error information:", {
                error: error.message,
                requestConfig: error.config,
                response: error.response?.data,
            });
        } else {
            console.error("Unexpected error:", error);
        }
        throw error;
    }
}

/**
 * Deletes a contact
 * @param id - The unique identifier of the contact to delete
 */
export async function deleteContact(id: string): Promise<void> {
    await outreachClient.request({
        method: "DELETE",
        url: `/contacts/${id}`,
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
            url: "/contacts/upload",
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

/**
 * Creates a new interested user record
 * @param interestedUserDto - The interested user data containing email
 * @throws {Error} If the request fails or user already exists
 */
export async function createInterestedUser(
    interestedUserDto: InterestedUserDto
): Promise<void> {
    await outreachClient.request({
        method: "POST",
        url: "interested-users",
        data: interestedUserDto,
    });
}

/**
 * Retrieves all interested users from the system
 * @returns Array of interested user records containing email addresses
 * @throws {Error} If the request fails
 */
export async function getInterestedUsers(): Promise<InterestedUserDto[]> {
    return (
        await outreachClient.request({
            method: "GET",
            url: "interested-users",
        })
    ).data;
}

/**
 * Deletes an interested user record by ID
 * @param id - The unique identifier of the interested user to delete
 * @throws {Error} If the request fails or user is not found
 */
export async function deleteInterestedUser(id: string): Promise<void> {
    await outreachClient.request({
        method: "DELETE",
        url: `interested-users/${id}`,
    });
}
