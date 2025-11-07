import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { useRouter } from "next/router";
import { AccountRoles } from "@/features/account/types/account-dto";
import { getAccountById } from "@/features/account/api/account";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authCheck, setAuthChecked] = useState(false);
    const supabase = getBrowserClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const accountData = await getAccountById(session?.user.id || '');

            if (!session) {
                router.push('/register');
            } else if (!accountData.roles.find(r => [AccountRoles.ADMIN, AccountRoles.ORGANIZER, AccountRoles.JUDGE].includes(r))) {
                router.push('/')
            } else {
                setAuthChecked(true);
            }
        };

        checkAuth();
    }, [router, supabase.auth]);


    if (!authCheck) {
        return (
            <div className="place-content-center grid w-full h-screen">
                <Spinner className="w-60 h-60" />
            </div>
        )
    }

    return (
        <SidebarProvider
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <AppSidebar />
            <main className="flex flex-col px-8 py-4 h-screen container">
                <SidebarTrigger />
                <div className="flex-grow mt-4">{children}</div>
            </main>
            <Toaster />
        </SidebarProvider>
    );
}