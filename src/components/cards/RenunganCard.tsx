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
                        bukuEnde: cols[5], // Mengambil data kolom Buku Ende
                        lirikEnde: cols[6]  // Mengambil data kolom Lirik
                    };
                    setData(result);
                    cachedRenungan = result;
                }
            } catch (e) { console.error(e); }
        };
        fetchRenungan();
    }, []);

    // LOGIKA BACK BUTTON & OVERFLOW
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
        setIsScrolled(scrollTop > 50);
        setShowAmin(scrollTop + clientHeight > scrollHeight - 80);
    };

    const closeRenungan = () => {
        setIsOpen(false);
        if (window.history.state?.renunganOpen) {

        }
    };

    if (!data) return null;

    return (
        <>
            {/* CARD UTAMA */}
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

            {/* OVERLAY FULL SCREEN */}
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex flex-col animate-in slide-in-from-right duration-500 bg-white">

                    {/* STICKY HEADER */}
                    <div className={`flex items-center px-6 md:px-12 h-[75px] sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
                        <button onClick={closeRenungan} className="text-slate-900 p-2 -ml-2 active:scale-90 transition-transform">
                            <ArrowLeft size={24} />
                        </button>

                        <div className={`ml-4 transition-all duration-500 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <p className="text-[14px] font-black text-slate-900 uppercase leading-none mb-0.5">{data.topik}</p>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">{data.ayat}</p>
                        </div>
                    </div>

                    {/* AREA KONTEN - Max width 3xl agar teks tidak melebar liar */}
                    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="max-w-3xl mx-auto w-full px-8 py-12 flex flex-col">

                            <div className="mb-16">
                                <p className="text-[14px] font-black text-slate-900 uppercase tracking-[0.4em] mb-4">
                                    {data.tanggal}
                                </p>
                                <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[1] mb-12">
                                    {data.topik}
                                </h2>

                                <div className="border-l-8 border-slate-900 pl-8 py-6">
                                    <p className="text-[22px] md:text-[32px] font-black text-slate-900 italic leading-tight mb-6">
                                        "{data.kutipan}"
                                    </p>
                                    <p className="text-[14px] md:text-[16px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                        — {data.ayat}
                                    </p>
                                </div>
                            </div>

                            {data.bukuEnde && (
                                <div className="mb-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                    <h5 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                                        Buku Ende / HKBP
                                    </h5>
                                    <p className="text-[18px] font-black text-slate-900 mb-4">
                                        {data.bukuEnde}
                                    </p>
                                    <p className="text-[16px] font-medium text-slate-600 leading-relaxed italic whitespace-pre-line">
                                        {data.lirikEnde}
                                    </p>
                                </div>
                            )}

                            <div className="pb-48">
                                <p className="text-[16px] md:text-[18px] font-semibold text-slate-900 leading-[2] text-left whitespace-pre-line">
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

