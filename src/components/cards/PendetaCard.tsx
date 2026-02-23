import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

let cachedPendetaData: any[] | null = null;

const PendetaCard = () => {
    const [pendetaList, setPendetaList] = useState<any[]>(cachedPendetaData || []);
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(!cachedPendetaData);

    const TSV_URL = import.meta.env.VITE_TSV_PENDETA_URL;

    const formatDriveLink = (url: string) => {
        if (!url || url.trim() === "") return null;
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w600` : url;
        }
        return url;
    };

    useEffect(() => {
        if (selected) {
            document.body.classList.add('modal-open');
            window.history.pushState({ modalOpen: true }, "");

            const handlePopState = () => {

                setSelected(null);
                document.body.classList.remove('modal-open');
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
                document.body.classList.remove('modal-open');
            };
        }
    }, [selected]);


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

                    const topThree = parsedData.slice(0, 3);
                    cachedPendetaData = topThree;
                    setPendetaList(topThree);
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchPendeta();
    }, []);

    const closeDetail = () => {
        if (window.history.state?.modalOpen) {
            window.history.back();
        } else {
            setSelected(null);
            document.body.style.overflow = 'unset';
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-900" size={32} /></div>
    );

    return (
        <div className="p-6 rounded-[2.5rem] shadow-sm border border-slate-100 bg-white relative overflow-hidden">
            <div className="mb-8 text-center">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Pendeta Kami</h3>
            </div>

            <div className="space-y-4">
                {pendetaList.map((pdt, i) => (
                    <div
                        key={i}
                        onClick={() => setSelected(pdt)}
                        className="flex flex-col items-center py-6 px-4 rounded-[2rem] border border-slate-50 bg-slate-50/50 active:scale-95 transition-all cursor-pointer group"
                    >
                        <p className="text-[14px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">
                            {pdt.role}
                        </p>

                        {pdt.img && (
                            <div className="w-20 h-20 mb-3 overflow-hidden rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                <img src={pdt.img} className="w-full h-full object-cover" alt="pdt" />
                            </div>
                        )}

                        <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-tighter text-center leading-tight">
                            {pdt.name}
                        </h4>
                    </div>
                ))}
            </div>

            {selected && (
                <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDetail} />

                    <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 max-h-[85vh] overflow-hidden flex flex-col">

                        <div className="flex justify-center pt-4 pb-2">
                            <div className="w-12 h-1 bg-slate-100 rounded-full" />
                        </div>
                        <button onClick={closeDetail} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors z-50">
                            <X size={20} strokeWidth={3} />
                        </button>

                        <div className="overflow-y-auto no-scrollbar px-8 pt-4 pb-10">
                            <div className="flex flex-col items-center mb-8">
                                {selected.img && (
                                    <img src={selected.img} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl mb-6" alt="pdt" />
                                )}
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">{selected.role}</p>
                                <h4 className="text-[20px] font-black text-slate-900 uppercase tracking-tighter text-center">{selected.name}</h4>
                            </div>

                            {selected.bio !== "-" && (
                                <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] text-center border border-slate-100/50">
                                    <p className="text-[14px] font-bold text-slate-600 italic leading-relaxed">"{selected.bio}"</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {selected.pendidikan.length > 0 && (
                                    <div className="border-l-4 border-blue-600 pl-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pendidikan</span>
                                        <div className="space-y-1">
                                            {selected.pendidikan.map((item: string, idx: number) => (
                                                <p key={idx} className="text-[12px] font-black text-slate-900 leading-tight">{item}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selected.pelayanan.length > 0 && (
                                    <div className="border-l-4 border-slate-900 pl-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pelayanan</span>
                                        <div className="space-y-1">
                                            {selected.pelayanan.map((item: string, idx: number) => (
                                                <p key={idx} className="text-[12px] font-black text-slate-900 leading-tight">{item}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-8 pt-0">
                            <a
                                href={`https://wa.me/${selected.phone.replace(/\D/g, '').replace(/^0/, '62')}`}
                                className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white rounded-full text-[12px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                            >
                                Hubungi Pdt
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendetaCard;