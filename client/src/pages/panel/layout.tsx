import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/sidebar/sidebar";

export default function PanelLayout({ children } : { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
