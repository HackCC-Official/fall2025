"use client";

import * as React from "react";
import { Inbox, Search, Send, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Input } from "@/components/ui/input";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
import type { Mail } from "@/types/mail";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { useMail } from "@/hooks/use-mail";
import { Nav } from "./nav";
import { MailHeader } from "./mail-header";
import { ContactsList } from "./contacts-list";
import { CONTACTS } from "./contacts-list";
import { ContactDisplay } from "./contact-display";
import { useContact } from "@/hooks/use-contact";

interface MailProps {
    accounts: {
        label: string;
        email: string;
        icon: React.ReactNode;
    }[];
    mails: Mail[];
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

export function Mail({
    mails,
    defaultLayout = [20, 32, 48],
    defaultCollapsed = false,
    navCollapsedSize,
}: MailProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const [mail] = useMail();
    const [contact] = useContact();
    const selectedMail =
        mails.find((item) => item.id === mail.selected) || null;
    const selectedContact =
        CONTACTS.find((item) => item.id === contact.selected) || null;

    const [activeView, setActiveView] = React.useState<"mail" | "contacts">(
        "mail"
    );

    return (
        <div className="flex flex-col h-full">
            <MailHeader selectedMail={selectedMail} />

            <div className="flex-1">
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
                            minSize={15}
                            maxSize={20}
                            onCollapse={() => {
                                setIsCollapsed(true);
                                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                                    true
                                )}`;
                            }}
                            onResize={() => {
                                setIsCollapsed(false);
                                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                                    false
                                )}`;
                            }}
                            className={cn(
                                isCollapsed &&
                                    "min-w-[50px] transition-all duration-300 ease-in-out"
                            )}
                        >
                            <Separator />
                            <Separator />
                            <Nav
                                isCollapsed={isCollapsed}
                                links={[
                                    {
                                        title: "Inbox",
                                        label: "128",
                                        icon: Inbox,
                                        variant:
                                            activeView === "mail"
                                                ? "default"
                                                : "ghost",
                                        onClick: () => setActiveView("mail"),
                                    },
                                    {
                                        title: "Sent",
                                        label: "",
                                        icon: Send,
                                        variant: "ghost",
                                    },
                                    {
                                        title: "Contacts",
                                        label: CONTACTS.length.toString(),
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
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center px-4 py-2">
                                        <h1 className="text-xl font-bold">
                                            Inbox
                                        </h1>
                                    </div>
                                    <Separator />
                                    <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                        <form>
                                            <div className="relative">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search"
                                                    className="pl-8"
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <MailList items={mails} />
                                </div>
                            ) : (
                                <ContactsList />
                            )}
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            defaultSize={defaultLayout[2]}
                            minSize={30}
                        >
                            {activeView === "mail" ? (
                                <MailDisplay mail={selectedMail} />
                            ) : (
                                <ContactDisplay contact={selectedContact} />
                            )}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </TooltipProvider>
            </div>
        </div>
    );
}
