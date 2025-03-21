import * as React from "react";
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Row,
    Section,
    Text,
} from "@react-email/components";
import { OutreachTeamDto } from "../../features/outreach/types/outreach-team";

interface PostCallEmailProps {
    companyName: string;
    recipientName: string;
    subject: string;
    sender: OutreachTeamDto;
    positionAtHackCC: string;
    organizationLogo?: string;
    followupDate?: string;
    followupTime?: string;
    requestedMaterials?: string;
    socialLinks: {
        [key: string]: string;
    };

    customEmailBody?: string;
}

export const PostCallEmail = ({
    companyName,
    recipientName,
    subject,
    sender,
    followupDate,
    followupTime,
    requestedMaterials,
    customEmailBody,
}: PostCallEmailProps) => {
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    const parseContent = (content: string): string => {
        return content
            .replace(/\[recipient_name\]/g, recipientName)
            .replace(/\[company_name\]/g, companyName)
            .replace(/\[sender_name\]/g, sender.name)
            .replace(/\[sender_year_and_major\]/g, formattedYearAndMajor)
            .replace(/\[sender_school\]/g, sender.school)
            .replace(/\[followup_date\]/g, followupDate || "[Date]")
            .replace(/\[followup_time\]/g, followupTime || "[Time]")
            .replace(
                /\[requested_materials\]/g,
                requestedMaterials || "requested materials"
            );
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
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Text
                            style={{
                                color: "#ffffff",
                                fontSize: "18px",
                                fontWeight: "700",
                                margin: "0",
                            }}
                        >
                            HackCC - All California Community Colleges
                        </Text>
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
                                    It was a pleasure speaking with you today
                                    about HackCC and how {companyName} can get
                                    involved. I appreciate your time and
                                    insights!
                                </Text>

                                <Text style={paragraphBold}>
                                    Recap from Our Call:
                                </Text>
                                <Text style={paragraphList}>
                                    • Key points discussed
                                </Text>
                                <Text style={paragraphList}>
                                    • Benefits {companyName} expressed interest
                                    in
                                </Text>
                                <Text style={paragraphList}>
                                    • Any additional concerns raised and how
                                    they were addressed
                                </Text>

                                <Text style={paragraph}>
                                    Just confirming our follow-up call on{" "}
                                    {followupDate || "[Date]"} at{" "}
                                    {followupTime || "[Time]"}. In the meantime,
                                    I&apos;ve attached the{" "}
                                    {requestedMaterials ||
                                        "requested materials"}{" "}
                                    for your review. If you have any questions
                                    or need further information, feel free to
                                    reach out. Looking forward to hearing your
                                    thoughts!
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

export default PostCallEmail;

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
    justifyContent: "center",
    alignItems: "center",
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

const signatureSchool = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0",
    textAlign: "right" as const,
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

const signatureDetails = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 8px",
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
