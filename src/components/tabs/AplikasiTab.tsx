// AplikasiTab.tsx
import React, { useState, useEffect } from 'react';
import { Book, Music, Gamepad2, Lightbulb, ChevronRight } from 'lucide-react';
import AlkitabCard from '../cards/AlkitabCard';
import BukuEndeCard from '../cards/BukuEndeCard';
import Game2048Card from '../cards/Game2048Card';
import SaranForm from '../cards/SaranForm';

interface AplikasiTabProps {
    activeTab?: string;
}

const AplikasiTab = ({ activeTab }: AplikasiTabProps) => {
    const [activeApp, setActiveApp] = useState<string | null>(null);

    useEffect(() => {
        setActiveApp(null);
    }, [activeTab]);

    const apps = [
        { id: 'alkitab', name: "Alkitab", icon: <Book size={24} />, color: "bg-red-500" },
        { id: 'ende', name: "Buku Ende", icon: <Music size={24} />, color: "bg-blue-500" },
        { id: '2048', name: "2048", icon: <Gamepad2 size={24} />, color: "bg-orange-500" }
    ];

    const renderActiveApp = () => {
        switch (activeApp) {
            case 'alkitab': return <AlkitabCard onBack={() => setActiveApp(null)} />;
            case 'ende': return <BukuEndeCard onBack={() => setActiveApp(null)} />;
            case '2048': return <Game2048Card onBack={() => setActiveApp(null)} />;
            case 'saran': return <SaranForm onBack={() => setActiveApp(null)} />;
            default: return null;
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="h-full overflow-y-auto animate-in fade-in duration-700 pb-32 pt-8 px-5 space-y-10">
                <header className="text-center space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Aplikasi</h2>
                    <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Layanan Aplikasi Digital</p>
                </header>

                <div className="grid grid-cols-3 gap-6">
                    {apps.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => setActiveApp(app.id)}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform`}>
                                {app.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">{app.name}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setActiveApp('saran')}
                    className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 border border-slate-400/20 transition-all hover:bg-slate-100 active:scale-[0.97] active:bg-slate-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full bg-slate-100/50 flex items-center justify-center text-slate-900/20 group-hover:rotate-12 transition-transform">
                            <Lightbulb size={15} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-slate-900/20 font-bold uppercase tracking-tight">Kirim masukan/perbaikan</p>
                        </div>
                    </div>
                    <div className=" border-slate-100 text-slate-900/20 group-hover:text-slate-900 transition-colors">
                        <ChevronRight size={16} />
                    </div>
                </button>
            </div>

            {activeApp && (
                <div className="fixed inset-0 z-[100] lg:absolute lg:inset-0 lg:z-[40] bg-white overflow-y-auto px-5 pt-8 animate-in slide-in-from-right duration-300">
                    <div className="w-full">
                        {renderActiveApp()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AplikasiTab;