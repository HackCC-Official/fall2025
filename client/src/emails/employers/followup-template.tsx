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

interface FollowUpEmailProps {
    companyName: string;
    recipientName: string;
    subject: string;
    venue: string;
    sender: OutreachTeamDto;
    positionAtHackCC: string;
    location: string;
    organizationLogo?: string;
    socialLinks: {
        [key: string]: string;
    };
    customEmailBody?: string;
}

export const FollowUpEmail = ({
    companyName,
    recipientName,
    subject,
    venue,
    sender,
    location,
    customEmailBody,
}: FollowUpEmailProps) => {
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    const parseContent = (content: string): string => {
        return content
            .replace(/\[recipient_name\]/g, recipientName)
            .replace(/\[company_name\]/g, companyName)
            .replace(/\[sender_name\]/g, sender.name)
            .replace(/\[sender_year_and_major\]/g, formattedYearAndMajor)
            .replace(/\[sender_school\]/g, sender.school)
            .replace(/\[venue\]/g, venue)
            .replace(/\[location\]/g, location);
    };

    const renderCustomEmailBody = () => {
        if (!customEmailBody) return null;

        const parsedContent = parseContent(customEmailBody);

        return parsedContent.split("\n\n").map((paragraphText, index) => (
            <Text key={index} style={paragraph}>
                {paragraphText}
            </Text>
        ));
    };

    const parsedSubject = parseContent(subject);

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={headerText}>HackCC</Text>
                    </Section>

                    <Section style={content}>
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
                                    I hope this email finds you well. My name is{" "}
                                    {sender.name}, and I am a{" "}
                                    {formattedYearAndMajor} student at{" "}
                                    {sender.school}. I am also a sponsorship
                                    coordinator with HackCC, a student-led
                                    initiative providing California community
                                    college students with the opportunity to
                                    compete in weekend-long invention marathons.
                                    Taking place November 8th at {venue},
                                    we&apos;re expecting 250 hackers this year!
                                </Text>

                                <Text style={paragraph}>
                                    I reached out to you on Tuesday about
                                    getting {companyName} on board as a sponsor
                                    for one (or more!) of our hackathons. I was
                                    wondering if {companyName} has any interest
                                    in sponsoring hackathons at this time?
                                </Text>
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
    backgroundColor: "#1e40af",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const headerText = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0",
    textAlign: "center" as const,
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

const signatureSchool = {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0",
    textAlign: "right" as const,
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
