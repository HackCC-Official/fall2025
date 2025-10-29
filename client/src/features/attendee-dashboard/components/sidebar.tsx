import { navItems } from "../data/attendee-dashboard";
import { NavItem } from "../types/attendee-dashboard";

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
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all
                    ${isActive
                        ? 'bg-yellow-400 text-black shadow-lg'
                        : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                    }
                `}
            >
                <item.icon size={20} />
                <span>{item.label}</span>
            </button>
        );
    };

    return (
        <aside className={`
            ${isOpen ? 'block' : 'hidden'} md:block
            w-full md:w-64 bg-purple-950 text-white p-6 
            flex-shrink-0 flex flex-col gap-6 
            border-b md:border-b-0 md:border-r border-purple-700
        `}>
            
            {/* --- CHANGE 1: Logo component removed --- */}
            {/* <Logo className="mx-auto w-auto h-20" /> */}
            
            {/* Added a spacer div to maintain some top padding */}
            <div className="mx-auto w-auto h-20" /> 
            
            <nav className="flex flex-col gap-4 mt-2"> 
                {navItems.map(item => (
                    <NavLink key={item.id} item={item} />
                ))}
            </nav>
        </aside>
    );
};