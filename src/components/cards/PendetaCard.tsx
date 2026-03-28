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
        <div className="p-6 rounded-[2.5rem] shadow-sm border border-slate-100 bg-white relative overflow-hidden">
            <div className="mb-4 text-center">
                <h3 className="text-xl font-black text-blue-900 tracking-tighter uppercase">Pendeta</h3>
                <p className="text-[12px] text-slate-900 font-bold uppercase tracking-[0.1em]">HKBP Perumnas 2 Bekasi</p>
            </div>

            {/* Hero Header - Matching HeroCard Style */}
            <div className="rounded-[2rem] overflow-hidden  aspect-[4/3] relative bg-slate-900 mt-2 mb-4 shadow-inner">
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
                            {/* Trigger Header */}
                            <button
                                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                                className="w-full flex items-start justify-between p-4 outline-none group"
                            >
                                <div className={`flex flex-col w-full ${isExpanded ? 'items-center' : 'items-start'}`}>
                                    <p className={`font-black uppercase  ${isExpanded ? 'text-[14px] text-center text-slate-900' : 'text-[12px] text-left text-slate-700'}`}>
                                        {pdt.name}
                                    </p>
                                    <p className={`text-center font-black uppercase ${isExpanded ? 'text-[12px] text-slate-500' : 'text-[10px] text-slate-500'}`}>
                                        {pdt.role}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-full ${isExpanded ? ' text-black rotate-180 scale-110' : ' text-slate-400 group-active:scale-90'}`}>
                                    <ChevronDown size={16} strokeWidth={3} />
                                </div>
                            </button>

                            {/* Expanded Content */}
                            <div className={` ease-[cubic-bezier(0.33, 1, 0.68, 1)] ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                <div className="px-2 pb-6 space-y-3">

                                    <div className="relative flex flex-col items-center pt-2">
                                        <div className="w-[120px] aspect-square rounded-[2rem] overflow-hidden shadow-sm bg-slate-200">
                                            <img src={pdt.img} className="w-full h-full object-cover" alt={pdt.name} />
                                        </div>
                                        {pdt.bio !== "-" && (
                                            <div className="mt-5 text-center px-4">
                                                <p className="text-[13px] text-slate-500 font-bold italic leading-relaxed tracking-tight">
                                                    "{pdt.bio}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Pendidikan */}
                                        <div className="bg-white rounded-3xl p-5 border border-slate-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <p className="text-[12px] font-black text-slate-700 leading-tight uppercase tracking-tight">Pendidikan</p>
                                            </div>
                                            <div className="space-y-3">
                                                {pdt.pendidikan.map((edu: string, idx: number) => (
                                                    <div key={idx} className="flex gap-3 items-start pl-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                                                        <p className="text-[11px] font-black text-slate-700 leading-tight uppercase tracking-tight">{edu}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-3xl p-5 border border-slate-200 relative overflow-hidden">
                                            <div className="flex items-center gap-3 mb-4">
                                                <p className="text-[12px] font-black text-slate-700 leading-tight uppercase tracking-tight">Pelayanan</p>
                                            </div>

                                            <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar relative">
                                                <div className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-slate-100" />

                                                <div className="space-y-6 relative">
                                                    {pdt.pelayanan.map((srv: string, idx: number) => (
                                                        <div key={idx} className="pl-8 relative">
                                                            <div className="absolute left-[7px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white shadow-sm z-10" />
                                                            <p className="text-[11px] font-black text-slate-700 leading-tight uppercase tracking-tight">{srv}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* WA Button - Matching HeroCard Interaction */}
                                    <div className="pt-2">
                                        <a
                                            href={`https://wa.me/${pdt.phone.replace(/\D/g, '').replace(/^0/, '62')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase border border-slate-200"
                                        >
                                            <MessageCircle size={16} />
                                            Hubungi Pendeta
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default PendetaCard;