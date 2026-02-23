// GivingTab.tsx
import React, { useState, useEffect } from 'react';
import { Copy, ChevronRight, Wallet, Loader2, QrCode, Check, ChevronDown } from 'lucide-react';

let cachedGivingData: any[] | null = null;

const GivingTab = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [givingData, setGivingData] = useState<any[]>(cachedGivingData || []);
    const [loading, setLoading] = useState(!cachedGivingData);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const TSV_URL = import.meta.env.VITE_GIVING_TSV_URL;

    useEffect(() => {
        if (cachedGivingData) return;
        const fetchGiving = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");

                if (rows.length > 1) {
                    const parsedData = rows.slice(1).map((row, index) => {
                        const cols = row.split('\t').map(v => v.trim());
                        let rawQr = cols[2] || "";

                        if (rawQr.includes('drive.google.com')) {
                            const fileId = rawQr.match(/\/d\/(.+?)\//) || rawQr.match(/id=(.+?)(&|$)/);
                            if (fileId) {
                                rawQr = `https://lh3.googleusercontent.com/d/${fileId[1]}=w1000`;
                            }
                        }

                        return {
                            id: `item-${index}`,
                            title: cols[0] || "Tanpa Nama",
                            desc: cols[1] || "-",
                            qrUrl: rawQr,
                            bank: cols[3] || "BANK",
                            norek: cols[4] || "-",
                            an: cols[5] || "HKBP Perumnas 2"
                        };
                    });

                    setGivingData(parsedData);
                    cachedGivingData = parsedData;
                }
            } catch (e) {
                console.error("Error Fetch QR:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchGiving();
    }, [TSV_URL]);

    const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!text || text === "-") return;
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
        document.body.removeChild(textArea);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return (
        <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-60 bg-transparent">
            <Loader2 className="animate-spin text-slate-900" size={32} />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mt-6">Sinkronisasi</p>
        </div>
    );

    return (
        <div className="pb-32 pt-8 px-5 space-y-10">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Persembahan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Transfer atau scan kode</p>
            </header>

            {givingData.length > 0 && (
                <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col border border-slate-100/50 overflow-hidden mx-auto mb-10">
                    <div className="text-center mb-6">
                        <h3 className="text-[22px] font-black text-slate-900 uppercase tracking-tight leading-none">
                            {givingData[0].title}
                        </h3>
                    </div>

                    <div className="bg-slate-50 w-[100%] mx-auto aspect-square flex items-center justify-center overflow-hidden rounded-[2rem] border border-slate-100 shadow-inner relative">
                        {givingData[0].qrUrl ? (
                            <img src={givingData[0].qrUrl} alt="QR" className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
                        ) : (
                            <div className="text-center opacity-20">
                                <QrCode size={40} className="mx-auto" />
                                <p className="text-[8px] font-black uppercase mt-2">QR Kosong</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 overflow-hidden rounded-[2.2rem] border border-slate-100 shadow-sm">
                        <button
                            type="button"
                            onClick={(e) => handleCopy(givingData[0].norek, givingData[0].id, e)}
                            className="group relative z-10 w-full py-5 px-6 flex items-center justify-between active:scale-[0.97] transition-all duration-500 bg-white"
                        >
                            <div className={`absolute inset-0 bg-blue-50 transition-transform duration-500 ease-out ${copiedId === givingData[0].id ? 'translate-x-0' : '-translate-x-full'}`} />
                            <div className="relative z-10 text-left pointer-events-none">
                                <p className={`text-[20px] font-black mb-2.5 transition-all ${copiedId === givingData[0].id ? 'text-blue-600' : 'text-slate-900'}`}>{givingData[0].norek}</p>
                                <div className="space-y-1">
                                    <p className={`text-[11px] font-black uppercase ${copiedId === givingData[0].id ? 'text-blue-500' : 'text-slate-900'}`}>{givingData[0].bank}</p>
                                    <p className={`text-[10px] font-bold uppercase truncate max-w-[180px] ${copiedId === givingData[0].id ? 'text-blue-300' : 'text-slate-900'}`}>{givingData[0].an}</p>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-center gap-2">
                                {copiedId === givingData[0].id && <span className="text-[10px] font-black uppercase text-blue-600">Copied</span>}
                                <div className={`p-3.5 rounded-[1.2rem] transition-all duration-500 ${copiedId === givingData[0].id ? 'bg-blue-600 text-white rotate-[360deg]' : 'bg-slate-50 text-slate-400'}`}>
                                    {copiedId === givingData[0].id ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {givingData.slice(1).map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${expandedId === item.id ? 'border-slate-200 shadow-lg' : 'border-slate-100 shadow-sm'}`}
                    >
                        <div
                            onClick={() => toggleExpand(item.id)}
                            className="w-full flex items-center p-5 text-left cursor-pointer active:scale-[0.98] transition-transform"
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${expandedId === item.id ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400"}`}>
                                <Wallet size={20} />
                            </div>

                            <div className="ml-4 flex-grow min-w-0">
                                <h3 className="text-[13px] font-black text-slate-900 uppercase leading-tight">{item.title}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{item.desc}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => handleCopy(item.norek, item.id, e)}
                                    className={`p-2.5 rounded-xl transition-all ${copiedId === item.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                                >
                                    {copiedId === item.id ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                                </button>
                                <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        <div className={`transition-all duration-500 ease-in-out ${expandedId === item.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            <div className="px-5 pb-8 flex flex-col items-center">
                                <div className="w-full h-px bg-slate-100 mb-6" />
                                <div className="bg-slate-50 w-full max-w-[240px] aspect-square flex items-center justify-center overflow-hidden rounded-[2rem] border border-slate-100 shadow-inner p-4">
                                    {item.qrUrl ? (
                                        <img src={item.qrUrl} alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
                                    ) : (
                                        <div className="text-center opacity-20">
                                            <QrCode size={40} className="mx-auto" />
                                            <p className="text-[8px] font-black uppercase mt-2">QR Tidak Tersedia</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[14px] font-black text-slate-900 tracking-tight">{item.norek}</p>
                                    <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mt-1">{item.bank} • {item.an}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GivingTab;