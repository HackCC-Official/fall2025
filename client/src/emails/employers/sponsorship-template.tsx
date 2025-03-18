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

interface SponsorshipEmailProps {
    companyName: string;
    recipientName: string;
    venue: string;
    sender: OutreachTeamDto;
    positionAtHackCC: string;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };

    customEmailBody?: string;
}

export const SponsorshipEmail = ({
    companyName,
    recipientName,
    venue,
    sender,
    // positionAtHackCC,
    socialLinks,
    customEmailBody,
}:  SponsorshipEmailProps) => {
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    const today = new Date();
    const isCurrentDayTuesday = today.getDay() === 2;

    const renderCustomEmailBody = () => {
        if (!customEmailBody) return null;

        const parsedContent = customEmailBody
            .replace(/\[recipient_name\]/g, recipientName)
            .replace(/\[company_name\]/g, companyName)
            .replace(/\[sender_name\]/g, sender.name)
            .replace(/\[sender_year_and_major\]/g, formattedYearAndMajor)
            .replace(/\[sender_school\]/g, sender.school)
            .replace(/\[venue\]/g, venue);

        return parsedContent.split("\n\n").map((paragraphText, index) => (
            <Text key={index} style={paragraph}>
                {paragraphText}
            </Text>
        ));
    };

    return (
        <Html>
            <Head />
            <Preview>{companyName} and HackCC Sponsorship</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Img
                            src={`https://minio.hackcc.net/public-bucket/logo.svg`}
                            width={120}
                            height={45}
                            alt="HackCC Logo"
                            style={logo}
                        />
                        {isCurrentDayTuesday && (
                            <Text style={scheduleNote}>Sent on Tuesday</Text>
                        )}
                    </Section>

                    <Section style={content}>
                        {/* Email Subject */}
                        <Heading style={subjectLine}>
                            {companyName} and HackCC Sponsorship
                        </Heading>

                        {/* Email Body */}
                        {customEmailBody ? (
                            renderCustomEmailBody()
                        ) : (
                            <>
                                <Text style={paragraph}>
                                    Hello {recipientName},
                                </Text>

                                <Text style={paragraph}>
                                    I hope this email finds you well. My name is{" "}
                                    {sender.name}, and I am a{" "}
                                    {formattedYearAndMajor} student at{" "}
                                    {sender.school}. I am also a sponsorship
                                    coordinator with HackCC, a student-led
                                    initiative providing California community
                                    college students with the opportunity to
                                    compete in weekend-long invention marathons.
                                    Taking place May 2nd-4th at {venue},
                                    we&apos;re expecting 250 hackers this year!
                                </Text>

                                <Text style={paragraph}>
                                    I am reaching out to inquire about getting{" "}
                                    {companyName} on board as a sponsor for one
                                    (or more!) of our hackathons. I was
                                    wondering if {companyName} has any interest
                                    in sponsoring hackathons at this time?
                                </Text>

                                <Text style={paragraph}>Best regards,</Text>
                            </>
                        )}

                        {/* Signature */}
                        <Section style={signatureContainer}>
                            <Row>
                                <Column>
                                    <Text style={signatureName}>
                                        {sender.name}{" "}
                                        {sender.position &&
                                            `- ${sender.position}`}
                                    </Text>
                                    <Text style={signaturePosition}>
                                        {formattedYearAndMajor}
                                    </Text>
                                </Column>
                                <Column>
                                    <Text style={signatureSchool}>
                                        {sender.school}
                                    </Text>
                                </Column>
                            </Row>

                            {/* Social Media Links */}
                            {(socialLinks.linkedin ||
                                socialLinks.twitter ||
                                socialLinks.github) && (
                                <Row style={socialLinksContainer}>
                                    {socialLinks.linkedin && (
                                        <Column style={socialLinkColumn}>
                                            <Link
                                                href={socialLinks.linkedin}
                                                style={socialLink}
                                            >
                                                LinkedIn
                                            </Link>
                                        </Column>
                                    )}
                                    {socialLinks.twitter && (
                                        <Column style={socialLinkColumn}>
                                            <Link
                                                href={socialLinks.twitter}
                                                style={socialLink}
                                            >
                                                Twitter
                                            </Link>
                                        </Column>
                                    )}
                                    {socialLinks.github && (
                                        <Column style={socialLinkColumn}>
                                            <Link
                                                href={socialLinks.github}
                                                style={socialLink}
                                            >
                                                GitHub
                                            </Link>
                                        </Column>
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

export default SponsorshipEmail;

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
    backgroundColor: "#1e40af",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const logo = {
    margin: "0",
};

const scheduleNote = {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0",
    padding: "4px 8px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
};

const content = {
    padding: "30px",
};

const subjectLine = {
    fontSize: "24px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#1e40af",
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

const signatureSchool = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0",
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
