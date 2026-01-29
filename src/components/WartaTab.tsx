import React from 'react';
import { Download, FileText, ChevronRight } from 'lucide-react';

const WartaTab = () => {
    const wartaTerbaru = {
        judul: "Warta Jemaat 25 Januari 2026",
        minggu: "Minggu Letare",
        pdfUrl: "#",
        previewUrl: "https://via.placeholder.com/600x800.png?text=Preview+Dokumen+Warta"
    };

    const arsipWarta = [
        { tgl: "18 Jan 2026", minggu: "Minggu Epiphanas", judul: "Warta Jemaat 18 Jan" },
        { tgl: "11 Jan 2026", minggu: "Minggu I d.h Epiphanas", judul: "Warta Jemaat 11 Jan" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-32">

            {/* 1. SEKSI WARTA UTAMA */}
            <section className="space-y-6">
                <header className="px-1 text-center">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Warta Terbaru</h2>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em] mt-1">
                        {wartaTerbaru.minggu} • {wartaTerbaru.judul}
                    </p>
                </header>

                {/* Container Preview */}
                <div className="bg-white rounded-[2.5rem] border-4 border-white shadow-2xl shadow-slate-200 overflow-hidden">
                    <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center">
                        <img
                            src={wartaTerbaru.previewUrl}
                            alt="Preview Warta"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* TOMBOL DOWNLOAD DI BAWAH PREVIEW */}
                <div className="px-2">
                    <a
                        href={wartaTerbaru.pdfUrl}
                        className="flex items-center justify-center gap-3 bg-slate-900 text-white w-full py-5 rounded-[2rem] hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 group"
                    >
                        <Download size={20} className="group-hover:animate-bounce" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Download PDF Lengkap</span>
                    </a>
                </div>
            </section>

            {/* 2. SEKSI ARSIP */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Warta Sebelumnya</h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {arsipWarta.map((item, i) => (
                        <div
                            key={i}
                            className="bg-white/60 p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{item.judul}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{item.minggu}</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default WartaTab;