"use client";

import * as React from "react";
import { Send, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { Mail } from "@/types/mail";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { useMail } from "@/hooks/use-mail";
import { useContact } from "@/hooks/use-contact";
import Nav from "./nav";
import MailHeader from "./mail-header";
import ContactsList from "./contacts-list";
import ContactDisplay from "./contact-display";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import UploadContactsModal from "./upload-contacts-modal";
import AddContactDrawer from "./add-contact-drawer";
import Inbox from "./inbox";
import type { SendEmailDto } from "@/features/outreach/types/email.dto";
import SentDisplay from "./sent-display";
import { useContacts } from "@/hooks/use-contacts";

interface MailProps {
    accounts: {
        label: string;
        email: string;
        icon: React.ReactNode;
    }[];
    mails: Mail[];
    contacts: ContactDto[];
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
    emails: SendEmailDto[];
    emailsCount: number;
}

export default function Mail({
    mails = [],
    contacts: initialContacts = [],
    defaultLayout = [20, 32, 48],
    defaultCollapsed = false,
    navCollapsedSize,
    emails = [],
    emailsCount = 0,
}: MailProps) {
    // Debug log
    console.log("Mail component received initial contacts:", initialContacts);
    console.log("Mail component received emails:", emails);

    const [isCollapsed] = React.useState(defaultCollapsed);
    const [mail] = useMail();
    const [contact] = useContact();
    const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] =
        React.useState(false);

    const selectedMail =
        mails?.find((item) => item.id === mail.selected) || null;
    const selectedEmail =
        emails?.find((item) => item.id === mail.selected) || null;

    const [activeView, setActiveView] = React.useState<"mail" | "contacts">(
        "mail"
    );

    // Fetch contacts data with pagination
    const {
        data: contactsData,
        // We don't need these pagination details in Mail component
    } = useContacts();

    const contacts = contactsData?.data || initialContacts;
    const totalContacts = contactsData?.total || 0;

    // Debug contact selection
    React.useEffect(() => {
        if (contact.selected) {
            console.log("Current contact selection:", {
                email: contact.selected,
                id: contact.selectedId,
            });
        }
    }, [contact.selected, contact.selectedId]);

    React.useEffect(() => {
        // Open upload modal when navigating to /panel/email/contacts
        if (window.location.pathname === "/panel/email/contacts") {
            setIsUploadModalOpen(true);
        }
    }, []);

    return (
        <div className="flex flex-col h-full">
            <MailHeader
                selectedMail={selectedMail}
                activeView={activeView}
                onUploadClick={() => setIsUploadModalOpen(true)}
                onAddContactClick={() => setIsAddContactModalOpen(true)}
            />

            <div className="flex-1 min-h-0">
                <TooltipProvider delayDuration={0}>
                    <ResizablePanelGroup
                        direction="horizontal"
                        onLayout={(sizes: number[]) => {
                            document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                                sizes
                            )}`;
                        }}
                        className="h-full items-stretch"
                    >
                        <ResizablePanel
                            defaultSize={defaultLayout[0]}
                            collapsedSize={navCollapsedSize}
                            collapsible={true}
                            maxSize={4.5}
                            className={cn(
                                isCollapsed &&
                                    `min-w-[50px] transition-all duration-300 ease-in-out react-resizable-panels:collapsed=${JSON.stringify(
                                        false
                                    )}`
                            )}
                        >
                            <Separator />
                            <Separator />
                            <Nav
                                isCollapsed={isCollapsed}
                                links={[
                                    {
                                        label: emailsCount.toString(),
                                        icon: Send,
                                        variant:
                                            activeView === "mail"
                                                ? "default"
                                                : "ghost",
                                        onClick: () => setActiveView("mail"),
                                    },
                                    {
                                        label: totalContacts.toString(),
                                        icon: Users,
                                        variant:
                                            activeView === "contacts"
                                                ? "default"
                                                : "ghost",
                                        onClick: () =>
                                            setActiveView("contacts"),
                                    },
                                ]}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            defaultSize={defaultLayout[1]}
                            minSize={30}
                        >
                            {activeView === "mail" ? (
                                <Inbox emails={emails} className="" />
                            ) : (
                                <ContactsList contacts={contacts} />
                            )}
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            defaultSize={defaultLayout[2]}
                            minSize={30}
                        >
                            {activeView === "mail" ? (
                                <SentDisplay email={selectedEmail} />
                            ) : (
                                <ContactDisplay contact={null} />
                            )}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </TooltipProvider>
            </div>
            <UploadContactsModal
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}
            />
            <AddContactDrawer
                open={isAddContactModalOpen}
                onOpenChange={setIsAddContactModalOpen}
            />
        </div>
    );
}
