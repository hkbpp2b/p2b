// AplikasiTab.tsx
import React, { useState, useEffect } from 'react';
import { Book, Music, Gamepad2, Lightbulb } from 'lucide-react';
import AlkitabCard from '../cards/AlkitabCard';
import BukuEndeCard from '../cards/BukuEndeCard';
import Game2048Card from '../cards/Game2048Card';

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

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 space-y-4">
                    <p className="text-[12px] leading-relaxed text-slate-600 font-medium">
                        Fitur ini masih dalam tahap pengembangan. Terima kasih atas kesabaran Anda.
                    </p>
                    <div className="flex items-start gap-3 p-4 rounded-2xl shadow-sm">
                        <Lightbulb size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-500 leading-snug">
                            Punya ide menarik untuk kita diskusikan bersama? Sampaikan melalui fitur <span className="font-bold text-slate-900 text-[10px] uppercase">Kritik & Saran</span>.
                        </p>
                    </div>
                </div>
            </div>

            {activeApp && (
                <div className="fixed inset-0 z-[100] lg:absolute lg:inset-0 lg:z-[40] bg-white animate-in slide-in-from-right lg:slide-in-from-none duration-300">
                    {renderActiveApp()}
                </div>
            )}
        </div>
    );
};

export default AplikasiTab;