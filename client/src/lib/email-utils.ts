import { OutreachTeamDto } from "../features/outreach/types/outreach-team";
import { SponsorshipEmail } from "../emails/sponsorship-template";
import { render } from "@react-email/render";

/**
 * Interface for the sponsorship email data
 */
export interface SponsorshipEmailData {
    /**
     * The name of the company being contacted
     */
    companyName: string;

    /**
     * The name of the person being contacted at the company
     */
    recipientName: string;

    /**
     * The venue where the hackathon will take place
     */
    venue: string;

    /**
     * Information about the outreach team member sending the email
     */
    sender: OutreachTeamDto;

    /**
     * The position of the sender at HackCC
     */
    positionAtHackCC: string;

    /**
     * Social media links to include in the signature
     */
    socialLinks: {
        /**
         * URL to the LinkedIn profile
         */
        linkedin?: string;

        /**
         * URL to the Twitter/X profile
         */
        twitter?: string;

        /**
         * URL to the GitHub profile
         */
        github?: string;
    };
}

/**
 * Generates the HTML content for a sponsorship email
 *
 * @param data - The data to use for the email template
 * @returns The rendered HTML as a string
 */
export async function generateSponsorshipEmailHtml(
    data: SponsorshipEmailData
): Promise<string> {
    // Validate the required data
    if (
        !data.companyName ||
        !data.recipientName ||
        !data.venue ||
        !data.sender ||
        !data.positionAtHackCC
    ) {
        throw new Error("Missing required sponsorship email data");
    }

    // Validate sender data
    if (
        !data.sender.name ||
        !data.sender.email ||
        !data.sender.major ||
        !data.sender.year ||
        !data.sender.school
    ) {
        throw new Error("Incomplete sender information for sponsorship email");
    }

    // Render the email component to HTML
    const emailHtml = await render(SponsorshipEmail(data));

    return emailHtml;
}

/**
 * Generates the plain text content for a sponsorship email
 *
 * @param data - The data to use for the email template
 * @returns The email content as plain text
 */
export function generateSponsorshipEmailText(
    data: SponsorshipEmailData
): string {
    // Create a basic plain text version of the email
    return `
Subject: ${data.companyName} and HackCC Sponsorship

Hello ${data.recipientName},

I hope this email finds you well. My name is ${data.sender.name}, and I am a ${data.sender.year} ${data.sender.major} student at ${data.sender.school}. I am also a sponsorship coordinator with HackCC, a student-led initiative providing California community college students with the opportunity to compete in weekend-long invention marathons. Taking place May 2nd-4th at ${data.venue}, we're expecting 250 hackers this year!

I am reaching out to inquire about getting ${data.companyName} on board as a sponsor for one (or more!) of our hackathons. I was wondering if ${data.companyName} has any interest in sponsoring hackathons at this time?

Best regards,

${data.sender.name}
${data.positionAtHackCC}
${data.sender.school}
`.trim();
}
