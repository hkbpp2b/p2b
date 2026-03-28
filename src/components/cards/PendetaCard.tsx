// PendetaCard.tsx
import React, { useState, useEffect } from 'react';
import { Loader2, ChevronDown, MessageCircle } from 'lucide-react';

let cachedPendetaData: any[] | null = null;

const PendetaCard = () => {
    const [pendetaList, setPendetaList] = useState<any[]>(cachedPendetaData || []);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(!cachedPendetaData);

    const TSV_URL = import.meta.env.VITE_TSV_PENDETA_URL;

    const formatDriveLink = (url: string) => {
        if (!url || url.trim() === "") return null;
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            if (!fileId) return url;
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2500`;

        }
        return url;
    };

    useEffect(() => {
        if (cachedPendetaData) return;
        const fetchPendeta = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");
                if (rows.length > 1) {
                    const parsedData = rows.slice(1).map(row => {
                        const cols = row.split('\t').map(v => v.trim());
                        return {
                            fullImg: formatDriveLink(cols[0]),
                            name: cols[1] || "Nama",
                            role: cols[2] || "Pelayan",
                            phone: cols[3] || "",
                            bio: cols[4] || "-",
                            img: formatDriveLink(cols[5]),
                            pendidikan: cols[6] ? cols[6].split(/[,;\n]/).map(s => s.trim()).filter(Boolean) : [],
                            pelayanan: cols[7] ? cols[7].split(/[,;\n]/).map(s => s.trim()).filter(Boolean).reverse() : []
                        };
                    });
                    cachedPendetaData = parsedData;
                    setPendetaList(parsedData);
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchPendeta();
    }, [TSV_URL]);

    if (loading) return (
        <div className="bg-white rounded-[2.5rem] h-[380px] flex items-center justify-center border border-slate-100 mt-4 shadow-sm">
            <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
    );

    const mainHeaderPhoto = pendetaList[0]?.fullImg;

    return (
        <div className="p-4 rounded-[2.5rem] shadow-sm border border-slate-100 bg-white relative overflow-hidden">
            <div className="mb-4 text-center">
                <h3 className="text-xl font-black text-blue-900 tracking-tighter uppercase">Pendeta</h3>
                <p className="text-[12px] text-slate-900 font-bold uppercase tracking-[0.1em]">HKBP Perumnas 2 Bekasi</p>
            </div>

            {/* Hero Header - Matching HeroCard Style */}
            <div className="rounded-[2rem] overflow-hidden  aspect-[16/10] relative bg-slate-900 mt-2 mb-4 shadow-xl">
                <img src={mainHeaderPhoto} className="w-full h-full object-cover scale-125" />
            </div>

            {/* Accordion List */}
            <div className="space-y-2 px-1 pb-1">
                {pendetaList.map((pdt, i) => {
                    const isExpanded = expandedIndex === i;
                    return (
                        <div
                            key={i}
                            className={`px-1 duration-500 rounded-[2rem] overflow-hidden border ${isExpanded ? 'bg-slate-50 border-slate-200 shadow-inner' : 'bg-white border-slate-100'
                                }`}
                        >
                            {/* Trigger Header (Hanya muncul saat tertutup atau sebagai header ringkas) */}
                            <button
                                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                                className="w-full flex items-center justify-between p-4 outline-none group"
                            >
                                {/* Kontainer Teks: Rata Kiri */}
                                <div className="flex flex-col items-start justify-center flex-1">
                                    <p className={`font-black uppercase transition-all duration-300 text-left ${isExpanded
                                        ? 'text-[14px] text-slate-900'
                                        : 'text-[13px] text-slate-700'
                                        }`}
                                    >
                                        {pdt.name}
                                    </p>
                                </div>

                                {/* Ikon Chevron: Tetap di Kanan */}
                                <div className={`p-2 shrink-0 rounded-full transition-all duration-300 ${isExpanded
                                    ? 'text-black rotate-180 scale-110'
                                    : 'text-slate-400 group-active:scale-90'
                                    }`}>
                                    <ChevronDown size={16} strokeWidth={3} />
                                </div>
                            </button>

                            {/* Expanded Content */}
                            <div className={`${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                <div className="pb-6">

                                    <style dangerouslySetInnerHTML={{
                                        __html: `.no-scrollbar::-webkit-scrollbar {display: none;}.no-scrollbar {-ms-overflow-style: none; scrollbar-width: none;}`
                                    }} />

                                    {/* Horizontal Swipe Container */}
                                    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-6">

                                        {/* SLIDE 1: FOTO & NAMA & BIO */}
                                        <div className="w-[calc(100%-24px)] shrink-0 snap-center mb-1">
                                            <div className="bg-white rounded-[2.5rem] p-6 h-[250px] shadow-sm flex flex-col items-center">

                                                {/* Foto Profil */}
                                                <div className="w-[120px] aspect-square rounded-[2rem] overflow-hidden shadow-md bg-slate-200">
                                                    <img
                                                        src={pdt.img}
                                                        className="w-full h-full object-cover"
                                                        alt={pdt.name}
                                                    />
                                                </div>

                                                {/* Informasi Nama & Role */}
                                                <div className="mt-4 text-center">

                                                    <p className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                                                        {pdt.name}
                                                    </p>

                                                    <p className="text-[12px] font-black text-blue-900 uppercase tracking-widest mt-2">
                                                        {pdt.role}
                                                    </p>

                                                    {pdt.bio !== "-" && (
                                                        <p className="mt-4 text-[11px] text-slate-500 font-bold italic leading-relaxed tracking-tight px-2">
                                                            "{pdt.bio}"
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Tombol WA di dalam kotak */}

                                            </div>

                                        </div>



                                        {/* SLIDE 2: DETAIL (DENGAN BATASAN TINGGI) */}
                                        <div className="w-[calc(100%-12px)] shrink-0 snap-center mb-1">
                                            {/* 1. Tentukan tinggi tetap di sini, misal h-[320px] */}
                                            <div className="bg-white rounded-[2.5rem] pt-6 px-6 h-[250px] shadow-sm flex flex-col">

                                                {/* 2. Wrapper Scroll Utama - flex-1 akan mengambil sisa ruang yang tersedia */}
                                                <div className="flex-1 overflow-y-auto no-scrollbar pr-1">

                                                    {/* Bagian Pendidikan */}
                                                    <div className="mb-6">
                                                        <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white pb-1 z-20">
                                                            <p className="text-[10px] font-black text-slate-900 leading-tight uppercase tracking-widest">
                                                                Pendidikan
                                                            </p>
                                                            <div className="h-[1px] flex-1 bg-slate-300" />
                                                        </div>

                                                        <div className="space-y-3 px-1">
                                                            {pdt.pendidikan.map((edu: string, idx: number) => (
                                                                <div key={idx} className="flex gap-3 items-start">
                                                                    <div className="w-1 h-1 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                                                                    <p className="text-[11px] font-extrabold text-slate-600 leading-tight tracking-tight">
                                                                        {edu}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Bagian Pelayanan */}
                                                    <div className="relative">
                                                        <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white pb-1 z-20">
                                                            <p className="text-[10px] font-black text-slate-900 leading-tight uppercase tracking-widest">
                                                                Pelayanan
                                                            </p>
                                                            <div className="h-[1px] flex-1 bg-slate-300" />
                                                        </div>

                                                        <div className="space-y-5 relative px-1 mb-8">
                                                            {pdt.pelayanan.map((srv: string, idx: number) => (
                                                                <div key={idx} className="pl-5 relative border-l border-slate-900 ml-0.5">
                                                                    <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-900 border-2 border-white shadow-sm z-10" />
                                                                    <p className="text-[11px] font-extrabold text-slate-600 leading-tight tracking-tight">
                                                                        {srv}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 mx-15">
                                        <a
                                            href={`https://wa.me/${pdt.phone.replace(/\D/g, '').replace(/^0/, '62')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2 bg-white text-slate-900 w-full py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-sm"
                                        >
                                            Hubungi Pendeta
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
};

export default PendetaCard;