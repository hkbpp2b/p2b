// AplikasiTab.tsx
import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import AlkitabCard from '../cards/AlkitabCard';
import SaranForm from '../cards/SaranForm';
import QuizAlkitabCard from '../cards/GameQuizAlkitabCard';
import Game2048Card from '../cards/Game2048Card';
import BukuEndeCard from '../cards/BukuEndeCard';

interface AplikasiTabProps {
    activeTab?: string;
}

const AplikasiTab = ({ activeTab }: AplikasiTabProps) => {
    const [activeApp, setActiveApp] = useState<string | null>(null);

    // --- ICON COMPONENTS ---

    const Game2048Icon = ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <text x="12" y="11" fill="white" fontSize="12" textAnchor="middle" fontWeight="1000" fontFamily="Arial, sans-serif" style={{ letterSpacing: '-0.5px' }}>20</text>
            <text x="12" y="22" fill="white" fontSize="12" textAnchor="middle" fontWeight="1000" fontFamily="Arial, sans-serif" style={{ letterSpacing: '-0.5px' }}>48</text>
        </svg>
    );

    const QuizAlkitabIcon = ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="white"
            />
            <rect x="11" y="6.5" width="2" height="11" fill="red" rx="0.5" />
            <rect x="8" y="8.7" width="8" height="2" fill="red" rx="0.5" />
        </svg>
    );

    useEffect(() => {
        setActiveApp(null);
    }, [activeTab]);

    const renderActiveApp = () => {
        switch (activeApp) {
            case 'alkitab': return <AlkitabCard onBack={() => setActiveApp(null)} />;
            case '2048': return <Game2048Card onBack={() => setActiveApp(null)} />;
            case 'kuis': return <QuizAlkitabCard onBack={() => setActiveApp(null)} />;
            case 'saran': return <SaranForm onBack={() => setActiveApp(null)} />;
            case 'ende': return <BukuEndeCard onBack={() => setActiveApp(null)} />; // Sesuaikan dengan card Lagu Anda
            default: return null;
        }
    };

    return (
        <div className="relative min-h-[100dvh] lg:h-full w-full">
            <div className="h-full border-slate-900 pb-32 pt-8 px-5 space-y-10">
                <header className="text-center space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Alkitab & Nyanyian</h2>
                    <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Akses Alkitab & Nyanyian Digital</p>
                </header>

                <div className="flex flex-col gap-y-5 items-center max-w-sm mx-auto">

                    {/* BARIS 1: ALKITAB & BIBEL */}
                    <button
                        onClick={() => setActiveApp('alkitab')}
                        className="flex flex-col items-center gap-4 group active:scale-95 transition-transform"
                    >
                        <div className="relative w-40 h-48">
                            {/* Buku Belakang (Alkitab) */}
                            <div className="absolute -left-5 top-4 w-32 h-44 bg-slate-900 rounded-sm border-l-4 border-slate-900 shadow-xl rotate-[-4deg] translate-x-[-8px]">
                                <div className="absolute inset-0 bg-gradient-to-r from-red/20 via-transparent to-transparent"></div>
                                <div className="absolute inset-x-0 top-6 flex flex-col items-center gap-1.5">
                                    <span className="text-yellow-300 text-[14px] font-bold tracking-[0.2em] font-serif border-b border-[#FFD700]/30 pb-1 px-2 uppercase">
                                        Alkitab
                                    </span>
                                    <span className="text-yellow-300 text-[6.5px] font-medium uppercase tracking-[0.1em] font-serif text-center leading-tight">
                                        Terjemahan Baru
                                    </span>
                                </div>
                                <div className="absolute bottom-3 right-3 opacity-60">
                                    <div className="w-2 h-2 rounded-full border border-yellow-300"></div>
                                </div>
                            </div>

                            {/* Buku Depan (Bibel) */}
                            <div className="absolute left-20 top-5 w-32 h-44 bg-slate-800 rounded-sm border-l-4 border-slate-900 shadow-xl rotate-[6deg] translate-x-[-8px]">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
                                <div className="absolute inset-x-0 top-6 flex flex-col items-center gap-1.5">
                                    <span className="text-[#FFD700] text-[14px] font-bold tracking-[0.2em] font-serif border-b border-[#FFD700]/30 pb-1 px-2 uppercase">
                                        Bibel
                                    </span>
                                    <span className="text-[#FFD700]/60 text-[6.5px] font-medium uppercase tracking-[0.1em] font-serif text-center leading-tight">
                                        Batak Toba
                                    </span>
                                </div>
                                <div className="absolute bottom-3 right-3 opacity-60">
                                    <div className="w-2 h-2 rounded-full border border-[#FFD700]/90"></div>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 text-center leading-tight">
                            Alkitab & Bibel
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveApp('ende')}
                        className="flex flex-col items-center gap-4 group active:scale-95 transition-transform w-full pt-9"
                    >
                        <div className="relative w-56 h-48 flex justify-center items-end ">
                            {/* Buku 1: KJ (Kiri - Hijau) */}
                            <div className="absolute -right-10 bottom-1 w-34 h-48 bg-[#15803d] rounded-sm border-l-[4px] border-[#14532d] shadow-xl rotate-[8deg] z-30">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/5"></div>
                                <div className="absolute inset-x-0 top-5 flex flex-col items-center px-1">
                                    <span className="text-[#fbbf24] text-[12px] font-bold tracking-[0.1em] font-serif text-center uppercase leading-tight">
                                        Kidung<br />Jemaat
                                    </span>
                                </div>
                                <div className="absolute bottom-3 right-3 opacity-60">
                                    <div className="w-2 h-2 rounded-full border border-white/90 shadow-[0_0_3px_rgba(255,255,255,0.4)]"></div>
                                </div>
                            </div>

                            {/* Buku 2: BE (Tengah - Hitam - Paling Depan) */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-34 h-48 bg-blue-700 rounded-sm border-l-[4px] border-blue-900 shadow-xl z-30">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/5"></div>
                                <div className="absolute inset-x-0 top-6 flex flex-col items-center px-1">
                                    <span className="text-slate-100 text-[12px] font-bold tracking-[0.15em] font-serif text-center uppercase leading-tight">
                                        Buku <br />Nyanyian <br /> HKBP
                                    </span>
                                </div>
                                <div className="absolute bottom-3 right-3 opacity-60">
                                    <div className="w-2 h-2 rounded-full border border-white/90 shadow-[0_0_3px_rgba(255,255,255,0.4)]"></div>
                                </div>
                                <div className="absolute right-0 inset-y-0 w-[1px] bg-white/10"></div>
                            </div>

                            {/* Buku 3: BN (Kanan - Biru) */}
                            <div className="absolute -left-10 bottom-1 w-34 h-48 bg-slate-900 rounded-sm border-l-[4px] border-slate-900 shadow-xl rotate-[-2deg] z-30">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/5"></div>
                                <div className="absolute inset-x-0 top-5 flex flex-col items-center px-1">
                                    <span className="text-slate-100 text-[13px] pt-2 font-bold tracking-[0.1em] font-serif text-center uppercase leading-tight">
                                        Buku Ende
                                    </span>
                                </div>
                                <div className="absolute bottom-3 right-3 opacity-60">
                                    <div className="w-2 h-2 rounded-full border border-white/90 shadow-[0_0_3px_rgba(255,255,255,0.4)]"></div>
                                </div>
                            </div>
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 text-center leading-tight">
                            Buku Lagu (BE, BN, KJ)
                        </span>
                    </button>


                    {/* BARIS 3: GAME (Redesigned as Small Pocket Books) */}
                    <div className="flex justify-center gap-3 w-full px-4 pt-20 -mt-4">
                        {/* 2048 - Blue Pocket Note */}
                        <button
                            onClick={() => setActiveApp('2048')}
                            className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                        >
                            <div className="relative w-20 h-24 bg-blue-600 rounded-sm border-l-[5px] border-blue-600 shadow-xl rotate-[-2deg] flex flex-col items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                <div className="z-10 flex flex-col items-center scale-90">
                                    <span className="text-white font-black text-base leading-none tracking-tighter">20</span>
                                    <span className="text-white font-black text-base leading-none tracking-tighter">48</span>
                                </div>
                                {/* Aksen Jahitan/Buku Saku */}
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-800 group-hover:text-slate-900">2048</span>
                        </button>

                        {/* Kuitab - Red Pocket Bible with Heart & Cross */}
                        <button
                            onClick={() => setActiveApp('kuis')}
                            className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                        >
                            <div className="relative w-20 h-24 bg-red-700 rounded-sm border-l-[5px] border-red-800 shadow-xl rotate-[2deg] flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>

                                {/* Logo Hati & Salib */}
                                <div className="z-10 flex flex-col items-center gap-1.5 scale-90">
                                    <div className="relative w-7 h-7 flex items-center justify-center">
                                        {/* Icon Hati */}
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="white"
                                            className="w-full h-full drop-shadow-sm"
                                        >
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        {/* Icon Salib (di dalam hati) */}
                                        <div className="absolute inset-0 flex items-center justify-center pb-1">
                                            <div className="relative w-2.5 h-4">
                                                <div className="absolute top-1 left-0 w-full h-[1.5px] bg-red-800 rounded-full"></div>
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1.5px] bg-red-800 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-white font-serif font-bold text-[8px] tracking-tight uppercase border-t border-white/20 pt-0.5">Kuitab</span>
                                </div>

                                {/* Pembatas Buku Kecil */}
                                <div className="absolute top-0 right-3 w-1.5 h-4 bg-yellow-500/40 shadow-sm"></div>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-800 group-hover:text-slate-900">Kuitab</span>
                        </button>
                    </div>
                </div>

                {/* TOMBOL SARAN */}
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

            {/* OVERLAY APP */}
            {activeApp && (
                <div className="fixed inset-0 z-[100] lg:absolute lg:inset-0 lg:z-[40] bg-white overflow-y-auto pt-3 animate-in slide-in-from-right duration-300">
                    <div className="w-full">
                        {renderActiveApp()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AplikasiTab;