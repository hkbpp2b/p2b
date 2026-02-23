// AplikasiTab.tsx
import React, { useState } from 'react';
import { Book, Music, Gamepad2 } from 'lucide-react';
import AlkitabCard from '../cards/AlkitabCard';
import BukuEndeCard from '../cards/BukuEndeCard';
import Game2048Card from '../cards/Game2048Card';

const AplikasiTab = () => {
    const [activeApp, setActiveApp] = useState<string | null>(null);

    const apps = [
        { id: 'alkitab', name: "Alkitab", icon: <Book size={24} />, color: "bg-red-500" },
        { id: 'ende', name: "Buku Ende", icon: <Music size={24} />, color: "bg-blue-500" },
        { id: '2048', name: "2048", icon: <Gamepad2 size={24} />, color: "bg-orange-500" }
    ];

    if (activeApp === 'alkitab') {
        return <AlkitabCard onBack={() => setActiveApp(null)} />;
    }

    if (activeApp === 'ende') {
        return <BukuEndeCard onBack={() => setActiveApp(null)} />;
    }


    if (activeApp === '2048') {
        return <Game2048Card onBack={() => setActiveApp(null)} />;
    }

    return (
        <div className="animate-in fade-in duration-700 pb-32 pt-8 px-5 space-y-10">
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
        </div>
    );
};

export default AplikasiTab;