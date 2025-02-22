import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownMenuItem = {
    title: string;
    url: string;
    icon: LucideIcon;
};

type SidebarDropdownProps = {
    icon: LucideIcon;
    title: string;
    items: DropdownMenuItem[];
};

export function SidebarDropdown({
    icon: Icon,
    title,
    items,
}: SidebarDropdownProps) {
    return (
        <>
            <SidebarMenuButton className="w-full justify-between border-l-2 border-transparent hover:border-primary/50 hover:bg-accent">
                <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span className="font-medium">{title}</span>
                </div>
            </SidebarMenuButton>
            <SidebarMenu className="pl-4 space-y-0.5">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            className={cn(
                                "group relative transition-all duration-200",
                                "before:absolute before:left-0 before:w-0.5 before:h-full before:bg-primary/50 before:opacity-0 hover:before:opacity-100",
                                "border-l border-border/50"
                            )}
                        >
                            <a
                                href={item.url}
                                className="flex items-center gap-2 pl-4 py-1.5"
                            >
                                <item.icon className="size-3.5 text-muted-foreground group-hover:text-primary" />
                                <span className="text-sm text-muted-foreground group-hover:text-primary">
                                    {item.title}
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </>
    );
}
