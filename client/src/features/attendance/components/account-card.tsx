import { ScannerContext } from "@/features/qr-code/components/qr-code-scanner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ContactBadge, EmailBadge, SchoolBadge } from "@/features/application/components/application-status";
import { ApplicationResponseDTO } from "@/features/application/types/application";
import { useContext } from "react";

export function AccountCard() {
  const { application, isLoading } = useContext(ScannerContext)
  if (isLoading) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader></CardHeader>
        <CardContent>
          <Spinner />
        </CardContent>
      </Card>
    )
  }
  if (!application) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="text-3xl">{"Account not found :("}</div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="font-semibold text-2xl">
            {application.user.firstName} {application.user.lastName}
          </div> 
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <EmailBadge>
            {application.email}
          </EmailBadge>
          <SchoolBadge>
            {application.school}
          </SchoolBadge>
          <ContactBadge>
            {application.phoneNumber}
          </ContactBadge>
          <Badge>ID: {application.user.id}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}