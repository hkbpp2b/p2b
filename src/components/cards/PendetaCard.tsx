import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Loader2, ArrowUpRight, GraduationCap, History, ChevronDown } from 'lucide-react';

let cachedPendetaData: any[] | null = null;

const PendetaCard = () => {
    const [pendetaList, setPendetaList] = useState<any[]>(cachedPendetaData || []);
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(!cachedPendetaData);

    const TSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoIpT64H7mZe1JiK8yPpr0HhXSr7dgfM5zM8sOzzLhz0SviQoJzxN425Ln9UxqRU19-R_1p4IpI3DK/pub?gid=143481815&single=true&output=tsv";

    const formatDriveLink = (url: string) => {
        if (!url) return "https://api.dicebear.com/7.x/avataaars/svg?seed=neutral";
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w600` : url;
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
                            name: cols[0] || "Nama",
                            role: cols[1] || "Pelayan",
                            phone: cols[2] || "",
                            bio: cols[3] || "-",
                            img: formatDriveLink(cols[4]),
                            pendidikan: cols[5] ? cols[5].split(/[,;\n]/).map(s => s.trim()).filter(Boolean) : [],
                            pelayanan: cols[6] ? cols[6].split(/[,;\n]/).map(s => s.trim()).filter(Boolean) : []
                        };
                    });
                    cachedPendetaData = parsedData;
                    setPendetaList(parsedData);
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchPendeta();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-900" size={32} /></div>
    );

    return (


        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-black text-blue-800 tracking-tighter uppercase mb-1">Pendeta Kami</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Yang keren</p>
            </div>

            {/* GRID UTAMA - Logic: No Enter sebelum Spasi */}
            <div className="grid grid-cols-1 gap-4 max-w-full">
                {pendetaList.map((pdt, i) => (
                    <div
                        key={i}
                        onClick={() => setSelected(pdt)}
                        className="flex items-center p-5 rounded-[2rem] border border-slate-100 bg-slate-50 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                    >
                        {/* Foto Tetap di Kiri */}
                        <div className="flex-shrink-0 w-16 h-16">
                            <img
                                src={pdt.img}
                                className="w-full h-full rounded-[1.2rem] object-cover bg-white border border-slate-100"
                                alt="pdt"
                            />
                        </div>

                        {/* Container Teks */}
                        <div className="ml-5 flex-grow min-w-0 text-left">
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1 truncate">
                                {pdt.role}
                            </p>

                            <h4 className="text-[15px] font-black text-slate-900 uppercase leading-[1.1] whitespace-pre-wrap break-words">
                                {pdt.name}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL COMPACT DENGAN VISUAL SCROLL CUE */}
            {selected && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelected(null)} />

                    <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh] overflow-hidden flex flex-col border border-slate-50">

                        {/* Header Tetap (Foto Besar & Bio Utama) */}
                        <div className="pt-10 pb-6 px-8 flex flex-col items-center">
                            <button onClick={() => setSelected(null)} className="absolute top-6 right-8 text-slate-300 hover:text-slate-900"><X size={20} /></button>
                            <img src={selected.img} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-xl border-4 border-white mb-6" alt="pdt" />
                            <div className="text-center mb-6">
                                <h4 className="text-[18px] font-black text-slate-900 uppercase tracking-tight">{selected.name}</h4>
                                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">{selected.role}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[14px] font-bold text-slate-500 italic leading-relaxed">"{selected.bio}"</p>
                            </div>
                        </div>

                        {/* Scrollable Detail dengan Fade Cue */}
                        <div className="relative flex-grow overflow-hidden flex flex-col">


                            <div className="overflow-y-auto px-8 py-4 no-scrollbar space-y-8 pb-10">
                                {selected.pendidikan.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-900 opacity-40">
                                            <GraduationCap size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Pendidikan</span>
                                        </div>
                                        <div className="space-y-2">
                                            {selected.pendidikan.map((item: string, idx: number) => (
                                                <p key={idx} className="text-[12px] font-bold text-slate-600">• {item}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selected.pelayanan.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-900 opacity-40">
                                            <History size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Riwayat Pelayanan</span>
                                        </div>
                                        <div className="space-y-2">
                                            {selected.pelayanan.map((item: string, idx: number) => (
                                                <p key={idx} className="text-[12px] font-bold text-slate-600">• {item}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Fade effect at bottom of scroll area */}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        </div>

                        {/* Footer Tetap (Tombol) */}
                        <div className="p-8 pt-4">
                            <a
                                href={`https://wa.me/${selected.phone.replace(/\D/g, '').replace(/^0/, '62')}`}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                            >
                                <MessageCircle size={18} /> Chat WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendetaCard;