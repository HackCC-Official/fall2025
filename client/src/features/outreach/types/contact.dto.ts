export type ContactStatus =
    | "Cold"
    | "Follow Up 1"
    | "Follow Up 2"
    | "Accept"
    | "Rejected"
    | "Contacted";

export interface ContactDto {
    id: number;
    email_address: string;
    contact_name?: string;
    company?: string;
    country?: string;
    confidence_score?: number;
    position?: string;
    linkedin?: string;
    phone_number?: string;
    website?: string;
    liaison?: string;
    status?: ContactStatus;
    meeting_method?: string;
    created_at?: string;
}

export type UpdateContactDto = Partial<ContactDto>;

export interface RecipientConfirmationDetails {
    name: string;
    email: string;
    organization?: string;
}
