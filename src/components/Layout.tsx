import React, { useState, useEffect } from 'react';
import { Home, Presentation, QrCode, CalendarDays, Newspaper, Timer, FileClock } from 'lucide-react';
import logoHkbp from '../assets/1.png';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    title: string;
}

const Layout = ({ children, activeTab, setActiveTab, title }: LayoutProps) => {
    const [isScrolled, setIsScrolled] = useState(false);

    // --- LOGIC TOMBOL BACK HP ---
    useEffect(() => {
        // Setiap tab berubah, masukkan state baru ke history
        window.history.pushState({ activeTab }, "");

        const handleBackButton = (event: PopStateEvent) => {
            // 1. Cek apakah ada overlay yang terbuka (kita tandai dengan class khusus nanti)
            const isOverlayOpen = document.body.classList.contains('modal-open');

            if (isOverlayOpen) {
                // Jika overlay terbuka, biarkan overlay yang menangani back-nya
                // Layout diam saja, jangan munculkan confirm.
                return;
            }

            if (activeTab !== 'profil') {
                setActiveTab('profil');
            } else {
                const confirmExit = window.confirm("Ingin menutup aplikasi?");
                if (!confirmExit) {
                    window.history.pushState({ activeTab: 'profil' }, "");
                } else {
                    window.history.back();
                }
            }
        };

        window.addEventListener('popstate', handleBackButton);
        return () => window.removeEventListener('popstate', handleBackButton);
    }, [activeTab, setActiveTab]);
    // ----------------------------

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menus = [
        { id: 'warta', label: 'TBA', icon: <FileClock size={22} /> },
        { id: 'ibadah', label: 'Dokumen', icon: <Newspaper size={22} /> },
        { id: 'profil', label: 'Home', icon: <Home size={22} /> },
        { id: 'giving', label: 'Persembahan', icon: <QrCode size={22} /> },
        { id: 'other', label: 'Lainnya', icon: <CalendarDays size={22} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            {/* HEADER PC */}
            {/* HEADER PC */}
            <header className="hidden md:flex sticky top-0 z-[120] bg-white/80 backdrop-blur-md border-b border-slate-200 px-12 py-4 justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <img src={logoHkbp} alt="Logo" className="w-10 h-10 object-contain" />
                    <h1 className="font-black text-xl tracking-tight text-blue-900 uppercase">HKBP Perumnas 2 Bekasi</h1>
                </div>
                <nav className="flex gap-8">
                    {menus.map((m) => {
                        const isActive = activeTab === m.id;

                        // Semua menu (termasuk profil) tampil sebagai teks saja di Desktop
                        return (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className={`font-black text-xs uppercase tracking-[0.2em] transition-all py-2 border-b-2 ${isActive
                                    ? 'text-blue-700 border-blue-700'
                                    : 'text-slate-900 border-transparent hover:border-slate-300'
                                    }`}
                            >
                                {m.label}
                            </button>
                        );
                    })}
                </nav>
            </header>

            {/* HEADER MOBILE */}
            <header
                className={`md:hidden fixed top-0 left-0 right-0 z-[100] transition-all duration-300 flex flex-col items-center justify-center ${isScrolled
                    ? 'py-5 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm'
                    : 'py-12 bg-slate-50'
                    }`}
            >
                <div className="text-center">
                    <h1 className={`text-blue-900 font-black tracking-tighter transition-all duration-300 uppercase ${isScrolled ? 'text-lg tracking-[0.3em]' : 'text-4xl'}`}>
                        {isScrolled ? title : 'HKBP'}
                    </h1>
                    <div className={`transition-all duration-300 origin-top ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto mt-2'}`}>
                        <p className="text-slate-900 font-bold tracking-[0.4em] uppercase text-xs">
                            Perumnas 2 Bekasi
                        </p>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT - Perhatikan perubahan pb-40 jadi pb-10 */}
            <main className={`flex-1 max-w-7xl mx-auto p-4 md:p-6 pb-5 transition-all duration-500 w-full ${isScrolled ? 'md:mt-0 mt-24' : 'md:mt-0 mt-36'}`}>
                {children}
            </main>

            {/* WRAPPER FOOTER & NAV - Agar nempel ke bawah layar */}
            <div className="mt-auto">
                {/* FOOTER - Dibuat tipis dan mepet ke Navigasi */}
                <footer className="py-4 text-center border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em]">
                        Crafted by Mulmed Team
                    </p>
                </footer>

                {/* NAVIGASI BAWAH MOBILE */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[110] bg-white border-t border-slate-100 pt-3 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-5 w-full max-w-md mx-auto items-end">
                        {menus.map((m) => {
                            const isActive = activeTab === m.id;

                            if (m.id === 'profil') {
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => setActiveTab(m.id)}
                                        className="flex flex-col items-center justify-center relative pb-1"
                                    >
                                        <div className={`transition-all duration-300 transform ${isActive ? 'scale-110 opacity-100' : 'opacity-50 scale-100'}`}>
                                            <img
                                                src={logoHkbp}
                                                alt="Profil"
                                                className="w-11 h-11 object-contain mb-0.5"
                                            />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-slate-900 opacity-40'}`}>
                                            {m.label}
                                        </span>
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveTab(m.id)}
                                    className="flex flex-col items-center justify-center pb-1"
                                >
                                    <div className={`mb-1 transition-all duration-300 ${isActive ? 'text-blue-600 scale-110 opacity-100' : 'text-slate-900 opacity-40'}`}>
                                        {React.cloneElement(m.icon as React.ReactElement, {
                                            size: 22,
                                            strokeWidth: isActive ? 3 : 2
                                        })}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-slate-900 opacity-40'}`}>
                                        {m.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

            </div>

        </div >
    );
};

export default Layout;