import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    Calendar,
    Dices,
    Folders,
    Mail,
    QrCode,
    LucideIcon,
} from "lucide-react";
import { LogoIcon } from "../logo-icon";

// Updated menu items with nested structure
type MenuItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    children?: MenuItem[];
};

const items: MenuItem[] = [
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
        title: "Event",
        url: "/panel/event",
        icon: Calendar,
    },
    {
        title: "Attendance",
        url: "/panel/attendance",
        icon: QrCode,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <div className="flex justify-center items-center bg-sidebar-primary rounded-lg text-sidebar-primary-foreground aspect-square size-4">
                                <LogoIcon className="h-full size-4" />
                            </div>
                            <div className="flex-1 font-semibold truncate">
                                HackCC Admin Panel
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lightpurple">
                        Workspace
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-2"
                                        >
                                            <item.icon className="size-4" />
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
    );
}
