// IbadahTab.tsx
import React, { useRef, useEffect } from 'react';
import SlideCard from '../cards/SlideCard';
import WartaCard from '../cards/WartaCard';

interface IbadahTabProps {
    onSelectContent?: (content: any) => void;
    scrollToWawasan?: boolean;
    onScrollDone?: () => void;
}

const IbadahTab = ({ onSelectContent, scrollToWawasan, onScrollDone }: IbadahTabProps) => {
    const wawasanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollToWawasan) {
            // Beri sedikit delay agar komponen dipastikan sudah 'block' (muncul) sebelum scroll
            const timer = setTimeout(() => {
                wawasanRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                onScrollDone?.(); // Reset state shouldScroll di App.tsx menjadi false
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [scrollToWawasan, onScrollDone]);

    return (
        <div className="animate-in fade-in duration-700 pb-32 pt-8 px-5 space-y-10">
            <WartaCard onSelectContent={onSelectContent} />

            <div ref={wawasanRef} className="space-y-6 pt-12 scroll-mt-24">
                <header className="text-center space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Wawasan Iman</h2>
                    <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Kajian Teologi, Budaya, dan Aliran</p>
                </header>
                <SlideCard />
            </div>
        </div>
    );
};

export default IbadahTab;