import React from 'react';
import { Download, Music } from 'lucide-react';

const IbadahTab = () => {
    const tataIbadahTerbaru = {
        judul: "Tata Ibadah 25 Januari 2026",
        minggu: "Minggu Letare",
        pdfUrl: "#",
        previewUrl: "https://via.placeholder.com/600x800.png?text=Preview+Tata+Ibadah",
        liveUrl: "https://www.youtube.com/@hkbpperumnas2bekasi/live"
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-32">

            {/* 1. SEKSI TATA IBADAH (Sama persis gaya Warta) */}
            <section className="space-y-6">
                <header className="px-1 text-center">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Tata Ibadah</h2>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em] mt-1">
                        {tataIbadahTerbaru.minggu} • {tataIbadahTerbaru.judul}
                    </p>
                </header>

                {/* Container Preview Dokumen */}
                <div className="bg-white rounded-[2.5rem] border-4 border-white shadow-2xl shadow-slate-200 overflow-hidden">
                    <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center">
                        <img
                            src={tataIbadahTerbaru.previewUrl}
                            alt="Preview Tata Ibadah"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* TOMBOL DOWNLOAD (Sekarang Kontras Tinggi) */}
                <div className="px-2">
                    <a
                        href={tataIbadahTerbaru.pdfUrl}
                        className="flex items-center justify-center gap-3 bg-slate-900 text-white w-full py-5 rounded-[2rem] hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 group"
                    >
                        <Download size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Download Tata Ibadah</span>
                    </a>
                </div>
            </section>

            {/* 2. SEKSI LIVE STREAMING (Dark Player Style) */}
            <section className="px-2 space-y-4">
                <div className="flex items-center gap-3 px-1 text-slate-300">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Ikuti Ibadah</h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <div
                    onClick={() => window.open(tataIbadahTerbaru.liveUrl, '_blank')}
                    className="relative bg-slate-900 aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 cursor-pointer group border-4 border-white"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-90"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1.5"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-black text-[10px] uppercase tracking-[0.4em]">Nonton Live</p>
                            <p className="text-white/40 font-bold text-[8px] uppercase tracking-widest mt-1 italic">YouTube Official</p>
                        </div>
                    </div>

                    <div className="absolute top-6 right-8 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                        <span className="text-[8px] font-black text-white uppercase tracking-wider">Live</span>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default IbadahTab;