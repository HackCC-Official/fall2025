import { cn } from "@/lib/utils";
import { navItems } from "../data/attendee-dashboard";
import { NavItem } from "../types/attendee-dashboard";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen } : {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) {
    const router = useRouter();
    
    const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
        const isActive = activeSection === item.id;
        return (
            <button
                onClick={() => {
                    setActiveSection(item.id);
                }}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg w-full font-medium text-left transition-all ease-out",
                    isActive
                        ? "bg-[#FBF574] text-black shadow-lg"
                        : "text-gray-300 hover:bg-purple-900/80 hover:text-white"
                )}
            >
                <item.icon strokeWidth={3} size={20} />
                <span className="font-semibold">{item.label}</span>
            </button>
        );
    };

    const SidebarContent = () => (
        <>
            <Logo className="mx-auto w-auto h-24 sm:h-24 md:h-24 lg:h-24 2xl:h-36" />
            
            <nav className="flex flex-col gap-2 mt-4"> 
                {navItems.map(item => (
                    <NavLink key={item.id} item={item} />
                ))}
            </nav>

            {/* Back Button - Inside Sidebar */}
            <button
                onClick={() => router.push("/")}
                className="flex justify-center items-center gap-2 bg-black/30 hover:bg-purple-900/80 mt-auto px-4 py-3 pt-4 rounded-xl w-full font-medium text-white transition-colors"
                aria-label="Back to home"
            >
                <ArrowLeft size={20} strokeWidth={2.5} />
                <span>Go to Homepage</span>
            </button>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <button
                        className="md:hidden top-4 right-4 z-50 fixed bg-black/20 hover:bg-purple-800 backdrop-blur-sm p-2 rounded-lg text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} strokeWidth={2.5} />
                    </button>
                </SheetTrigger>
                <SheetContent 
                    side="right" 
                    className="flex flex-col bg-black/20 backdrop-blur-sm p-6 border-0 w-72 font-mont text-white"
                >
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden md:flex m-4 rounded-2xl font-mont",
                "w-64 bg-black/20 text-white p-6",
                "flex-shrink-0 flex-col gap-6"
            )}>
                <SidebarContent />
            </aside>
        </>
    );
}