import { AccountDTO } from "@/features/account/types/account-dto";

export function QRCodeSection({ user, qrCodeSrc, isLoading }: { user?: AccountDTO, qrCodeSrc?: string, isLoading: boolean }) {
    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center p-6 sm:p-8">
                {/* QR Code Skeleton */}
                <div className="bg-white/5 shadow-inner p-4 rounded-xl animate-pulse">
                    <div className="flex justify-center items-center bg-white/10 rounded-lg w-40 sm:w-48 h-40 sm:h-48">
                        <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 3h8v8H3V3zm2 2h4v4H5V5zm12-2v8h-8V3h8zm-2 2h-4v4h4V5zM3 13h8v8H3v-8zm2 2h4v4H5v-4zm12-2v8h-8v-8h8zm-2 2h-4v4h4v-4z"/>
                        </svg>
                    </div>
                </div>

                {/* Name Skeleton */}
                <div className="bg-white/10 mt-6 rounded-lg w-48 h-9 animate-pulse"></div>
                
                {/* Role Skeleton */}
                <div className="bg-yellow-400/10 mt-2 rounded-lg w-32 h-7 animate-pulse"></div>
            </div>
        );
    }

        // Error state - no user
    if (!user && !qrCodeSrc) {
        return (
            <div className="flex flex-col items-center p-6 sm:p-8">
                <div className="bg-red-500/10 p-6 border border-red-500/20 rounded-xl max-w-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="font-mont font-bold text-red-400 text-lg">Unable to Load Profile</h3>
                    </div>
                    <p className="font-mont text-red-300/80 text-sm">
                        We couldn't load your profile information. Please try refreshing the page.
                    </p>
                </div>
            </div>
        );
    }

    // Error state - failed to load QR code
    if (!qrCodeSrc) {
        return (
            <div className="flex flex-col items-center p-6 sm:p-8">
                <div className="bg-orange-500/10 p-6 border border-orange-500/20 rounded-xl max-w-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bagel font-bold text-orange-400 text-lg">QR Code Unavailable</h3>
                    </div>
                    <p className="mb-4 font-mont text-orange-300/80 text-sm">
                        Your QR code couldn't be generated. Please contact support if this persists.
                    </p>
                    <div className="text-center">
                        <h2 className="font-mont font-bold text-white text-2xl">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="font-mont font-medium text-yellow-400 text-lg">
                            Solo Hacker
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Success state - show QR code
    return (
        <div className="flex flex-col items-center p-6 sm:p-8">
            {/* QR Code */}
            <div className="bg-white shadow-inner p-4 rounded-xl">
                <img 
                    src={qrCodeSrc} 
                    alt={`QR Code for ${user?.firstName} ${user?.lastName}`}
                    className="rounded-lg w-40 sm:w-48 h-40 sm:h-48"
                />
            </div>

            {/* User Info */}
            <h2 className="mt-6 font-mont font-bold text-white text-3xl tracking-tight">
                {user?.firstName} {user?.lastName}
            </h2>
            <p className="font-mont font-medium text-yellow-400 text-xl">
                Solo Hacker
            </p>
        </div>
    );
}