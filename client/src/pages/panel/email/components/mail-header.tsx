import { Mail as MailIcon, PenBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mail } from "@/types/mail";

interface MailHeaderProps {
    selectedMail: Mail | null;
}

export default function MailHeader({ selectedMail }: MailHeaderProps) {
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="flex items-center justify-between p-6">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Company Communications
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Manage correspondence with potential sponsors and
                            partners
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => (window.location.href = "/compose")}
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
                    </div>
                </div>
            </div>
        </div>
    );
}
