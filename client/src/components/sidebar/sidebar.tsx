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
    Users,
    Network,
    Theater,
    Ham,
} from "lucide-react";
import { LogoIcon } from "../logo-icon";
import { NavUser } from "./nav-user";
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import defaultPic from '../../../public/default.webp'
import { useRouter } from "next/router";
import { useAuthentication } from "@/features/auth/hooks/use-authentication";
import { getAccountById } from "@/features/account/api/account";
import { useQuery } from "@tanstack/react-query";
import { AccountRoles } from "@/features/account/types/account-dto";

// Updated menu items with nested structure
type MenuItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    children?: MenuItem[];
    roles?: AccountRoles[]; // Roles that can access this item
};

const items: MenuItem[] = [
    {
        title: 'QR Code',
        url: '/panel/qr-code',
        icon: QrCode,
        roles: [AccountRoles.ADMIN, AccountRoles.JUDGE, AccountRoles.ORGANIZER]
    },
    {
        title: "Application",
        url: "/panel/application",
        icon: Folders,
        roles: [AccountRoles.ADMIN]
    },
    {
        title: "Email",
        url: "/panel/email",
        icon: Mail,
        roles: [AccountRoles.ADMIN]
    },
    {
        title: "Judging",
        url: "/panel/judging",
        icon: Dices,
        roles: [AccountRoles.ADMIN]
    },
    {
        title: "Event",
        url: "/panel/event",
        icon: Calendar,
        roles: [AccountRoles.ADMIN, AccountRoles.ORGANIZER]
    },
    {
        title: "Attendance",
        url: "/panel/attendance",
        icon: QrCode,
        roles: [AccountRoles.ADMIN, AccountRoles.ORGANIZER]
    },
    {
        title: "Account",
        url: "/panel/account",
        icon: Users,
        roles: [AccountRoles.ADMIN, AccountRoles.ORGANIZER]
    },
    {
        title: "Meal",
        url: "/panel/meal",
        icon: Ham,
        roles: [AccountRoles.ADMIN, AccountRoles.ORGANIZER]
    },
    {
        title: "Team",
        url: "/panel/team",
        icon: Network,
        roles: [AccountRoles.ADMIN, AccountRoles.ORGANIZER]
    },
    {
        title: "Workshop",
        url: "/panel/workshop",
        icon: Theater,
        roles: [AccountRoles.ADMIN]
    },
];

export function AppSidebar() {
    const { user } = useAuthentication();
    const supabase = getBrowserClient()
    const router = useRouter();

    const accountQuery = useQuery({
        queryKey: ['account', user?.id || ''],
        queryFn: () => getAccountById(user?.id || ''),
        enabled: !!user?.id
    })

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        console.log(error)
        router.push('/')
    }

    // Filter menu items based on user roles
    const getFilteredItems = () => {
        const userRoles = accountQuery.data?.roles || [];
        
        // If no roles data yet, return empty array (loading state)
        if (userRoles.length === 0) {
            return [];
        }

        return items.filter((item) => {
            // If item has no role restrictions, show to everyone
            if (!item.roles || item.roles.length === 0) {
                return true;
            }
            
            // Check if user has at least one of the required roles
            return item.roles.some(role => userRoles.includes(role));
        });
    };

    const filteredItems = getFilteredItems();

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
                            {filteredItems.map((item) => (
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
                        name: accountQuery.data?.firstName || 'User',
                        email: user?.email || '',
                        avatar: defaultPic.src
                    }} 
                    signOut={signOut}
                />
            </SidebarFooter>
        </Sidebar>
    );
}