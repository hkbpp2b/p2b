// src/components/LayoutMobile.tsx
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
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col md:hidden">
            {isHomePage && !isScrolled && (
                <header className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center justify-center py-12">
                    <h1 className="text-blue-900 font-black tracking-tighter uppercase text-4xl">
                        HKBP
                    </h1>
                    <p className="text-slate-900 font-bold tracking-[0.4em] uppercase text-xs mt-2">
                        Perumnas 2 Bekasi
                    </p>
                </header>
            )}

            <main className={`flex-1 p-4 pb-24 ${!isHomePage ? 'mt-4' : isScrolled ? 'mt-24' : 'mt-36'}`}>
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-[110] pt-1.5 pb-1.5 bg-white border-t-2 border-slate-200/60">
                <div className="grid grid-cols-5 w-full max-w-md mx-auto items-end">
                    {menus.map((m) => {
                        const isActive = activeTab === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className="flex flex-col items-center justify-center "
                            >
                                {/* Container Icon dengan ukuran tetap agar sejajar */}
                                <div className={`mb-2 mt-1 flex items-center justify-center w-8 h-8 ${isActive ? 'text-blue-600' : 'text-slate-900 opacity-40'}`}>
                                    {m.id === 'profil' ? (
                                        <img
                                            src={logoHkbp}
                                            alt="Home"
                                            // Ukuran disesuaikan agar seimbang dengan icon (sekitar 24px-28px)
                                            className={`w-9 h-9 object-contain ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                        />
                                    ) : (
                                        React.cloneElement(m.icon as React.ReactElement, {
                                            // Ukuran icon diseragamkan ke 24 (standar navbar)
                                            size: 24,
                                            strokeWidth: isActive ? 3 : 2
                                        } as any)
                                    )}
                                </div>


                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default LayoutMobile;