import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function PanelLayout({ children } : { children: React.ReactNode }) {
  return (
    <SidebarProvider className={`${geistSans.variable} ${geistMono.variable}`}>
      <AppSidebar />
      <main className='p-4 w-full h-full'>
        <SidebarTrigger />
        <div className="mt-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
