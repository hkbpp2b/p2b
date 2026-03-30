// src/components/LayoutMobile.tsx
import React, { useEffect, useState } from 'react';
import logoHkbp from '../assets/Logo1.png';

interface LayoutMobileProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    title: string;
    menus: any[];
}

const LayoutMobile = ({ children, activeTab, setActiveTab, title, menus }: LayoutMobileProps) => {
    const [headerImage, setHeaderImage] = useState<string | null>(null);
    const isHomePage = activeTab === 'profil';

    const TSV_URL = import.meta.env.VITE_HERO_TSV_URL;

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const response = await fetch(TSV_URL);
                const data = await response.text();
                const rows = data.split('\n');
                if (rows.length > 1) {
                    const firstDataRow = rows[1].split('\t');
                    const imageUrl = firstDataRow[4]?.trim();
                    if (imageUrl) setHeaderImage(convertToDirectLink(imageUrl));
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        if (isHomePage) fetchHeaderData();
    }, [isHomePage]);

    const convertToDirectLink = (url: string) => {
        if (url.includes('drive.google.com')) {
            const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1];
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col md:hidden no-scrollbar">
            {/* Header dengan Tinggi Konsisten (h-40 = 160px) */}
            {isHomePage && (
                <header className="w-full h-[130px] flex items-center justify-center bg-white overflow-hidden">
                    {headerImage ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={headerImage}
                                alt="Header"
                                className="w-full h-full object-contain"
                                onError={() => setHeaderImage(null)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="text-blue-900 font-black tracking-tighter uppercase text-4xl leading-none">
                                HKBP
                            </h1>
                            <p className="text-slate-900 font-bold tracking-[0.4em] uppercase text-[10px] mt-2">
                                Perumnas 2 Bekasi
                            </p>
                        </div>
                    )}
                </header>
            )}

            <main className={`flex-1 pb-24 ${!isHomePage ? 'mt-4' : ''}`}>
                {children}
            </main>

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