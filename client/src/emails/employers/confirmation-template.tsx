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

interface ConfirmationEmailProps {
    companyName: string;
    recipientName: string;
    sender: OutreachTeamDto;
    subject: string;
    socialLinks: {
        [key: string]: string;
    };

    customEmailBody?: string;
}

export const ConfirmationEmail = ({
    companyName,
    recipientName,
    sender,
    subject,
    socialLinks,
    customEmailBody,
}: ConfirmationEmailProps) => {
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    const parseContent = (content: string): string => {
        return content
            .replace(/\[recipient_name\]/g, recipientName)
            .replace(/\[company_name\]/g, companyName)
            .replace(/\[sender_name\]/g, sender.name)
            .replace(/\[sender_year_and_major\]/g, formattedYearAndMajor)
            .replace(/\[sender_school\]/g, sender.school);
    };

    const renderCustomEmailBody = () => {
        if (!customEmailBody) return null;

        const parsedContent = parseContent(customEmailBody);

        const sections = parsedContent.split("\n\n");

        return sections.map((section, index) => {
            if (section.endsWith(":")) {
                return (
                    <Text key={`header-${index}`} style={paragraphBold}>
                        {section}
                    </Text>
                );
            }

            if (section.includes("•") || section.includes("-")) {
                const lines = section.split("\n");
                return (
                    <React.Fragment key={`bullets-${index}`}>
                        {lines.map((line, lineIndex) => {
                            if (!line.trim()) return null;

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

    const parsedSubject = parseContent(subject);

    return (
        <Html>
            <Head />
            <Preview>HackCC x {companyName} Sponsorship Confirmation!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Img
                            src={`https://minio.hackcc.net/public-bucket/logo.svg`}
                            width={120}
                            height={45}
                            alt="HackCC Logo"
                            style={logo}
                        />
                    </Section>

                    <Section style={content}>
                        {/* Email Subject */}
                        <Heading style={subjectLine}>{parsedSubject}</Heading>

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
                                    for HackCC! We&apos;re thrilled to have{" "}
                                    {companyName} supporting our hackathon and
                                    can&apos;t wait to collaborate with you.
                                </Text>

                                <Text style={paragraphBold}>Next Steps:</Text>
                                <Text style={paragraphList}>
                                    • Sponsorship Agreement & Invoice: [Attach
                                    any necessary documents]
                                </Text>
                                <Text style={paragraphList}>
                                    • Logistics & Branding: Please send over
                                    your logo and any promotional materials
                                    you&apos;d like us to feature.
                                </Text>
                                <Text style={paragraphList}>
                                    • Engagement Opportunities: Let us know if
                                    your team would like to host a workshop,
                                    provide mentors, or have a booth at the
                                    event.
                                </Text>

                                <Text style={paragraph}>
                                    If there&apos;s anything else we can do to
                                    make this partnership a success, please
                                    don&apos;t hesitate to reach out. Looking
                                    forward to working together!
                                </Text>

                                <Text style={paragraph}>Best,</Text>
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
                                    <Text style={signatureDetails}>
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
    justifyContent: "center",
    alignItems: "center",
};

const logo = {
    margin: "0",
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

const signatureSchool = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0",
    textAlign: "right" as const,
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
