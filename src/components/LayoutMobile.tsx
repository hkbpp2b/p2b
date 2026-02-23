// LayoutMobile.tsx
import React, { useState, useEffect } from 'react';
import logoHkbp from '../assets/Logo1.png';

interface LayoutMobileProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    title: string;
    menus: any[];
}

const LayoutMobile = ({ children, activeTab, setActiveTab, title, menus }: LayoutMobileProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const isHomePage = activeTab === 'profil';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:hidden">
            {isHomePage && (
                <header className={`fixed top-0 left-0 right-0 z-[100] flex flex-col items-center justify-center ${isScrolled
                    ? 'py-5 bg-white border-b border-slate-200/60 shadow-sm'
                    : 'py-12 bg-slate-50'
                    }`}>
                    <h1 className={`text-blue-900 font-black tracking-tighter uppercase ${isScrolled ? 'text-lg tracking-[0.3em]' : 'text-4xl'
                        }`}>
                        {isScrolled ? title : 'HKBP'}
                    </h1>
                    {!isScrolled && (
                        <p className="text-slate-900 font-bold tracking-[0.4em] uppercase text-xs mt-2">
                            Perumnas 2 Bekasi
                        </p>
                    )}
                </header>
            )}

            <main className={`flex-1 p-4 pb-24 ${!isHomePage ? 'mt-4' : isScrolled ? 'mt-24' : 'mt-36'}`}>
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-[110] bg-white border-t border-slate-100 pt-3 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <div className="grid grid-cols-5 w-full max-w-md mx-auto items-end">
                    {menus.map((m) => {
                        const isActive = activeTab === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className="flex flex-col items-center justify-center pb-1"
                            >
                                <div className={`mb-1 ${isActive ? 'text-blue-600' : 'text-slate-900 opacity-40'}`}>
                                    {m.id === 'profil' ? (
                                        <img
                                            src={logoHkbp}
                                            alt="Home"
                                            className={`w-11 h-11 object-contain ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                        />
                                    ) : (
                                        React.cloneElement(m.icon as React.ReactElement, {
                                            size: 22,
                                            strokeWidth: isActive ? 3 : 2
                                        })
                                    )}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-slate-900 opacity-40'
                                    }`}>
                                    {m.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default LayoutMobile;