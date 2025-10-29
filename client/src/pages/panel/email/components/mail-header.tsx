import { PenBox, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mail } from "@/types/mail";

interface MailHeaderProps {
    selectedMail: Mail | null;
    activeView?: "mail" | "contacts";
    onUploadClick?: () => void;
    onAddContactClick?: () => void;
}

export default function MailHeader({
    activeView = "mail",
    onUploadClick,
    onAddContactClick,
}: MailHeaderProps) {
    return (
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b">
            <div className="mx-auto w-full max-w-[1400px]">
                <div className="flex justify-between items-center gap-2 p-4 lg:p-6">
                    <div>
                        <h2 className="font-semibold text-lg lg:text-2xl tracking-tight">
                            {activeView === "mail"
                                ? "Inbox"
                                : "Contact Management"}
                        </h2>
                        <p className="mt-1 text-muted-foreground text-xs lg:text-base">
                            {activeView === "mail"
                                ? "Manage your email communications and outreach campaigns"
                                : "Manage and organize your contacts database"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeView !== "mail" && (
                            <>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={onAddContactClick}
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add Contact
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={onUploadClick}
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Contacts
                                </Button>
                            </>
                        )}
                        <Button
                            variant="default"
                            className="gap-2"
                            onClick={() =>
                                (window.location.href = "/panel/email/compose")
                            }
                        >
                            <PenBox className="w-4 h-4" />
                            Compose
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
