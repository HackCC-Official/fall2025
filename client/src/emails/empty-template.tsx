import * as React from "react";
import {
    Body,
    Container,
    Column,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import { OutreachTeamDto } from "../features/outreach/types/outreach-team";

/**
 * Props for the empty email template
 */
interface EmptyEmailProps {
    /**
     * The name of the recipient
     */
    recipientName: string;

    /**
     * The custom email content
     */
    emailContent: string;

    /**
     * Information about the outreach team member sending the email
     */
    sender: OutreachTeamDto;

    /**
     * Organization's logo URL
     */
    organizationLogo?: string;

    /**
     * Social media links to include in the signature
     */
    socialLinks?: {
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
 * EmptyEmail component for HackCC outreach
 *
 * This template is designed as a general-purpose email template that can be used
 * for various types of communication with custom content.
 */
export const EmptyEmail = ({
    recipientName,
    emailContent,
    sender,
    organizationLogo,
    socialLinks = {},
}: EmptyEmailProps) => {
    // Format the sender's year and major for better readability
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    return (
        <Html>
            <Head />
            <Preview>Message from HackCC</Preview>
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
                        {/* Email Body */}
                        <Text style={paragraph}>Hi {recipientName},</Text>

                        {/* Render the custom email content */}
                        <div
                            style={paragraph}
                            dangerouslySetInnerHTML={{ __html: emailContent }}
                        />

                        <Text style={paragraph}>Best regards,</Text>

                        {/* Signature */}
                        <Section style={signatureContainer}>
                            <Row>
                                <Column>
                                    <Text style={signatureName}>
                                        {sender.name}
                                    </Text>
                                    <Text style={signatureDetails}>
                                        {formattedYearAndMajor} •{" "}
                                        {sender.school}
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

export default EmptyEmail;

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

const signatureDetails = {
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
