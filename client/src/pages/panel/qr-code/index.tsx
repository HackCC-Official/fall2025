import { useAuthentication } from "@/features/auth/hooks/use-authentication";
import { useQuery } from "@tanstack/react-query";
import { getQrCode } from "@/features/qr-code/api/qr-code";
import { getAccountById } from "@/features/account/api/account";
import { AccountRoles } from "@/features/account/types/account-dto";
import PanelLayout from "../layout";
import { PanelHeader } from "@/components/panel-header";
import { QRCodeSection } from "@/features/attendee-dashboard/components/qr-code-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function QrCodePage() {
    const { user } = useAuthentication()

    const accountQuery = useQuery({
        queryKey: ['account', user?.id],
        queryFn: () => getAccountById(user?.id || ''),
        enabled: !!(user && user.id)
    })
    const qrCodeQuery = useQuery({
        queryKey: ['qr-code', user?.id],
        queryFn: () => getQrCode(user?.id || ''),
        enabled: !!(user && user.id)
    })
    
    // Determine role and badge styling
    const getRoleBadge = () => {
        const roles = accountQuery.data?.roles || [];
        
        if (roles.includes(AccountRoles.ADMIN)) {
            return { label: 'Admin', variant: 'default' as const };
        }
        if (roles.includes(AccountRoles.ORGANIZER)) {
            return { label: 'Organizer', variant: 'secondary' as const };
        }
        if (roles.includes(AccountRoles.VOLUNTEER)) {
            return { label: 'Volunteer', variant: 'outline' as const };
        }
        if (roles.includes(AccountRoles.JUDGE)) {
            return { label: 'Judge', variant: 'secondary' as const };
        }
        // Default to Attendee
        return { label: 'Attendee', variant: 'outline' as const };
    };

    const badge = getRoleBadge();
    const isLoading = accountQuery.isLoading || qrCodeQuery.isLoading;

    return (
        <div className="space-y-6">
            <PanelHeader>My QR Code</PanelHeader>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">
                                {isLoading ? (
                                    <Skeleton className="w-48 h-8" />
                                ) : (
                                    `${accountQuery.data?.firstName} ${accountQuery.data?.lastName}`
                                )}
                            </CardTitle>
                            <CardDescription className="mt-2">
                                {isLoading ? (
                                    <Skeleton className="w-64 h-4" />
                                ) : (
                                    accountQuery.data?.email
                                )}
                            </CardDescription>
                        </div>
                        {!isLoading && (
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center space-y-4">
                            <Skeleton className="rounded-lg w-64 h-64" />
                            <Skeleton className="w-32 h-4" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            {qrCodeQuery.data?.url ? (
                                <>
                                    <div className="bg-white p-4 border rounded-lg">
                                        <img 
                                            src={qrCodeQuery.data.url} 
                                            alt="QR Code" 
                                            className="w-64 h-64"
                                        />
                                    </div>
                                    <p className="text-muted-foreground text-sm text-center">
                                        Scan this QR code for check-in and meals
                                    </p>
                                </>
                            ) : (
                                <div className="flex justify-center items-center bg-muted border rounded-lg w-64 h-64">
                                    <p className="text-muted-foreground text-sm">No QR code available</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="w-full h-4" />
                            <Skeleton className="w-3/4 h-4" />
                            <Skeleton className="w-5/6 h-4" />
                        </div>
                    ) : (
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Full Name</dt>
                                <dd className="font-medium">
                                    {accountQuery.data?.firstName} {accountQuery.data?.lastName}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd className="font-medium">{accountQuery.data?.email}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Role</dt>
                                <dd>
                                    <Badge variant={badge.variant} className="font-medium">
                                        {badge.label}
                                    </Badge>
                                </dd>
                            </div>
                        </dl>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

QrCodePage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>