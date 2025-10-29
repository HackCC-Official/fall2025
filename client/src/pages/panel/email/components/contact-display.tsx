import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Mail,
    Phone,
    User,
    AlertTriangle,
    Briefcase,
    Link as LinkIcon,
    Clipboard,
    Copy,
    Check,
    Building,
    X,
} from "lucide-react";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContact } from "@/hooks/use-contact";
import { useEffect, useState } from "react";
import { getContactById } from "@/features/outreach/api/outreach";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContactDisplayProps {
    contact: ContactDto | null;
}

export default function ContactDisplay({
    contact: initialContact,
}: ContactDisplayProps) {
    const router = useRouter();
    const [contactState, setContact] = useContact();
    const [contact, setLocalContact] = useState<ContactDto | null>(
        initialContact
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string | undefined, field: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    useEffect(() => {
        if (initialContact) {
            setLocalContact(initialContact);
            if (
                initialContact.id &&
                initialContact.email_address === contactState.selected
            ) {
                setContact({ selectedId: initialContact.id });
            }
            return;
        }

        if (contactState.selectedId && !initialContact) {
            const fetchContact = async () => {
                setIsLoading(true);
                setError(null);

                try {
                    console.log(
                        "Fetching contact by ID:",
                        contactState.selectedId
                    );
                    if (contactState.selectedId) {
                        const fetchedContact = await getContactById(
                            contactState.selectedId.toString()
                        );
                        setLocalContact(fetchedContact);
                    }
                } catch (err) {
                    console.error("Failed to fetch contact:", err);
                    setError("Failed to load contact details");
                    setLocalContact(null);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchContact();
        } else if (
            contactState.selected &&
            !contactState.selectedId &&
            !initialContact
        ) {
            setLocalContact(null);
            setError(
                "Contact ID not available. Please select a contact from the list."
            );
        } else {
            setLocalContact(initialContact);
        }
    }, [
        initialContact,
        contactState.selected,
        contactState.selectedId,
        setContact,
    ]);

    const handleSendEmail = () => {
        if (contact?.email_address) {
            router.push(`/panel/email/compose?to=${contact.email_address}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center p-8 h-full text-muted-foreground">
                <div className="flex justify-center items-center mb-4">
                    <div className="animate-spin h-16 w-16 border-4 border-primary rounded-full border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-medium mb-2 text-foreground">
                    Loading Contact Details
                </h3>
                <p className="text-sm text-center">
                    Please wait while we load the contact information
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center p-8 h-full text-destructive">
                <div className="flex justify-center items-center bg-destructive/10 mb-4 rounded-full w-16 h-16">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                    Error Loading Contact
                </h3>
                <p className="text-sm text-center max-w-md">{error}</p>
            </div>
        );
    }

    if (!contact) {
        // If we have a selected email but no contact, show a warning
        if (contactState.selected) {
            return (
                <div className="flex flex-col justify-center items-center p-8 h-full">
                    <div className="flex justify-center items-center bg-yellow-100 text-yellow-700 mb-4 rounded-full w-16 h-16">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-foreground">
                        Contact Not Found
                    </h3>
                    <p className="text-sm text-center max-w-md">
                        The selected contact with email &ldquo;
                        {contactState.selected}&rdquo; could not be found.
                    </p>
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                        This may happen if the contact is on another page or has
                        been deleted.
                    </p>
                </div>
            );
        }

        // No selection at all
        return (
            <div className="flex flex-col justify-center items-center p-8 h-full">
                <div className="flex justify-center items-center bg-muted mb-4 rounded-full w-16 h-16">
                    <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-foreground">
                    No Contact Selected
                </h3>
                <p className="text-sm text-center text-muted-foreground">
                    Select a contact from the list to view their details
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-auto">
            <div className="sticky top-0 z-10 bg-background px-8 py-6 border-b">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl relative">
                            {contact.contact_name?.charAt(0).toUpperCase() ||
                                contact.email_address.charAt(0).toUpperCase()}
                            {contact.status && (
                                <div
                                    className={cn(
                                        "absolute -top-1 -right-1 rounded-full h-5 w-5 flex items-center justify-center",
                                        contact.status === "Cold" &&
                                            "bg-blue-500",
                                        contact.status === "Follow Up 1" &&
                                            "bg-amber-500",
                                        contact.status === "Follow Up 2" &&
                                            "bg-amber-600",
                                        contact.status === "Accept" &&
                                            "bg-green-500",
                                        contact.status === "Rejected" &&
                                            "bg-red-500",
                                        contact.status === "Contacted" &&
                                            "bg-purple-500",
                                        ![
                                            "Cold",
                                            "Follow Up 1",
                                            "Follow Up 2",
                                            "Accept",
                                            "Rejected",
                                            "Contacted",
                                        ].includes(contact.status) &&
                                            "bg-primary"
                                    )}
                                >
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {contact.contact_name || "Unnamed Contact"}
                            </h1>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                {contact.position && (
                                    <span className="flex items-center gap-1 text-sm">
                                        <Briefcase className="h-3.5 w-3.5" />
                                        {contact.position}
                                    </span>
                                )}
                                {contact.company && (
                                    <>
                                        <span className="text-xs">•</span>
                                        <span className="flex items-center gap-1 text-sm">
                                            <Building className="h-3.5 w-3.5" />
                                            {contact.company}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9"
                            onClick={handleSendEmail}
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                        </Button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {contact.status && (
                        <Badge
                            variant="default"
                            className={cn(
                                contact.status === "Cold" &&
                                    "bg-blue-500 hover:bg-blue-500/80",
                                contact.status === "Follow Up 1" &&
                                    "bg-amber-500 hover:bg-amber-500/80",
                                contact.status === "Follow Up 2" &&
                                    "bg-amber-600 hover:bg-amber-600/80",
                                contact.status === "Accept" &&
                                    "bg-green-500 hover:bg-green-500/80",
                                contact.status === "Rejected" &&
                                    "bg-red-500 hover:bg-red-500/80",
                                contact.status === "Contacted" &&
                                    "bg-purple-500 hover:bg-purple-500/80"
                            )}
                        >
                            {contact.status === "Cold" && (
                                <Mail className="h-3 w-3 mr-1" />
                            )}
                            {(contact.status === "Follow Up 1" ||
                                contact.status === "Follow Up 2") && (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {contact.status === "Accept" && (
                                <Check className="h-3 w-3 mr-1" />
                            )}
                            {contact.status === "Rejected" && (
                                <X className="h-3 w-3 mr-1" />
                            )}
                            {contact.status === "Contacted" && (
                                <Check className="h-3 w-3 mr-1" />
                            )}
                            {contact.status}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="px-8 py-6 flex-1 space-y-6">
                <Card className="overflow-hidden border-none shadow-sm">
                    <CardHeader className="pb-3 bg-muted/30 border-b">
                        <CardTitle className="text-md font-medium flex items-center">
                            <User className="w-4 h-4 mr-2 text-primary" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-5">
                        <TooltipProvider delayDuration={300}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {contact.email_address && (
                                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                        <div className="truncate flex-1">
                                            {contact.email_address}
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            contact.email_address,
                                                            "email"
                                                        )
                                                    }
                                                >
                                                    {copied === "email" ? (
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {copied === "email"
                                                    ? "Copied!"
                                                    : "Copy email"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )}

                                {contact.phone_number && (
                                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                        <div className="truncate flex-1">
                                            {contact.phone_number}
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            contact.phone_number,
                                                            "phone"
                                                        )
                                                    }
                                                >
                                                    {copied === "phone" ? (
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {copied === "phone"
                                                    ? "Copied!"
                                                    : "Copy phone"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )}

                                {contact.linkedin && (
                                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <LinkIcon className="h-4 w-4 text-primary flex-shrink-0" />
                                        <a
                                            href={contact.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline truncate flex-1"
                                        >
                                            LinkedIn Profile
                                        </a>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            contact.linkedin,
                                                            "linkedin"
                                                        )
                                                    }
                                                >
                                                    {copied === "linkedin" ? (
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {copied === "linkedin"
                                                    ? "Copied!"
                                                    : "Copy URL"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )}

                                {contact.website && (
                                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <LinkIcon className="h-4 w-4 text-primary flex-shrink-0" />
                                        <a
                                            href={contact.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline truncate flex-1"
                                        >
                                            Website
                                        </a>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            contact.website,
                                                            "website"
                                                        )
                                                    }
                                                >
                                                    {copied === "website" ? (
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {copied === "website"
                                                    ? "Copied!"
                                                    : "Copy URL"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </TooltipProvider>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-sm">
                    <CardHeader className="pb-3 bg-muted/30 border-b">
                        <CardTitle className="text-md font-medium flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-primary" />
                            Organization Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <div className="space-y-4">
                            {contact.company && (
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">
                                        Company
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center">
                                        {contact.company}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {contact.position && (
                                    <div className="space-y-1 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <div className="text-sm font-medium flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                                            Position
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {contact.position}
                                        </div>
                                    </div>
                                )}

                                {contact.meeting_method && (
                                    <div className="space-y-1 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <div className="text-sm font-medium flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                                            Meeting Method
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {contact.meeting_method}
                                        </div>
                                    </div>
                                )}

                                {contact.liaison && (
                                    <div className="space-y-1 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                        <div className="text-sm font-medium flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                                            Liaison
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {contact.liaison}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {contact.confidence_score !== undefined && (
                    <Card className="overflow-hidden border-none shadow-sm">
                        <CardHeader className="pb-3 bg-muted/30 border-b">
                            <CardTitle className="text-md font-medium flex items-center">
                                <Clipboard className="w-4 h-4 mr-2 text-primary" />
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">
                                        Confidence Score
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full",
                                                    contact.confidence_score >
                                                        70
                                                        ? "bg-green-500"
                                                        : contact.confidence_score >
                                                            40
                                                          ? "bg-amber-500"
                                                          : "bg-red-500"
                                                )}
                                                style={{
                                                    width: `${contact.confidence_score}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {contact.confidence_score}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
