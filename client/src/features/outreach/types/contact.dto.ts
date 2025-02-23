/**
 * Base interface for contact information
 */
export interface ContactDto {
    email: string;
    name?: string;
    domain_name: string;
    organization: string;
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
    street?: string;
    confidence_score?: number;
    type?: string;
    number_of_sources?: number;
    pattern?: string;
    first_name: string;
    last_name: string;
    department?: string;
    position: string;
    twitter_handle?: string;
    linkedin_url?: string;
    phone_number?: string;
    company_type?: string;
    industry?: string;
}

/**
 * DTO for updating contact information
 * Makes all fields optional
 */
export type UpdateContactDto = Partial<ContactDto>;
