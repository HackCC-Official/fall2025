import { Download } from "lucide-react";
import { mockUser } from "../data/attendee-dashboard";
import { QRCodeSection } from "./qr-code-section";
import { useAuthentication } from "@/features/auth/hooks/use-authentication";
import { useQuery } from "@tanstack/react-query";
import { getQrCode } from "@/features/qr-code/api/qr-code";
import { getAccountById } from "@/features/account/api/account";
import { AccountRoles } from "@/features/account/types/account-dto";

export function ProfileSection() {
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
            return { label: 'Admin', bgColor: 'bg-[#A649E2]', textColor: 'text-white' };
        }
        if (roles.includes(AccountRoles.ORGANIZER)) {
            return { label: 'Organizer', bgColor: 'bg-[#6950D5]', textColor: 'text-white' };
        }
        if (roles.includes(AccountRoles.VOLUNTEER)) {
            return { label: 'Volunteer', bgColor: 'bg-[#2D18A8]', textColor: 'text-white' };
        }
        if (roles.includes(AccountRoles.JUDGE)) {
            return { label: 'Judge', bgColor: 'bg-[#7F3ED0]', textColor: 'text-white' };
        }
        // Default to Attendee
        return { label: 'Attendee', bgColor: 'bg-[#FBFA74]', textColor: 'text-black' };
    };

    const badge = getRoleBadge();

    return (
        <div>
            {/* This h1 is just for the text, and it's correct as-is! */}
            <h1 className="mb-8 font-bagel font-bold text-white text-2xl sm:text-3xl md:text-4xl">
                Your QR Code
            </h1>
            <div className="bg-gradient-to-br from-[#4A376B] to-[#5C4580] shadow-2xl mx-auto border border-[#523B75] rounded-3xl max-w-md overflow-hidden">
                {/* Badge Header */}
                <div className="bg-[#5C4580]/50 p-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-mont font-bold text-white text-2xl">HackCC 2025</h3>
                        <span className={`${badge.bgColor} ${badge.textColor} px-3 py-1 rounded-full font-mont font-semibold text-sm`}>
                            {badge.label}
                        </span>
                    </div>
                </div>

                {/* QR Code and User Info */}
                <QRCodeSection 
                    user={accountQuery.data} 
                    qrCodeSrc={qrCodeQuery.data ? qrCodeQuery.data.url : undefined} 
                    isLoading={accountQuery.isLoading || qrCodeQuery.isLoading}
                /> 
            </div>
        </div>
    );
};