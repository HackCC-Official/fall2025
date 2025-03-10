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
 * Props for the sponsorship confirmation email template
 */
interface ConfirmationEmailProps {
    /**
     * The name of the company being contacted
     */
    companyName: string;

    /**
     * The name of the person being contacted at the company
     */
    recipientName: string;

    /**
     * Information about the outreach team member sending the email
     */
    sender: OutreachTeamDto;

    /**
     * The position of the sender at HackCC
     */
    positionAtHackCC: string;

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

    /**
     * Optional custom email body content
     * When provided, will replace the default email body while preserving variable replacements
     */
    customEmailBody?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

/**
 * ConfirmationEmail component for HackCC outreach
 *
 * This template is designed for sending confirmation emails to sponsors
 * who have agreed to sponsor a HackCC event.
 */
export const ConfirmationEmail = ({
    companyName,
    recipientName,
    sender,
    positionAtHackCC,
    organizationLogo,
    socialLinks,
    customEmailBody,
}: ConfirmationEmailProps) => {
    // Format the sender's year and major for better readability
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    // Parse custom email body if provided
    const renderCustomEmailBody = () => {
        if (!customEmailBody) return null;

        // Replace variable placeholders with actual values
        const parsedContent = customEmailBody
            .replace(/\[recipient_name\]/g, recipientName)
            .replace(/\[company_name\]/g, companyName)
            .replace(/\[sender_name\]/g, sender.name)
            .replace(/\[sender_year_and_major\]/g, formattedYearAndMajor)
            .replace(/\[sender_school\]/g, sender.school);

        // Split the content into sections
        const sections = parsedContent.split("\n\n");

        return sections.map((section, index) => {
            // Check if this is a section header (like "Next Steps:")
            if (section.endsWith(":")) {
                return (
                    <Text key={`header-${index}`} style={paragraphBold}>
                        {section}
                    </Text>
                );
            }

            // Check if this section contains bullet points
            if (section.includes("•") || section.includes("-")) {
                // Split by lines to handle each bullet point separately
                const lines = section.split("\n");
                return (
                    <React.Fragment key={`bullets-${index}`}>
                        {lines.map((line, lineIndex) => {
                            // Skip empty lines
                            if (!line.trim()) return null;

                            // If this is a bullet point (starts with • or -), use bullet point styling
                            if (
                                line.trim().startsWith("•") ||
                                line.trim().startsWith("-")
                            ) {
                                return (
                                    <Text
                                        key={`bullet-${index}-${lineIndex}`}
                                        style={paragraphList}
                                    >
                                        {line.trim()}
                                    </Text>
                                );
                            }

                            // Otherwise, treat as regular paragraph
                            return (
                                <Text
                                    key={`line-${index}-${lineIndex}`}
                                    style={paragraph}
                                >
                                    {line.trim()}
                                </Text>
                            );
                        })}
                    </React.Fragment>
                );
            }

            // Regular paragraph
            return (
                <Text key={`para-${index}`} style={paragraph}>
                    {section}
                </Text>
            );
        });
    };

    return (
        <Html>
            <Head />
            <Preview>HackCC x {companyName} Sponsorship Confirmation!</Preview>
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
                            HackCC x {companyName} Sponsorship Confirmation!
                        </Heading>

                        {/* Email Body */}
                        {customEmailBody ? (
                            renderCustomEmailBody()
                        ) : (
                            <>
                                <Text style={paragraph}>
                                    Hi {recipientName},
                                </Text>

                                <Text style={paragraph}>
                                    Thank you for confirming your sponsorship
                                    for HackCC! We're thrilled to have{" "}
                                    {companyName} supporting our hackathon and
                                    can't wait to collaborate with you.
                                </Text>

                                <Text style={paragraphBold}>Next Steps:</Text>
                                <Text style={paragraphList}>
                                    • Sponsorship Agreement & Invoice: [Attach
                                    any necessary documents]
                                </Text>
                                <Text style={paragraphList}>
                                    • Logistics & Branding: Please send over
                                    your logo and any promotional materials
                                    you'd like us to feature.
                                </Text>
                                <Text style={paragraphList}>
                                    • Engagement Opportunities: Let us know if
                                    your team would like to host a workshop,
                                    provide mentors, or have a booth at the
                                    event.
                                </Text>

                                <Text style={paragraph}>
                                    If there's anything else we can do to make
                                    this partnership a success, please don't
                                    hesitate to reach out. Looking forward to
                                    working together!
                                </Text>

                                <Text style={paragraph}>Best,</Text>
                            </>
                        )}

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
                                </Column>
                                <Column>
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

export default ConfirmationEmail;

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

const paragraphBold = {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#1e293b",
    fontWeight: "700",
    margin: "20px 0 8px",
};

const paragraphList = {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#374151",
    margin: "4px 0 4px 16px",
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
    textAlign: "right" as const,
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
