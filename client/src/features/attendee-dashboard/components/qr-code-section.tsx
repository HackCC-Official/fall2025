import { User } from "../types/attendee-dashboard";

export function QRCodeSection ({ user } : { user: User }) {
    return (
        <div className="flex flex-col items-center p-6 sm:p-8">
            {/* QR Code Placeholder */}
            <div className="bg-white shadow-inner p-4 rounded-xl">
                <div className="flex justify-center items-center bg-gray-100 rounded-lg w-40 sm:w-48 h-40 sm:h-48 text-gray-400">
                    {/* Placeholder for QR Code image */}
                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 17h2v-2h-2v2zm0-4h2v-2h-2v2zm4 0h2v-2h-2v2zm0 4h2v-2h-2v2zM5 19h2v-2H5v2zm0-4h2v-2H5v2zm0-4h2v-2H5v2zm0-4h2V5H5v2zm8-2v2h2V5h-2zm-4 0v2h2V5H9zm8 0v2h2V5h-2zM3 3h8v8H3V3zm2 2h4v4H5V5zm12-2v8h-8V3h8zm-2 2h-4v4h4V5zM3 13h8v8H3v-8zm2 2h4v4H5v-4zm12-2v8h-8v-8h8zm-2 2h-4v4h4v-4z"/>
                    </svg>
                </div>
            </div>

            {/* User Info */}
            <h2 className="mt-6 font-mont font-bold text-white text-3xl tracking-tight">
                {user.username}
            </h2>
            <p className="font-mont font-medium text-yellow-400 text-xl">
                {user.teamName || 'Solo Hacker'}
            </p>
        </div>
    );
};