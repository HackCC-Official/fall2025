"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, PenBox, Mail as MailIcon } from "lucide-react";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Mail } from "@/types/mail";
import { useMail } from "@/hooks/use-mail";

interface HackersMailProps {
    mails: Mail[];
    defaultLayout?: number[];
    title?: string;
    description?: string;
}

export default function HackersMail({
    mails = [],
    defaultLayout = [35, 65],
    title = "Registered Hackers",
    description = "Manage and communicate with registered participants",
}: HackersMailProps) {
    const [mail, setMail] = useMail();
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredMails = (mails || []).filter(
        (mail) =>
            mail.to?.[0]?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            mail.to?.[0]?.email
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const selectedHacker = mails.find((m) => m.id === mail.selected);

    return (
        <div className="flex flex-col h-full bg-muted/5">
            <div className="border-b bg-background p-6">
                <div className="flex items-center justify-between max-w-[1400px] mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {description} ({mails.length})
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                            (window.location.href = "/panel/email/compose/hackers")
                        }
                    >
                        <PenBox className="h-4 w-4" />
                        Send Mass Email
                    </Button>
                </div>
            </div>
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
                    <div className="h-full flex flex-col bg-background">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {filteredMails.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() =>
                                        setMail({ ...mail, selected: item.id })
                                    }
                                    className={cn(
                                        "w-full text-left px-4 py-3 border-b hover:bg-accent/50 transition-colors",
                                        mail.selected === item.id && "bg-accent"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                            {item.to?.[0]?.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {item.to?.[0]?.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {item.to?.[0]?.email}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    {selectedHacker ? (
                        <div className="p-6 bg-background h-full">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                                            {selectedHacker.to?.[0]?.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {selectedHacker.to?.[0]?.name}
                                            </h2>
                                            <p className="text-muted-foreground">
                                                {selectedHacker.to?.[0]?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() =>
                                            (window.location.href = `/compose?to=${selectedHacker.to?.[0]?.email}`)
                                        }
                                    >
                                        <MailIcon className="h-4 w-4" />
                                        Send Email
                                    </Button>
                                </div>

                                <Card>
                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <h3 className="font-medium mb-2">
                                                Registration Status
                                            </h3>
                                            <div className="flex gap-2">
                                                {selectedHacker.labels.map(
                                                    (label) => (
                                                        <Badge
                                                            key={label}
                                                            variant="secondary"
                                                        >
                                                            {label}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-2">
                                                Registration Date
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {new Date(
                                                    selectedHacker.date
                                                ).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 bg-background">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <MailIcon className="h-6 w-6" />
                            </div>
                            <h3 className="font-medium mb-1">
                                No Hacker Selected
                            </h3>
                            <p className="text-sm text-center">
                                Select a hacker from the list to view their
                                details
                            </p>
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
