"use client";

import { format } from "date-fns";
import { Mail as MailIcon } from "lucide-react";
import { Mail } from "@/types/mail";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface MailDisplayProps {
    mail: Mail | null;
}

export default function MailDisplay({ mail }: MailDisplayProps) {
    return (
        <div className="flex h-full flex-col bg-background">
            {mail ? (
                <div className="flex flex-1 flex-col">
                    <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <Avatar>
                                <AvatarImage alt={mail.to?.[0]?.name} />
                                <AvatarFallback>
                                    {mail.to?.[0]?.name
                                        ?.split(" ")
                                        .map((chunk: string) => chunk[0])
                                        .join("") || ""}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="font-semibold">
                                    {mail.to[0].name}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    {mail.subject}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    <span className="font-medium">From:</span>{" "}
                                    {mail.from}
                                </div>
                            </div>
                        </div>
                        {mail.date && (
                            <div className="ml-auto text-xs text-muted-foreground">
                                {format(new Date(mail.date), "PPpp")}
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                        {mail.html}
                    </div>
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
