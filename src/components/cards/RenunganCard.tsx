// RenunganCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

let cachedRenungan: any = null;

const RenunganCard = () => {
    const [data, setData] = useState<any>(cachedRenungan);
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAmin, setShowAmin] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const TSV_URL = import.meta.env.VITE_TSV_RENUNGAN_URL;

    useEffect(() => {
        if (cachedRenungan) return;
        const fetchRenungan = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");
                if (rows.length > 1) {
                    const cols = rows[1].split('\t');
                    const result = {
                        tanggal: cols[0],
                        ayat: cols[1],
                        kutipan: cols[2],
                        topik: cols[3],
                        isi: cols[4],
                        bukuEnde: cols[5],
                        lirikEnde: cols[6]
                    };
                    setData(result);
                    cachedRenungan = result;
                }
            } catch (e) { console.error(e); }
        };
        fetchRenungan();
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            window.history.pushState({ renunganOpen: true }, "");

            const handleBackInRenungan = () => {
                setIsOpen(false);
                document.body.classList.remove('modal-open');
            };

            window.addEventListener('popstate', handleBackInRenungan);
            return () => {
                window.removeEventListener('popstate', handleBackInRenungan);
                document.body.classList.remove('modal-open');
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setIsScrolled(scrollTop > 20);
        setShowAmin(scrollTop + clientHeight > scrollHeight - 80);
    };

    const closeRenungan = () => {
        setIsOpen(false);
    };

    if (!data) return null;

    return (
        <>
            <div className="p-6 rounded-[2.5rem] shadow-sm border border-slate-800 bg-slate-900 relative overflow-hidden">
                <div className="mb-6 text-center relative z-10">
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-1">
                        Renungan Harian
                    </h3>
                    <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {data.tanggal}
                    </p>
                </div>

                <div
                    onClick={() => setIsOpen(true)}
                    className="p-7 rounded-[2.5rem] bg-slate-800/50 backdrop-blur-sm active:scale-95 transition-all cursor-pointer relative z-10 border border-slate-700/50 hover:border-slate-600 shadow-xl"
                >
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="text-[18px] font-black text-white leading-tight tracking-tight uppercase">
                                    {data.topik}
                                </h4>
                                <p className="text-[15px] font-semibold text-slate-100 leading-snug italic">
                                    "{data.kutipan}"
                                </p>
                                <p className="text-[14px] font-black text-blue-400 uppercase tracking-widest pt-1">
                                    — {data.ayat}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-white pt-2 border-t border-slate-700/50">
                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Baca Selengkapnya</span>
                            <ChevronRight size={14} className="text-blue-500" />
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex flex-col animate-in slide-in-from-right duration-500 bg-white">
                    <header className="flex-none bg-white border-b border-slate-100 px-2 h-12 flex items-center">
                        <div className="flex-1 flex items-center">
                            <button onClick={closeRenungan} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-900">
                                <ArrowLeft size={22} />
                            </button>
                        </div>

                        <div className={`flex flex-col items-center transition-all duration-300 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                            <h2 className="text-[12px] font-black text-slate-900 tracking-tight uppercase truncate max-w-[180px]">
                                {data.topik}
                            </h2>
                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                                {data.ayat}
                            </span>
                        </div>

                        <div className="flex-1" />
                    </header>

                    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="max-w-2xl mx-auto w-full px-6 pt-8 pb-32 flex flex-col">
                            <div className="mb-10">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">
                                    {data.tanggal}
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-8">
                                    {data.topik}
                                </h1>

                                <div className="border-l-[3px] border-slate-900 pl-5 py-1">
                                    <p className="text-[19px] md:text-[24px] font-black text-slate-900 italic leading-snug mb-3">
                                        "{data.kutipan}"
                                    </p>
                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                                        — {data.ayat}
                                    </p>
                                </div>
                            </div>

                            {data.bukuEnde && (
                                <div className="mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <h5 className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">
                                        Buku Ende / HKBP
                                    </h5>
                                    <p className="text-[16px] font-black text-slate-900 mb-2">
                                        {data.bukuEnde}
                                    </p>
                                    <p className="text-[15px] font-medium text-slate-600 leading-relaxed italic whitespace-pre-line">
                                        {data.lirikEnde}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-[17px] md:text-[18px] font-medium text-slate-800 leading-[1.7] text-left whitespace-pre-line">
                                    {data.isi}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RenunganCard;