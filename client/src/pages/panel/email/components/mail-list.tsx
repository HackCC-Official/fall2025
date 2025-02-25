"use client";

import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Mail } from "@/types/mail";
import { useMail } from "@/hooks/use-mail";

interface MailListProps {
    items: Mail[];
}

/**
 * MailList Component - Displays a scrollable list of email messages
 * @param {MailListProps} props - Component properties containing array of mail items
 * @returns {JSX.Element} Rendered mail list component
 */
export default function MailList({ items = [] }: MailListProps) {
    const [mail, setMail] = useMail();

    return (
        <ScrollArea className="h-full min-h-0">
            <div className="flex flex-col gap-2 p-4 pt-0">
                {(items || []).map((item) => (
                    <button
                        key={item.id}
                        className={cn(
                            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                            mail.selected === item.id && "bg-muted"
                        )}
                        onClick={() =>
                            setMail({
                                ...mail,
                                selected: item.id,
                            })
                        }
                    >
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold">
                                        {item.to?.[0]?.name || "Unknown"}
                                    </div>
                                    {!item.read && (
                                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "ml-auto text-xs",
                                        mail.selected === item.id
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {formatDistanceToNow(new Date(item.date), {
                                        addSuffix: true,
                                    })}
                                </div>
                            </div>
                            <div className="text-xs font-medium">
                                {item.subject}
                            </div>
                        </div>
                        <div className="line-clamp-2 text-xs text-muted-foreground">
                            {item.html.substring(0, 300)}
                        </div>
                        {item.labels?.length ? (
                            <div className="flex items-center gap-2">
                                {item.labels.map((label) => (
                                    <Badge
                                        key={label}
                                        variant={getBadgeVariantFromLabel(
                                            label
                                        )}
                                    >
                                        {label}
                                    </Badge>
                                ))}
                            </div>
                        ) : null}
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}

/**
 * Determines the badge variant based on the label type
 * @param {string} label - The label to determine variant for
 * @returns {ComponentProps<typeof Badge>["variant"]} The badge variant to use
 */
function getBadgeVariantFromLabel(
    label: string
): ComponentProps<typeof Badge>["variant"] {
    switch (label.toLowerCase()) {
        case "sponsor":
            return "default";
        case "workshop":
            return "outline";
        case "important":
            return "destructive";
        case "personal":
            return "secondary";
        default:
            return "secondary";
    }
}
