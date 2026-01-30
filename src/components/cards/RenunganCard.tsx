import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

let cachedRenungan: any = null;

const RenunganCard = () => {
    const [data, setData] = useState<any>(cachedRenungan);
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAmin, setShowAmin] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const TSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoIpT64H7mZe1JiK8yPpr0HhXSr7dgfM5zM8sOzzLhz0SviQoJzxN425Ln9UxqRU19-R_1p4IpI3DK/pub?gid=1305703556&single=true&output=tsv";

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
                        ayat: cols[1],
                        kutipan: cols[2],
                        topik: cols[3],
                        isi: cols[4]
                    };
                    setData(result);
                    cachedRenungan = result;
                }
            } catch (e) { console.error(e); }
        };
        fetchRenungan();
    }, []);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setIsScrolled(scrollTop > 50);
        setShowAmin(scrollTop + clientHeight > scrollHeight - 50);
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }, [isOpen]);

    if (!data) return null;

    return (
        <>
            {/* CARD UTAMA */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="mb-6 text-center">
                    <h3 className="text-xl font-black text-blue-800 tracking-tighter uppercase mb-1">Renungan Harian</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]"></p>
                </div>

                <div onClick={() => setIsOpen(true)} className="p-7 rounded-[2.5rem] bg-slate-50 active:scale-95 transition-all cursor-pointer">
                    <div className="space-y-6">
                        {/* Judul, Kutipan, & Ayat Menyatu */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {/* 1. Judul Topik */}
                                <h4 className="text-[18px] font-black text-slate-900 leading-tight tracking-tight uppercase">
                                    {data.topik}
                                </h4>

                                {/* 2. Kutipan Ayat */}
                                <p className="text-[15px] font-bold text-slate-500 leading-snug italic">
                                    "{data.kutipan}"
                                </p>

                                {/* 3. Referensi Ayat (Kecil & Fokus) */}
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">
                                    — {data.ayat}
                                </p>
                            </div>
                        </div>

                        {/* Action - Bersih */}
                        <div className="flex items-center gap-1 text-slate-900 pt-2 border-t border-slate-200/50">
                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Baca Selengkapnya</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            </div>



            {/* OVERLAY FULL SCREEN */}
            {isOpen && (
                <div className="fixed inset-0 z-[999] bg-white flex flex-col animate-in slide-in-from-right duration-300">

                    {/* STICKY HEADER - Minimalis & Responsive terhadap Scroll */}
                    <div className={`flex items-center px-6 h-[75px] bg-white sticky top-0 z-10 transition-all duration-300 ${isScrolled ? 'border-b border-slate-100' : 'border-transparent'
                        }`}>
                        <button onClick={() => setIsOpen(false)} className="text-slate-900 p-2 -ml-2 active:scale-90 transition-transform">
                            <ArrowLeft size={24} />
                        </button>

                        {/* Judul & Ayat muncul saat di-scroll ke bawah */}
                        <div className={`ml-4 transition-all duration-500 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}>
                            <p className="text-[14px] font-black text-slate-900 uppercase leading-none mb-1">
                                {data.topik}
                            </p>
                            <p className="text-[12px] font-black text-blue-600 uppercase tracking-widest leading-none">
                                {data.ayat}
                            </p>
                        </div>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto px-8 pt-4 pb-32 no-scrollbar bg-white"
                    >
                        <div className="mb-12">
                            {/* Judul Utama */}
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1] mb-6">
                                {data.topik}
                            </h2>

                            {/* Kutipan & Ayat (Fokus Utama sebelum Scroll) */}
                            <div className="space-y-4">
                                <p className="text-[18px] font-black text-slate-900 italic leading-snug">
                                    "{data.kutipan}"
                                </p>
                                <p className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                    — {data.ayat}
                                </p>
                            </div>

                            <div className="w-12 h-1.5 bg-slate-900 mt-10 rounded-full" />
                        </div>

                        {/* Isi Renungan */}
                        <p className="text-[16px] font-bold text-slate-700 leading-[1.8] text-left whitespace-pre-line">
                            {data.isi}
                        </p>
                    </div>

                    {/* Tombol Amin - Tanpa Background Putih */}
                    <div className={`fixed bottom-8 left-6 right-6 z-20 transition-all duration-700 ease-in-out ${showAmin ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
                        }`}>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95 transition-transform"
                        >
                            Amin
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RenunganCard;