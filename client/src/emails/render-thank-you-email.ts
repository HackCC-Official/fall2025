import { render } from "@react-email/render";
import { ThankYouEmail } from "./thank-you-template";

/**
 * Interface for rendering a thank you email
 */
interface RenderThankYouEmailOptions {
    /**
     * The recipient's email address
     */
    recipientEmail: string;

    /**
     * Optional custom message to include in the email
     */
    customMessage?: string;
}

/**
 * Renders the thank you email template to HTML
 *
 * @param options - The options for rendering the thank you email
 * @returns A promise that resolves to the rendered HTML string
 */
export async function renderThankYouEmail(
    options: RenderThankYouEmailOptions
): Promise<string> {
    const { recipientEmail, customMessage } = options;

    const emailHtml = render(
        ThankYouEmail({
            recipientEmail,
            customMessage,
        })
    );

    return emailHtml;
}
