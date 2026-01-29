import { Home, Presentation, QrCode, LayoutGrid } from 'lucide-react'; // Ganti CalendarDays ke LayoutGrid

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
    const menus = [
        { id: 'profil', label: 'PROFIL', icon: <Home size={20} /> },
        { id: 'ibadah', label: 'IBADAH', icon: <Presentation size={20} /> },
        { id: 'giving', label: 'GIVING', icon: <QrCode size={20} /> },
        { id: 'other', label: 'LAINNYA', icon: <LayoutGrid size={20} /> }, // Ubah ID, Label, dan Icon
    ];

    return (
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 flex justify-around rounded-b-[2.5rem] z-[100]">
            {menus.map((menu) => (
                <button
                    key={menu.id}
                    onClick={() => setActiveTab(menu.id)}
                    className={`flex flex-col items-center transition-all ${activeTab === menu.id ? 'text-blue-600 scale-110' : 'text-slate-400'
                        }`}
                >
                    {menu.icon}
                    <span className="text-[10px] font-bold mt-1 tracking-tighter">{menu.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;