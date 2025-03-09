import * as React from "react";
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import { OutreachTeamDto } from "../../features/outreach/types/outreach-team";

/**
 * Props for the follow-up email template
 */
interface FollowUpEmailProps {
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
     * The town/city where the event will be held
     */
    location: string;

    /**
     * Organization's logo URL
     */
    organizationLogo?: string;

    /**
     * Social media links to include in the signature
     */
    socialLinks: {
        /**
         * URLs to various social media profiles
         */
        [key: string]: string;
    };
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

/**
 * FollowUpEmail component for HackCC outreach
 *
 * This template is designed for sending follow-up emails to potential sponsors
 * who were previously contacted about sponsorship opportunities.
 */
export const FollowUpEmail = ({
    companyName,
    recipientName,
    venue,
    sender,
    positionAtHackCC,
    location,
    organizationLogo,
    socialLinks,
}: FollowUpEmailProps) => {
    // Format the sender's year and major for better readability
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    return (
        <Html>
            <Head />
            <Preview>Meet the best students in {location} this May</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Img
                            src={`${baseUrl}/static/hackcc-logo.png`}
                            width={120}
                            height={45}
                            alt="HackCC Logo"
                            style={logo}
                        />
                    </Section>

                    <Section style={content}>
                        {/* Email Subject */}
                        <Heading style={subjectLine}>
                            Re: Meet the best students in {location} this May
                        </Heading>

                        {/* Email Body */}
                        <Text style={paragraph}>Hi {recipientName},</Text>

                        <Text style={paragraph}>
                            I hope this email finds you well. My name is{" "}
                            {sender.name}, and I am a {formattedYearAndMajor}{" "}
                            student at {sender.school}. I am also a sponsorship
                            coordinator with HackCC, a student-led initiative
                            providing California community college students with
                            the opportunity to compete in weekend-long invention
                            marathons. Taking place May 2nd-4th at {venue},
                            we&apos;re expecting 250 hackers this year!
                        </Text>

                        <Text style={paragraph}>
                            I reached out to you on Tuesday about getting{" "}
                            {companyName} on board as a sponsor for one (or
                            more!) of our hackathons. I was wondering if{" "}
                            {companyName} has any interest in sponsoring
                            hackathons at this time?
                        </Text>

                        <Text style={paragraph}>Best regards,</Text>

                        {/* Signature */}
                        <Section style={signatureContainer}>
                            <Row>
                                <Column>
                                    <Text style={signatureName}>
                                        {sender.name}
                                    </Text>
                                    {organizationLogo && (
                                        <Img
                                            src={organizationLogo}
                                            width={100}
                                            height={30}
                                            alt="Organization Logo"
                                            style={orgLogo}
                                        />
                                    )}
                                    <Text style={signaturePosition}>
                                        {positionAtHackCC}
                                    </Text>
                                </Column>
                            </Row>

                            {/* Social Media Links */}
                            {Object.keys(socialLinks).length > 0 && (
                                <Row style={socialLinksContainer}>
                                    {Object.entries(socialLinks).map(
                                        ([platform, url]) => (
                                            <Column
                                                key={platform}
                                                style={socialLinkColumn}
                                            >
                                                <Link
                                                    href={url}
                                                    style={socialLink}
                                                >
                                                    {platform}
                                                </Link>
                                            </Column>
                                        )
                                    )}
                                </Row>
                            )}
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            HackCC • California Community Colleges • 2025
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default FollowUpEmail;

// Styles
const main = {
    backgroundColor: "#f9fafb",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    padding: "20px 0",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    maxWidth: "600px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const header = {
    backgroundColor: "#1e40af", // Deep blue header
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const logo = {
    margin: "0",
};

const orgLogo = {
    margin: "8px 0",
};

const content = {
    padding: "30px",
};

const subjectLine = {
    fontSize: "24px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#1e40af", // Matching header color
    margin: "0 0 24px",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#374151",
    margin: "16px 0",
};

const signatureContainer = {
    marginTop: "30px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "20px",
};

const signatureName = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px",
};

const signaturePosition = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 8px",
};

const socialLinksContainer = {
    marginTop: "12px",
};

const socialLinkColumn = {
    paddingRight: "12px",
};

const socialLink = {
    fontSize: "14px",
    color: "#2563eb",
    textDecoration: "none",
};

const footer = {
    backgroundColor: "#f3f4f6",
    padding: "16px 30px",
    textAlign: "center" as const,
};

const footerText = {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0",
};
