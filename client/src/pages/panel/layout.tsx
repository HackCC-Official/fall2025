import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

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