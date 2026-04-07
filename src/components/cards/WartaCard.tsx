// WartaCard.tsx
import React, { useState, useEffect } from 'react';
import { Download, Loader2, BookOpen, Users, Baby, Moon, Newspaper, FileText, ChevronDown, X } from 'lucide-react';

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
    const [fullscreenFile, setFullscreenFile] = useState<string | null>(null);

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
            if (rows.length > 3) {
                const headers = rows[0].split(',').map(v => v.replace(/^"|"$/g, '').trim());
                const parseRow = (rowStr: string) => {
                    const cols = rowStr.split(',').map(v => v.replace(/^"|"$/g, '').trim());
                    return {
                        minggu: cols[0],
                        tanggal: cols[1],
                        warta: extractId(cols[2]),
                        umum_subuh: extractId(cols[3]),
                        umum_pagi: extractId(cols[4]),
                        remaja: extractId(cols[5]),
                        sm: extractId(cols[6]),
                        sore: extractId(cols[7]),
                        lainnya: [
                            { label: headers[8], id: extractId(cols[8]) },
                            { label: headers[9], id: extractId(cols[9]) },
                            { label: headers[10], id: extractId(cols[10]) },
                            { label: headers[11], id: extractId(cols[11]) },
                            { label: headers[12], id: extractId(cols[12]) },
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
        const isMobile = window.innerWidth < 1024;

        if (isMobile) {
            setOpenViewerId(openViewerId === item.id ? null : item.id);
        } else {
            if (onSelectContent) {
                onSelectContent({
                    ...item,
                    type: 'pdf'
                });
            }
        }
    };

    useEffect(() => {
        if (fullscreenFile) {
            document.body.classList.add('modal-open');
            if (window.history.state?.modal !== 'pdf') {
                window.history.pushState({ modal: 'pdf' }, "");
            }

            const handlePopState = (e: PopStateEvent) => {
                setFullscreenFile(null);
                document.body.classList.remove('modal-open');
            };

            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                document.body.classList.remove('modal-open');
            };
        }
    }, [fullscreenFile]);

    const closeFullscreen = () => {
        if (window.history.state?.modal === 'pdf') {
            window.history.back();
        } else {
            setFullscreenFile(null);
            document.body.classList.remove('modal-open');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-60">
            <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
    );

    const sections = [
        {
            title: "",
            items: [{ label: "Warta Jemaat", id: data?.warta, icon: <Newspaper size={20} />, primary: true }]
        },
        {
            title: "", items: [
                { label: "Tata Ibadah Subuh", id: data?.umum_subuh, icon: <BookOpen size={18} /> },
                { label: "Tata Ibadah Pagi", id: data?.umum_pagi, icon: <BookOpen size={18} /> },
                { label: "Tata Ibadah Remaja", id: data?.remaja, icon: <Users size={18} /> },
                { label: "Tata Ibadah Sekolah Minggu", id: data?.sm, icon: <Baby size={18} /> },
                { label: "Tata Ibadah Sore", id: data?.sore, icon: <Moon size={18} /> },
            ].filter(i => i.id)
        },
        {
            title: "Dokumen Lain",
            items: data?.lainnya?.map((doc: any, index: number) => ({
                label: doc.label,
                id: doc.id || `extra-${index}`,
                icon: <FileText size={18} />
            })) || []
        }
    ].filter(section => section.items.length > 0);

    return (
        <div className="space-y-10 px-5">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">WARTA & ACARA</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">{data?.minggu}, {data?.tanggal}</p>
            </header>

            <div className="space-y-4">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.15em]">{section.title}</h3>
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
                                            <div className="mt-3 flex justify-center lg:hidden">
                                                <button
                                                    onClick={() => setFullscreenFile(item.id)}
                                                    className="block w-full max-w-[240px] aspect-[3/4] shadow-lg rounded-2xl overflow-hidden text-left"
                                                >
                                                    <PDFCover id={item.id} />
                                                </button>
                                            </div>
                                        )}

                                        {item.primary && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={handleToggleArsip}
                                                    className={`w-full py-3 flex items-center justify-center gap-2  transition-colors ${showArsip
                                                        ? " text-slate-900"
                                                        : " text-slate-400"
                                                        }`}
                                                >
                                                    <ChevronDown size={14} className={`${showArsip ? "rotate-180" : ""}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                                                        {showArsip ? "Tutup Arsip" : "Arsip Warta"}
                                                    </span>
                                                </button>

                                                {showArsip && (
                                                    <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {loadingArsip ? (
                                                            <div className="flex justify-center py-6">
                                                                <Loader2 className="animate-spin text-slate-300" size={20} />
                                                            </div>
                                                        ) : (
                                                            <div className="grid gap-2">
                                                                {arsip.map((archiveItem, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => {
                                                                            if (window.innerWidth < 1024) {
                                                                                setFullscreenFile(archiveItem.warta);
                                                                            } else if (onSelectContent) {
                                                                                onSelectContent({ id: archiveItem.warta, type: 'pdf', label: archiveItem.minggu });
                                                                            }
                                                                        }}
                                                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all text-left"
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{archiveItem.tanggal}</span>
                                                                            <span className="text-[11px] font-black text-slate-800 uppercase">{archiveItem.minggu}</span>
                                                                        </div>
                                                                        <Download size={14} className="text-slate-400" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {fullscreenFile && (
                <div className="fixed inset-0 z-[999] bg-white flex flex-col lg:hidden">
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-3 left-4 z-[999] p-2 bg-red-900/85 text-white"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-full h-full">
                        <iframe
                            src={`https://drive.google.com/file/d/${fullscreenFile}/preview`}
                            className="w-full h-full border-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WartaCard;