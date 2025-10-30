import { cn } from "@/lib/utils";
import { navItems } from "../data/attendee-dashboard";
import { NavItem } from "../types/attendee-dashboard";
import { Logo } from "@/components/logo";

export function Sidebar({ activeSection, setActiveSection, isOpen } : {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
}) {
    
    const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
        const isActive = activeSection === item.id;
        return (
            <button
                onClick={() => setActiveSection(item.id)}
                className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all ease-out
                    ${isActive
                        ? 'bg-yellow-400 text-black shadow-lg'
                        : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                    }
                `}
            >
                <item.icon strokeWidth={3} size={20} />
                <span className="font-semibold">{item.label}</span>
            </button>
        );
    };

    return (
        <aside className={cn([
            isOpen ? 'block' : 'hidden',
            'md:block font-mont rounded-2xl m-4',
            'w-full md:w-64 bg-black/20 text-white p-6',
            'flex-shrink-0 flex flex-col gap-6',
        ])}>
            
            {/* --- CHANGE 1: Logo component removed --- */}
            <Logo className="mx-auto w-auto h-32 sm:h-36 md:h-24 lg:h-24 2xl:h-36" />
            
            <nav className="flex flex-col gap-2 mt-4"> 
                {navItems.map(item => (
                    <NavLink key={item.id} item={item} />
                ))}
            </nav>
        </aside>
    );
};