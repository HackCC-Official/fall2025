import { Download } from "lucide-react";
import { mockUser } from "../data/attendee-dashboard";
import { QRCodeSection } from "./qr-code-section";

export function ProfileSection() {
    return (
        <div>
            {/* This h1 is just for the text, and it's correct as-is! */}
            <h1 className="mb-8 font-mont text-white text-2xl sm:text-3xl md:text-4xl">
                Your Profile
            </h1>
            <div className="bg-gradient-to-br from-[#4A376B] to-[#5C4580] shadow-2xl mx-auto border border-[#523B75] rounded-3xl max-w-md overflow-hidden">
                {/* Badge Header */}
                <div className="bg-[#5C4580]/50 p-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-mont font-bold text-white text-2xl">HackCC 2025</h3>
                        <span className="bg-yellow-400 px-3 py-1 rounded-full font-mont font-semibold text-black text-sm">
                            Attendee
                        </span>
                    </div>
                </div>

                {/* QR Code and User Info */}
                <QRCodeSection user={mockUser} />

                {/* Pass Footer / Actions */}
                <div className="bg-[#5C4580]/50 p-6 border-[#523B75] border-t">
                    <button className="flex justify-center items-center gap-2 bg-yellow-400 hover:bg-yellow-500 focus:ring-opacity-50 shadow-md px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full font-mont font-semibold text-black transition-all">
                        <Download size={18} />
                        Download Pass
                    </button>
                </div>
            </div>
        </div>
    );
};