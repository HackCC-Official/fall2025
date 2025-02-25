"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface AccountSwitcherProps {
    isCollapsed: boolean;
    accounts: {
        label: string;
        email: string;
        icon: React.ReactNode;
    }[];
    onAccountChange?: (email: string) => void;
    defaultEmail?: string;
}

export default function AccountSwitcher({
    isCollapsed,
    accounts = [],
    onAccountChange,
    defaultEmail,
}: AccountSwitcherProps) {
    const [selectedAccount, setSelectedAccount] = React.useState<string>(
        defaultEmail || accounts?.[0]?.email || ""
    );

    const handleAccountChange = (email: string) => {
        setSelectedAccount(email);
        onAccountChange?.(email);
    };

    if (!accounts?.length) {
        return null;
    }

    return (
        <Select
            defaultValue={selectedAccount}
            onValueChange={handleAccountChange}
        >
            <SelectTrigger
                className={cn(
                    "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isCollapsed &&
                        "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                )}
                aria-label="Select account"
            >
                <SelectValue placeholder="Select an account">
                    {
                        accounts.find(
                            (account) => account.email === selectedAccount
                        )?.icon
                    }
                    <span className={cn("ml-2", isCollapsed && "hidden")}>
                        {
                            accounts.find(
                                (account) => account.email === selectedAccount
                            )?.label
                        }
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account) => (
                    <SelectItem key={account.email} value={account.email}>
                        <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                            {account.icon}
                            {account.email}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
