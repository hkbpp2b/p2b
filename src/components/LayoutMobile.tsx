// src/components/LayoutMobile.tsx
import React from 'react';
import logoHkbp from '../assets/Logo1.png';

interface LayoutMobileProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    title: string;
    menus: any[];
}

const LayoutMobile = ({ children, activeTab, setActiveTab, title, menus }: LayoutMobileProps) => {
    const isHomePage = activeTab === 'profil';

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col md:hidden">
            {/* Header Biasa (Static) - Akan ikut hilang saat scroll ke bawah */}
            {isHomePage && (
                <header className="flex flex-col items-center justify-center pt-12 pb-6 bg-white">
                    <h1 className="text-blue-900 font-black tracking-tighter uppercase text-4xl">
                        HKBP
                    </h1>
                    <p className="text-slate-900 font-bold tracking-[0.4em] uppercase text-xs mt-2">
                        Perumnas 2 Bekasi
                    </p>
                </header>
            )}

            {/* Main content tanpa margin top yang besar karena header sudah tidak fixed */}
            <main className={`flex-1 pb-24 ${!isHomePage ? 'mt-4' : ''}`}>
                {children}
            </main>

            {/* Navbar tetap Fixed di bawah agar mudah diakses jari */}
            <nav className="fixed bottom-0 left-0 right-0 z-[50] pt-1.5 pb-1.5 bg-white border-t-2 border-slate-200/60">
                <div className="grid grid-cols-5 w-full max-w-md mx-auto items-end">
                    {menus.map((m) => {
                        const isActive = activeTab === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className="flex flex-col items-center justify-center"
                            >
                                <div className={`mb-2 mt-1 flex items-center justify-center w-9 h-9 ${isActive ? 'text-blue-600' : 'text-slate-900 opacity-40'}`}>
                                    {m.id === 'profil' ? (
                                        <img
                                            src={logoHkbp}
                                            alt="Home"
                                            className={`w-10 h-10 object-contain ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                        />
                                    ) : (
                                        React.cloneElement(m.icon as React.ReactElement, {
                                            size: 26,
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