// LayoutDesktop.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import logoDua from '../assets/logo 3.webp';

interface LayoutDesktopProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    menus?: any[];
}

const LayoutDesktop = ({ children, activeTab, setActiveTab, menus = [] }: LayoutDesktopProps) => {
    const isHomePage = activeTab === 'profil';
    const [isOpen, setIsOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeLabel = menus.find(m => m.id === activeTab)?.label || 'Menu';

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const closeDropdown = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', closeDropdown);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', closeDropdown);
        };
    }, []);

    const breakpoint = 1100;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans hidden md:flex flex-col">
            <header className="sticky top-0 z-[120] bg-white/80 backdrop-blur-md border-b border-slate-200 px-12 flex items-center shadow-sm h-20">
                <div className="flex items-center gap-3 w-1/3">
                    <img src={logoDua} alt="Logo 3" className="w-auto h-20 object-contain" />
                </div>

                <div className="flex-1 flex justify-center items-center">
                    <h1 className="font-black text-xl tracking-tight text-blue-900 uppercase leading-none whitespace-nowrap">
                        HKBP Perumnas 2 Bekasi
                    </h1>
                </div>

                <nav className="flex items-center justify-end w-1/3">
                    {windowWidth > breakpoint ? (
                        <div className="flex gap-4">
                            {menus.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveTab(m.id)}
                                    className={`font-black text-[11px] uppercase tracking-widest transition-all py-1 border-b-2 ${activeTab === m.id
                                        ? 'text-blue-700 border-blue-700'
                                        : 'text-slate-900 border-transparent hover:border-slate-300'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all border border-slate-200 shadow-sm"
                            >
                                {activeLabel}
                                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 overflow-hidden">
                                    {menus.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                setActiveTab(m.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 font-black text-[10px] uppercase tracking-widest transition-colors ${activeTab === m.id
                                                ? 'text-blue-700 bg-blue-50'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
                {children}
            </main>

            <footer className="py-8 text-center border-t border-slate-100 bg-white">
                <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em]">
                    CRAFTED BY MULMED TEAM
                </p>
            </footer>
        </div>
    );
};

export default LayoutDesktop;