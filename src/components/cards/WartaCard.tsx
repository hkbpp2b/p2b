// WartaCard.tsx
import React, { useState, useEffect } from 'react';
import { Download, Loader2, BookOpen, Users, Baby, Moon, Newspaper, FileText, ChevronDown } from 'lucide-react';

let cachedIbadahData: any = null;
let cachedArsipData: any[] = [];

const PDFCover = ({ id }: { id: string }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || id === "-") {
            setLoading(false);
            return;
        }
        setImgSrc(`https://drive.google.com/thumbnail?id=${id}&sz=w1000`);
    }, [id]);

    return (
        <div className="relative w-full h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-slate-200" size={24} />
                </div>
            )}
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                    onLoad={() => setLoading(false)}
                    onError={() => setImgSrc(null)}
                />
            )}
        </div>
    );
};

interface WartaCardProps {
    onSelectContent?: (content: any) => void;
}

const WartaCard = ({ onSelectContent }: WartaCardProps) => {
    const [data, setData] = useState<any>(cachedIbadahData);
    const [arsip, setArsip] = useState<any[]>(cachedArsipData);
    const [loading, setLoading] = useState(!cachedIbadahData);
    const [loadingArsip, setLoadingArsip] = useState(false);
    const [showArsip, setShowArsip] = useState(false);
    const [openViewerId, setOpenViewerId] = useState<string | null>(null);

    const CSV_URL = import.meta.env.VITE_IBADAH_CSV_URL;

    const extractId = (input: string) => {
        if (!input || input === "" || input === "-") return null;
        const url = input.trim();
        if (!url.includes('/')) return url;
        const match = url.match(/\/d\/([^/]+)|id=([^&]+)/);
        return match ? (match[1] || match[2]) : url;
    };

    const fetchData = async () => {
        try {
            const res = await fetch(`${CSV_URL}&t=${new Date().getTime()}`);
            const text = await res.text();
            const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");
            if (rows.length > 1) {
                const headers = rows[0].split(',').map(v => v.replace(/^"|"$/g, '').trim());
                const parseRow = (rowStr: string) => {
                    const cols = rowStr.split(',').map(v => v.replace(/^"|"$/g, '').trim());
                    return {
                        minggu: cols[0], tanggal: cols[1], warta: extractId(cols[2]),
                        umum: extractId(cols[3]), remaja: extractId(cols[4]), sm: extractId(cols[5]), sore: extractId(cols[6]),
                        lainnya: [
                            { label: headers[7], id: extractId(cols[7]) },
                            { label: headers[8], id: extractId(cols[8]) },
                            { label: headers[9], id: extractId(cols[9]) },
                            { label: headers[10], id: extractId(cols[10]) },
                            { label: headers[11], id: extractId(cols[11]) },
                        ].filter(item => item.id)
                    };
                };
                const currentData = parseRow(rows[1]);
                const archiveData = rows.slice(2).map(row => parseRow(row));
                cachedIbadahData = currentData;
                cachedArsipData = archiveData;
                setData(currentData);
                setArsip(archiveData);
            }
        } catch (e) { console.error(e); } finally {
            setLoading(false);
            setLoadingArsip(false);
        }
    };

    useEffect(() => { if (!cachedIbadahData) fetchData(); }, []);

    const handleToggleArsip = () => {
        if (!showArsip && arsip.length === 0 && !loading) {
            setLoadingArsip(true);
            fetchData();
        }
        setShowArsip(!showArsip);
    };

    const handleItemClick = (item: any) => {
        setOpenViewerId(openViewerId === item.id ? null : item.id);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-60">
            <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
    );

    const sections = [
        { title: "Warta Jemaat", items: [{ label: "Warta Mingguan", id: data?.warta, icon: <Newspaper size={20} />, primary: true }] },
        {
            title: "Tata Ibadah", items: [
                { label: "Ibadah Umum", id: data?.umum, icon: <BookOpen size={18} /> },
                { label: "Ibadah Remaja", id: data?.remaja, icon: <Users size={18} /> },
                { label: "Sekolah Minggu", id: data?.sm, icon: <Baby size={18} /> },
                { label: "Ibadah Sore", id: data?.sore, icon: <Moon size={18} /> },
            ].filter(i => i.id)
        },
        { title: "Dokumen Lainnya", items: data?.lainnya?.map((doc: any) => ({ label: doc.label, id: doc.id, icon: <FileText size={18} /> })) || [] }
    ].filter(section => section.items.length > 0);

    return (
        <div className="space-y-10">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Warta dan Acara</h2>
                <p className="text-[15px] font-bold text-slate-900 uppercase tracking-[0.2em]">{data?.minggu}</p>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">{data?.tanggal}</p>
            </header>

            <div className="space-y-10">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.25em] pl-1">{section.title}</h3>
                        <div className="grid gap-3">
                            {section.items.map((item: any, iIdx: number) => {
                                const isActive = openViewerId === item.id;
                                return (
                                    <div key={iIdx} className="w-full">
                                        <button
                                            onClick={() => handleItemClick(item)}
                                            className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all active:scale-[0.97] group ${isActive
                                                ? "bg-blue-900 text-white shadow-xl"
                                                : item.primary
                                                    ? "bg-slate-900 text-white shadow-xl"
                                                    : "bg-white border-2 border-slate-100 text-slate-900 shadow-sm hover:border-slate-900"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={isActive || item.primary ? "text-blue-200" : "text-slate-900"}>{item.icon}</div>
                                                <span className="text-[12px] font-black uppercase tracking-wider text-left">{item.label}</span>
                                            </div>
                                            <ChevronDown size={18} className={`${isActive ? "rotate-180" : ""} ${isActive || item.primary ? "text-white" : "text-slate-300 group-hover:text-slate-900"}`} />
                                        </button>

                                        {isActive && (
                                            <div className="mt-3 flex justify-center">
                                                <a
                                                    href={`https://drive.google.com/file/d/${item.id}/view`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full max-w-[240px] aspect-[3/4] shadow-lg rounded-2xl overflow-hidden"
                                                >
                                                    <PDFCover id={item.id} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="pt-4">
                    <button
                        onClick={handleToggleArsip}
                        className={`w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed rounded-3xl ${showArsip
                            ? "border-slate-900 text-slate-900 bg-slate-50"
                            : "border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900"
                            }`}
                    >
                        <ChevronDown size={18} className={`${showArsip ? "rotate-180" : ""}`} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            {showArsip ? "Tutup Arsip" : "Arsip Warta"}
                        </span>
                    </button>

                    {showArsip && (
                        <div className="mt-4 space-y-4">
                            <h3 className="text-[12px] font-black text-slate-700 uppercase tracking-[0.25em] pl-1 border-l-4 border-slate-200 ml-1">
                                Arsip Warta Jemaat
                            </h3>
                            {loadingArsip ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-slate-300" size={24} />
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    {arsip.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={`https://drive.google.com/file/d/${item.warta}/view`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{item.tanggal}</span>
                                                <span className="text-[12px] font-black text-slate-800 uppercase">{item.minggu}</span>
                                            </div>
                                            <Download size={16} className="text-slate-400" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WartaCard;