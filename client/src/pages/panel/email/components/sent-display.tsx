"use client";

import * as React from "react";
import { format } from "date-fns";
import {
    Mail as MailIcon,
    Send,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    Users,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SendEmailDto } from "@/features/outreach/types/email.dto";

interface SentDisplayProps {
    email: SendEmailDto | null;
}

export default function SentDisplay({ email }: SentDisplayProps) {
    return (
        <div className="flex h-full flex-col bg-background">
            {email ? (
                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage
                                    alt={
                                        typeof email.to[0] === "string"
                                            ? email.to[0]
                                            : email.to[0]?.name ||
                                              email.to[0]?.email
                                    }
                                />
                                <AvatarFallback>
                                    {typeof email.to[0] === "string"
                                        ? email.to[0].charAt(0).toUpperCase()
                                        : email.to[0]?.name
                                          ? email.to[0].name
                                                .charAt(0)
                                                .toUpperCase()
                                          : email.to[0]?.email
                                                .charAt(0)
                                                .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">
                                    {email.subject || "(No subject)"}
                                </div>
                                <div className="line-clamp-1 text-xs flex items-center gap-1">
                                    <Send className="h-3 w-3" />
                                    <span className="font-medium">
                                        From:
                                    </span>{" "}
                                    {email.from}
                                </div>
                                <div className="line-clamp-1 text-xs flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span className="font-medium">
                                        To:
                                    </span>{" "}
                                    {typeof email.to[0] === "string"
                                        ? email.to[0]
                                        : email.to[0]?.name ||
                                          email.to[0]?.email}
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        variant={getStatusVariant(email.status)}
                                        className="text-xs flex items-center gap-1"
                                    >
                                        {email.status === "delivered" && (
                                            <CheckCircle className="h-3 w-3" />
                                        )}
                                        {email.status === "failed" && (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        {email.status === "sent" && (
                                            <Send className="h-3 w-3" />
                                        )}
                                        {email.status || "sent"}
                                    </Badge>

                                    {email.id?.startsWith("batch-") && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            Batch
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {email.createdAt && (
                            <div className="ml-auto text-xs text-muted-foreground flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(email.createdAt), "PPpp")}
                                </div>
                                {email.updatedAt &&
                                    email.updatedAt !== email.createdAt && (
                                        <div className="text-xs text-muted-foreground">
                                            Updated:{" "}
                                            {format(
                                                new Date(email.updatedAt),
                                                "PPpp"
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {email.to && email.to.length > 1 && (
                        <>
                            <div className="px-4 py-2">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium">
                                        All Recipients:
                                    </span>
                                </div>
                                <div className="mt-1 text-sm">
                                    {email.to.map((recipient, index) => (
                                        <span
                                            key={`${typeof recipient === "string" ? recipient : recipient.email}-${index}`}
                                            className="mr-2"
                                        >
                                            {typeof recipient === "string"
                                                ? recipient
                                                : recipient.name ||
                                                  recipient.email}
                                            {index < email.to.length - 1
                                                ? ","
                                                : ""}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Email Content */}
                    <ScrollArea className="flex-1">
                        <div className="p-4">
                            {/* Email subject as heading */}
                            <h2 className="text-xl font-bold mb-4">
                                {email.subject || "(No subject)"}
                            </h2>

                            {/* Rendered HTML Content */}
                            <div
                                className="email-content"
                                dangerouslySetInnerHTML={{ __html: email.html }}
                            />
                        </div>
                    </ScrollArea>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <MailIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">No Email Selected</h3>
                    <p className="text-sm text-center">
                        Select an email from the list to view its contents
                    </p>
                </div>
            )}
        </div>
    );
}

function getStatusVariant(
    status: string | undefined
): "default" | "outline" | "destructive" | "secondary" {
    switch (status) {
        case "delivered":
            return "default";
        case "sent":
            return "outline";
        case "failed":
            return "destructive";
        default:
            return "outline";
    }
}

const styles = `
.email-content {
  max-width: 100%;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.6;
}

.email-content img {
  max-width: 100%;
  height: auto;
}

.email-content a {
  color: #3b82f6;
  text-decoration: underline;
}
`;

if (typeof document !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
}
