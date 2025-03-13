import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Mail, MapPin, Phone, User } from "lucide-react";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ContactDisplayProps {
    contact: ContactDto | null;
}

export default function ContactDisplay({ contact }: ContactDisplayProps) {
    const router = useRouter();

    const handleSendEmail = () => {
        if (contact?.id) {
            router.push(`/panel/email/compose?contactId=${contact.id}`);
        }
    };

    if (!contact) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <User className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-1">No Contact Selected</h3>
                <p className="text-sm text-center">
                    Select a contact from the list to view their details
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-0 overflow-auto p-6">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-semibold">
                            {contact.first_name} {contact.last_name}
                        </h2>
                        <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">
                                {contact.position}
                            </p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                    {contact.type}
                                </Badge>
                                {contact.been_contacted && (
                                    <Badge variant="default">Contacted</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleSendEmail}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        Send Email
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{contact.email}</span>
                            </div>
                            {contact.phone_number && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{contact.phone_number}</span>
                                </div>
                            )}
                            {contact.linkedin_url && (
                                <div className="flex items-center gap-2 text-sm">
                                    <svg
                                        className="h-4 w-4 text-muted-foreground"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect
                                            width="4"
                                            height="12"
                                            x="2"
                                            y="9"
                                        />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                    <a
                                        href={contact.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        LinkedIn Profile
                                    </a>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Organization Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-1">
                            <p className="text-sm font-medium">Organization</p>
                            <p className="text-sm text-muted-foreground">
                                {contact.organization}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {contact.department && (
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium">
                                        Department
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {contact.department}
                                    </p>
                                </div>
                            )}
                            {contact.industry && (
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium">
                                        Industry
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {contact.industry}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {contact.country && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-1">
                                {contact.street && (
                                    <p className="text-sm">{contact.street}</p>
                                )}
                                <p className="text-sm">
                                    {contact.city &&
                                        contact.state &&
                                        contact.postal_code &&
                                        `${contact.city}, ${contact.state} ${contact.postal_code}`}
                                </p>
                                <p className="text-sm">{contact.country}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Additional Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">
                                    Confidence Score
                                </p>
                                <div>
                                    {contact.confidence_score != null && (
                                        <span>
                                            {contact.confidence_score.toFixed(
                                                0
                                            )}
                                            %
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
