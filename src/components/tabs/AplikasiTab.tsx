// AplikasiTab.tsx
import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import AlkitabCard from '../cards/AlkitabCard';
import BukuEndeCard from '../cards/BukuEndeCard';
import SaranForm from '../cards/SaranForm';
import QuizAlkitabCard from '../cards/GameQuizAlkitabCard';
import Game2048Card from '../cards/Game2048Card';

interface AplikasiTabProps {
    activeTab?: string;
}

const AplikasiTab = ({ activeTab }: AplikasiTabProps) => {
    const [activeApp, setActiveApp] = useState<string | null>(null);

    const BibleCrossIcon = ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="M7 8h10" />
        </svg>
    );

    const BibleCircleIcon = ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="rounded-md">
            <path d="M 2 24 C 2 10 12 0 12 0 C 12 0 22 10 22 24" stroke="white" strokeWidth="2" strokeOpacity="0.8" fill="none" />
            <g stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="18" r="4" />
                <path d="M12 6.5v7.5M9 8.8h6" />
            </g>
        </svg>
    );

    const Game2048Icon = ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <text x="12" y="11" fill="black" fontSize="12" textAnchor="middle" fontWeight="1000" fontFamily="Arial, sans-serif" style={{ letterSpacing: '-0.5px' }}>20</text>
            <text x="12" y="22" fill="black" fontSize="12" textAnchor="middle" fontWeight="1000" fontFamily="Arial, sans-serif" style={{ letterSpacing: '-0.5px' }}>48</text>
        </svg>
    );

    const QuizAlkitabIcon = ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="red"
            />
            <rect x="11" y="6.5" width="2" height="11" fill="#ffffff" rx="0.5" />
            <rect x="8" y="8.7" width="8" height="2" fill="#ffffff" rx="0.5" />
        </svg>
    );

    useEffect(() => {
        setActiveApp(null);
    }, [activeTab]);


    const apps = [
        { id: 'alkitab', name: "Alkitab", icon: <BibleCrossIcon size={24} />, color: "bg-slate-900" },
        { id: 'ende', name: "Buku Lagu", icon: <BibleCircleIcon size={24} />, color: "bg-yellow-600" },
        { id: '2048', name: "2048", icon: <Game2048Icon size={24} />, color: "bg-slate-200" },
        // { id: 'kuis', name: "Kuitab", icon: <QuizAlkitabIcon size={24} />, color: "bg-slate-200" }
    ];

    const renderActiveApp = () => {
        switch (activeApp) {
            case 'alkitab': return <AlkitabCard onBack={() => setActiveApp(null)} />;
            case 'ende': return <BukuEndeCard onBack={() => setActiveApp(null)} />;
            case '2048': return <Game2048Card onBack={() => setActiveApp(null)} />;
            case 'kuis': return <QuizAlkitabCard onBack={() => setActiveApp(null)} />;
            case 'saran': return <SaranForm onBack={() => setActiveApp(null)} />;
            default: return null;
        }
    };

    return (
        <div className="relative min-h-[100dvh] lg:h-full w-full">
            <div className="h-full border-slate-900 pb-32 pt-8 px-5 space-y-10">
                <header className="text-center space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Aplikasi</h2>
                    <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Layanan Aplikasi Digital</p>
                </header>

                <div className="grid grid-cols-3 gap-y-10">
                    {apps.map((app) => (
                        <div key={app.id} className="flex flex-col items-center gap-3">
                            <button
                                onClick={() => setActiveApp(app.id)}
                                className="flex flex-col items-center gap-3 group"
                            >
                                <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform`}>
                                    {app.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 text-center leading-tight">
                                    {app.name}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setActiveApp('saran')}
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md flex items-center justify-between p-3 rounded-[2rem] border border-slate-400/20 transition-all hover:bg-slate-100 active:scale-[0.97] active:bg-slate-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-slate-900/20 group-hover:rotate-12 transition-transform">
                            <Lightbulb size={15} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-slate-900/20 font-bold uppercase tracking-tight">Kirim masukan/perbaikan</p>
                        </div>
                    </div>
                    <div className="border-slate-100 text-slate-900/20 group-hover:text-slate-900 transition-colors">
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