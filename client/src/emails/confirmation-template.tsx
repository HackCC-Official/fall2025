import * as React from "react";
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";

interface ConfirmationEmailProps {
    companyName: string;
    sponsorshipTier: string;
    contactName: string;
    eventDate: string;
    eventName: string;
    nextSteps: string[];
    organizerName: string;
    organizerTitle: string;
    contactEmail: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

export const ConfirmationEmail = ({
    companyName,
    sponsorshipTier,
    contactName,
    eventDate,
    eventName,
    nextSteps,
    organizerName,
    organizerTitle,
    contactEmail,
}: ConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>Thank you for sponsoring {eventName}!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logo}>
                    <Row>
                        <Column>
                            <Img
                                src={`${baseUrl}/static/logo.png`}
                                width={40}
                                height={40}
                                alt="Logo"
                            />
                        </Column>
                        <Column>
                            <Section style={dateContainer}>
                                <Text
                                    style={{
                                        color: "#525f7f",
                                        fontSize: "14px",
                                    }}
                                >
                                    {new Date(eventDate).toLocaleDateString(
                                        "en-US",
                                        {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </Text>
                            </Section>
                        </Column>
                    </Row>
                </Section>

                <Section style={header}>
                    <Heading style={headerTitle}>
                        Sponsorship Confirmation
                    </Heading>
                    <Text style={headerSubtitle}>
                        Welcome to the {eventName} family!
                    </Text>
                </Section>

                <Section style={content}>
                    <Text style={greeting}>Dear {contactName},</Text>

                    <Text style={paragraph}>
                        Thank you for choosing to sponsor {eventName}! We are
                        thrilled to confirm your{" "}
                        <strong>{sponsorshipTier}</strong> sponsorship and are
                        excited to have <strong>{companyName}</strong> as an
                        official partner for our upcoming hackathon.
                    </Text>

                    <Text style={paragraph}>
                        Your support will make a significant impact on our event
                        and help foster innovation among our talented
                        participants. We&apos;re looking forward to showcasing{" "}
                        <strong>{companyName}</strong> to our diverse community
                        of student hackers.
                    </Text>

                    <Section style={summarySection}>
                        <Heading as="h2" style={sectionTitle}>
                            Next Steps
                        </Heading>
                        <Section style={pointsContainer}>
                            {nextSteps.map((step, index) => (
                                <Row key={index} style={pointRow}>
                                    <Column style={checkmarkContainer}>
                                        <Text style={checkmark}>✓</Text>
                                    </Column>
                                    <Column style={pointContent}>
                                        <Text style={pointText}>{step}</Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>
                    </Section>

                    <Text style={paragraph}>
                        If you have any questions or need to coordinate any
                        details, please don&apos;t hesitate to reach out.
                        We&apos;re here to ensure you get the most out of your
                        sponsorship.
                    </Text>

                    <Section style={ctaContainer}>
                        <Link href={`mailto:${contactEmail}`} style={button}>
                            Contact Organizer
                        </Link>
                    </Section>
                </Section>

                <Hr style={divider} />

                <Section style={signature}>
                    <Text style={signatureName}>{organizerName}</Text>
                    <Text style={signatureTitle}>{organizerTitle}</Text>
                    <Text style={signatureContact}>
                        <Link href={`mailto:${contactEmail}`} style={link}>
                            {contactEmail}
                        </Link>
                    </Text>
                </Section>
            </Container>

            <Section style={footer}>
                <Text style={footerText}>
                    We look forward to partnering with you for an amazing
                    hackathon experience!
                </Text>
            </Section>
        </Body>
    </Html>
);

export default ConfirmationEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    width: "640px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const logo = {
    padding: "20px 30px",
    borderBottom: "1px solid #e6ebf1",
};

const dateContainer = {
    textAlign: "right" as const,
};

const header = {
    backgroundColor: "#7c3aed",
    padding: "40px 30px",
    color: "#ffffff",
    borderBottom: "1px solid #e6ebf1",
};

const headerTitle = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.4",
    margin: "0",
};

const headerSubtitle = {
    color: "#e9d5ff",
    fontSize: "16px",
    lineHeight: "1.4",
    margin: "8px 0 0",
    fontWeight: "500",
};

const content = {
    padding: "30px",
};

const greeting = {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#525f7f",
    marginBottom: "24px",
};

const paragraph = {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "16px 0",
};

const summarySection = {
    marginTop: "32px",
    backgroundColor: "#fafafa",
    padding: "24px",
    borderRadius: "8px",
};

const sectionTitle = {
    fontSize: "18px",
    lineHeight: "1.4",
    color: "#32325d",
    fontWeight: "600",
    margin: "0 0 16px",
};

const pointsContainer = {
    margin: "16px 0",
};

const pointRow = {
    marginBottom: "12px",
};

const checkmarkContainer = {
    width: "32px",
    verticalAlign: "top",
};

const checkmark = {
    color: "#7c3aed",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
    lineHeight: "24px",
};

const pointContent = {
    paddingLeft: "8px",
};

const pointText = {
    color: "#525f7f",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0",
};

const divider = {
    margin: "32px 0",
    borderTop: "1px solid #e6ebf1",
};

const ctaContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
};

const button = {
    backgroundColor: "#7c3aed",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    boxShadow: "0 2px 4px rgba(124, 58, 237, 0.2)",
};

const signature = {
    padding: "0 30px",
    textAlign: "center" as const,
};

const signatureName = {
    color: "#32325d",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0",
};

const signatureTitle = {
    color: "#8898aa",
    fontSize: "14px",
    margin: "4px 0 0",
};

const signatureContact = {
    color: "#8898aa",
    fontSize: "14px",
    margin: "12px 0 0",
};

const link = {
    color: "#7c3aed",
    textDecoration: "none",
};

const footer = {
    margin: "0 auto",
    width: "640px",
    padding: "0 30px",
};

const footerText = {
    fontSize: "13px",
    lineHeight: "1.4",
    color: "#8898aa",
    textAlign: "center" as const,
    margin: "0",
};
