import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
import { NavUser } from "./nav-user";
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import defaultPic from '../../../public/default.jpg'
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";

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
    const [user, setUser] = useState<User | null>(null);
    const supabase = getBrowserClient()
    const router = useRouter();

    useEffect(() => {
      const fetchUser = async () => {
        // Fetch the user's session
        const { data: { session } } = await supabase.auth.getSession();
  
        if (session) {
          // Fetch the user object
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
        }
      };
  
      fetchUser();
    }, [supabase]);

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        console.log(error)
        router.push('/')
      }


    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-4 aspect-square text-sidebar-primary-foreground">
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
            <SidebarFooter>
                <NavUser 
                    user={{
                        name: 'Test',
                        email: user?.email || '',
                        avatar: defaultPic.src
                    }} 
                    signOut={signOut}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
