export interface SponsorInquiryDto {
    fullName: string;
    company: string;
    email: string;
    inquiry: string;
}

export interface SponsorInquiryResponseDto {
    success: boolean;
    message: string;
    timestamp: string;
    reference: string;
}
