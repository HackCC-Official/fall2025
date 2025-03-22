"use client";

import * as React from "react";
import type { Mail } from "@/types/mail";
import ComposePage from "@/components/compose/ComposeView";
import PanelLayout from "../../layout";

// Export the RecipientType type for other components to use
export type RecipientType = "employers" | "registered" | "interested";

interface MainComposePageProps {
    mails?: Mail[];
}

export default function MainComposePage({ mails = [] }: MainComposePageProps) {
    return <ComposePage mails={mails} />;
}

MainComposePage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
