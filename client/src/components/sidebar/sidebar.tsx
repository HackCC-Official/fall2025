import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Dices, Folders, Mail, QrCode } from "lucide-react"

// Menu items.
const items = [
  {
    title: "Application",
    url: "/panel/application",
    icon: Folders,
  },
  {
    title: "Email",
    url: "/panel/email",
    icon: Mail,
  },
  {
    title: "Judging",
    url: "/panel/judging",
    icon: Dices,
  },
  {
    title: "QR Codes",
    url: "/panel/qr-code",
    icon: QrCode,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HackCC Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
