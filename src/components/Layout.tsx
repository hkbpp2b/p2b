import React, { useState, useEffect } from 'react';
import { Home, Presentation, QrCode, CalendarDays, Newspaper } from 'lucide-react';
import logoHkbp from '../assets/1.png';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    title: string; // Tambahkan title di interface
}

const Layout = ({ children, activeTab, setActiveTab, title }: LayoutProps) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menus = [
        { id: 'warta', label: 'Warta', icon: <Newspaper size={22} /> },
        { id: 'ibadah', label: 'Ibadah', icon: <Presentation size={22} /> },
        { id: 'profil', label: 'Profil', icon: <Home size={22} /> },
        { id: 'giving', label: 'Persembahan', icon: <QrCode size={22} /> },
        { id: 'other', label: 'Lainnya', icon: <CalendarDays size={22} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">

            {/* HEADER PC */}
            <header className="hidden md:flex sticky top-0 z-[120] bg-white/80 backdrop-blur-md border-b border-slate-200 px-12 py-4 justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <img src={logoHkbp} alt="Logo" className="w-10 h-10 object-contain" />
                    <h1 className="font-black text-xl tracking-tight text-blue-800 uppercase">HKBP Perumnas 2 Bekasi</h1>
                </div>
                <nav className="flex gap-8">
                    {menus.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveTab(m.id)}
                            className={`font-bold text-sm uppercase tracking-widest transition-all py-2 border-b-2 ${activeTab === m.id ? 'text-blue-600 border-blue-600' : 'text-slate-900 border-transparent hover:text-slate-900'}`}
                        >
                            {m.label}
                        </button>
                    ))}
                </nav>
            </header>

            {/* HEADER MOBILE (Dinamis: HKBP -> JUDUL LAYAR) */}
            <header
                className={`md:hidden fixed top-0 left-0 right-0 z-[100] transition-all duration-300 flex flex-col items-center justify-center ${isScrolled
                    ? 'py-5 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm'
                    : 'py-12 bg-slate-50'
                    }`}
            >
                <div className="text-center">
                    {/* Tulisan berubah dari HKBP jadi Title saat scroll */}
                    <h1 className={`text-blue-900 font-black tracking-tighter transition-all duration-300 uppercase ${isScrolled ? 'text-lg tracking-[0.3em]' : 'text-4xl'
                        }`}>
                        {isScrolled ? title : 'HKBP'}
                    </h1>

                    {/* Deskripsi bawah menghilang saat scroll */}
                    <div className={`transition-all duration-300 origin-top ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto mt-2'
                        }`}>
                        <p className="text-slate-900 font-bold tracking-[0.4em] uppercase 2xl">
                            Perumnas 2 Bekasi
                        </p>
                    </div>
                </div>
            </header>

            {/* ISI KONTEN */}
            <main className={`flex-1 max-w-7xl mx-auto p-4 md:p-6 pb-40 transition-all duration-500 ${isScrolled ? 'md:mt-0 mt-24' : 'md:mt-0 mt-36'}`}>
                {children}
            </main>

            {/* NAVIGASI BAWAH MOBILE */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[110] bg-white border-t border-slate-100 px-2 py-4 pb-4 shadow-sm">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    {menus.map((m) => {
                        const isActive = activeTab === m.id;

                        return (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40'
                                    }`}
                            >
                                {m.id === 'profil' ? (
                                    /* PROFIL: Posisi naik tanpa glow/aura */
                                    <div className="relative flex flex-col items-center">
                                        <img
                                            src={logoHkbp}
                                            alt="Profil"
                                            // -mt-5 menaikkan posisi ke tengah, w-14 untuk ukuran dominan
                                            className={`w-12 h-12 object-contain transition-all duration-300 -mt-1 ${isActive
                                                ? 'scale-110'
                                                : 'grayscale-[0.1]'
                                                }`}
                                        />
                                    </div>
                                ) : (
                                    /* MENU LAIN: Tetap sejajar di bawah */
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-900'}`}>
                                            {React.cloneElement(m.icon as React.ReactElement, {
                                                size: 22,
                                                strokeWidth: isActive ? 2.5 : 2
                                            })}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-slate-900'
                                            }`}>
                                            {m.label}
                                        </span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>

        </div>
    );
};

export default Layout;