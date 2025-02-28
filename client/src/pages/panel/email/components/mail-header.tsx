import { Mail as MailIcon, PenBox, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mail } from "@/types/mail";

interface MailHeaderProps {
    selectedMail: Mail | null;
    activeView?: "mail" | "contacts";
    onUploadClick?: () => void;
    onAddContactClick?: () => void;
}

export default function MailHeader({
    selectedMail,
    activeView = "mail",
    onUploadClick,
    onAddContactClick,
}: MailHeaderProps) {
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="flex items-center justify-between p-6">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {activeView === "mail"
                                ? "Company Communications"
                                : "Contact Management"}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {activeView === "mail"
                                ? "Manage correspondence with potential sponsors and partners"
                                : "Manage and organize your contacts database"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeView === "mail" ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() =>
                                        (window.location.href = "/compose")
                                    }
                                >
                                    <PenBox className="h-4 w-4" />
                                    Compose
                                </Button>
                                {selectedMail && (
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() =>
                                            (window.location.href = `/compose?to=${selectedMail.to[0]?.email}`)
                                        }
                                    >
                                        <MailIcon className="h-4 w-4" />
                                        Reply
                                    </Button>
                                )}
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={onAddContactClick}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Add Contact
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={onUploadClick}
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Contacts
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
