import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Mail, MapPin, Phone, User } from "lucide-react";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
interface ContactDisplayProps {
    contact: ContactDto | null;
}

export function ContactDisplay({ contact }: ContactDisplayProps) {
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
        <div className="flex flex-col h-full overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">
                        {contact.first_name} {contact.last_name}
                    </h2>
                    <p className="text-muted-foreground">{contact.position}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                    {contact.type}
                </Badge>
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
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">
                                    Department
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {contact.department}
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">Industry</p>
                                <p className="text-sm text-muted-foreground">
                                    {contact.industry}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                                {contact.city}, {contact.state}{" "}
                                {contact.postal_code}
                            </p>
                            <p className="text-sm">{contact.country}</p>
                        </div>
                    </CardContent>
                </Card>

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
