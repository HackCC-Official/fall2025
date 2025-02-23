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

interface InvoiceEmailProps {
    recipientName: string;
    companyName: string;
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    serviceDescription: string;
    paymentLink: string;
    organizerName: string;
    organizerTitle: string;
    contactEmail: string;
    contactPhone: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

export const InvoiceEmail = ({
    recipientName,
    companyName,
    invoiceNumber,
    amount,
    dueDate,
    serviceDescription,
    paymentLink,
    organizerName,
    organizerTitle,
    contactEmail,
    contactPhone,
}: InvoiceEmailProps) => (
    <Html>
        <Head />
        <Preview>
            Invoice #{invoiceNumber} for {companyName}
        </Preview>
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
                                <Text style={invoiceNumberText}>
                                    Invoice #{invoiceNumber}
                                </Text>
                                <Text style={dueDateText}>
                                    Due:{" "}
                                    {new Date(dueDate).toLocaleDateString(
                                        "en-US",
                                        {
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
                    <Heading style={headerTitle}>Invoice</Heading>
                    <Text style={headerSubtitle}>
                        Thank you for your business
                    </Text>
                </Section>

                <Section style={content}>
                    <Row style={billingSection}>
                        <Column style={billingColumn}>
                            <Text style={billingTitle}>Billed To:</Text>
                            <Text style={billingText}>{recipientName}</Text>
                            <Text style={billingText}>{companyName}</Text>
                        </Column>
                        <Column style={billingColumn}>
                            <Text style={billingTitle}>Amount Due:</Text>
                            <Text style={amountText}>${amount}</Text>
                        </Column>
                    </Row>

                    <Section style={summarySection}>
                        <Heading as="h2" style={sectionTitle}>
                            Service Details
                        </Heading>
                        <Text style={serviceText}>{serviceDescription}</Text>
                    </Section>

                    <Hr style={divider} />

                    <Section style={paymentSection}>
                        <Heading as="h2" style={sectionTitle}>
                            Payment Information
                        </Heading>
                        <Text style={paragraph}>
                            Please complete your payment by{" "}
                            <strong>
                                {new Date(dueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </strong>
                            . Click the button below to process your payment
                            securely.
                        </Text>

                        <Section style={ctaContainer}>
                            <Link href={paymentLink} style={button}>
                                Pay Invoice Now
                            </Link>
                        </Section>
                    </Section>

                    <Text style={paragraph}>
                        If you have any questions about this invoice, please
                        don&apos;t hesitate to reach out to us.
                    </Text>
                </Section>

                <Hr style={divider} />

                <Section style={signature}>
                    <Text style={signatureName}>{organizerName}</Text>
                    <Text style={signatureTitle}>{organizerTitle}</Text>
                    <Text style={signatureContact}>
                        <Link href={`mailto:${contactEmail}`} style={link}>
                            {contactEmail}
                        </Link>{" "}
                        • {contactPhone}
                    </Text>
                </Section>
            </Container>

            <Section style={footer}>
                <Text style={footerText}>
                    This is an automatically generated invoice. Please keep this
                    for your records.
                </Text>
            </Section>
        </Body>
    </Html>
);

export default InvoiceEmail;

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

const invoiceNumberText = {
    fontSize: "16px",
    color: "#32325d",
    fontWeight: "600",
    margin: "0",
};

const dueDateText = {
    fontSize: "14px",
    color: "#525f7f",
    margin: "4px 0 0",
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

const billingSection = {
    marginBottom: "32px",
};

const billingColumn = {
    padding: "0 12px",
};

const billingTitle = {
    fontSize: "14px",
    color: "#8898aa",
    marginBottom: "8px",
};

const billingText = {
    fontSize: "16px",
    color: "#32325d",
    margin: "4px 0",
};

const amountText = {
    fontSize: "24px",
    color: "#7c3aed",
    fontWeight: "600",
    margin: "4px 0",
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

const serviceText = {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#525f7f",
    margin: "0",
    whiteSpace: "pre-wrap" as const,
};

const paymentSection = {
    marginTop: "32px",
};

const paragraph = {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "16px 0",
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
