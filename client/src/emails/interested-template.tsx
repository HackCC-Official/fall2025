import * as React from "react";
import {
    Body,
    Container,
    Column,
    Head,
    Html,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import { OutreachTeamDto } from "../features/outreach/types/outreach-team";

interface InterestedEmailProps {
    recipientName: string;
    emailContent: string;
    sender: OutreachTeamDto;
    organizationLogo?: string;
    socialLinks?: {
        [key: string]: string;
    };
}

export const InterestedEmail = ({
    emailContent,
    sender,
    recipientName,
}: InterestedEmailProps) => {
    const formattedYearAndMajor = `${sender.year} ${sender.major}`;

    const renderCustomEmailBody = () => {
        if (!emailContent) return null;

        const parsedContent = emailContent
            .replace(/\[recipient_name\]/g, recipientName)
            .replace(/\[sender_name\]/g, sender.name)
            .replace(/\[sender_year_and_major\]/g, formattedYearAndMajor)
            .replace(/\[sender_school\]/g, sender.school);

        return parsedContent.split("\n\n").map((paragraphText, index) => (
            <Text key={index} style={paragraph}>
                {paragraphText}
            </Text>
        ));
    };

    return (
        <Html>
            <Head />
            <Preview>Message from HackCC</Preview>
            <Body style={main}>
                <Container style={container}>
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
                        {renderCustomEmailBody()}

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

export default InterestedEmail;

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
