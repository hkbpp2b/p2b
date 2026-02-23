// IbadahTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Download, Loader2, BookOpen, Users, Baby, Moon, Newspaper, FileText, ChevronDown, Maximize, X } from 'lucide-react';

let cachedIbadahData: any = null;
let cachedArsipData: any[] = []; const PDFViewer = ({ id, isVisible }: { id: string; isVisible: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const viewerUrl = `https://drive.google.com/file/d/${id}/preview`;

    useEffect(() => {
        const handleFSChange = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    const toggleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 h-auto mt-3' : 'opacity-0 h-0 overflow-hidden mt-0 pointer-events-none'}`}>
            <div
                ref={containerRef}
                className={`${isFullScreen
                    ? 'fixed inset-0 z-[9999] bg-white flex flex-col'
                    : 'relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex flex-col'
                    }`}
            >
                <div className={`flex items-center justify-between p-3 border-b ${isFullScreen ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <button
                        onClick={toggleFullScreen}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all active:scale-95 ${isFullScreen
                            ? 'bg-slate-800 text-white hover:bg-slate-700'
                            : 'bg-white text-slate-700 border border-slate-200 shadow-sm'
                            }`}
                    >
                        {isFullScreen ? <X size={18} /> : <Maximize size={16} />}
                        <span className="text-[10px] font-black uppercase tracking-wider">
                            {isFullScreen ? 'Tutup' : 'Layar Penuh'}
                        </span>
                    </button>

                    <a
                        href={`https://drive.google.com/uc?export=download&id=${id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                    >
                        <Download size={14} />
                        Unduh
                    </a>
                </div>

                <div
                    className="flex-1 overflow-hidden bg-white flex items-center justify-center relative touch-auto"
                    style={{ touchAction: 'pinch-zoom' }}
                >
                    <iframe
                        src={viewerUrl}
                        className={`border-none ${isFullScreen
                            ? 'w-full h-full'
                            : 'w-[115%] h-[100%] shrink-0'
                            }`}
                        style={!isFullScreen ? {
                            transform: 'translateY(-4%) scale(1.02)',
                            pointerEvents: 'auto'
                        } : {
                            pointerEvents: 'auto'
                        }}
                        allow="autoplay"
                        loading="eager"
                        title="PDF Preview"
                    />
                </div>
            </div>
        </div>
    );
};

const IbadahTab = () => {
    const [data, setData] = useState<any>(cachedIbadahData);
    const [arsip, setArsip] = useState<any[]>(cachedArsipData);
    const [loading, setLoading] = useState(!cachedIbadahData);
    const [loadingArsip, setLoadingArsip] = useState(false);
    const [showArsip, setShowArsip] = useState(false);
    const [openViewerId, setOpenViewerId] = useState<string | null>(null);

    const CSV_URL = import.meta.env.VITE_IBADAH_CSV_URL;

    const handleToggleArsip = () => {
        if (!showArsip && arsip.length === 0 && !loading) {
            setLoadingArsip(true);
            fetchData();
        }
        setShowArsip(!showArsip);
    };

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
                        minggu: cols[0],
                        tanggal: cols[1],
                        warta: extractId(cols[2]),
                        umum: extractId(cols[3]),
                        remaja: extractId(cols[4]),
                        sm: extractId(cols[5]),
                        sore: extractId(cols[6]),
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
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingArsip(false);
        }
    };

    useEffect(() => {
        if (!cachedIbadahData) {
            fetchData();
        }
    }, []);

    const handleOpenArsip = () => {
        setShowArsip(true);
        if (arsip.length === 0 && !loading) {
            setLoadingArsip(true);
            fetchData();
        }
    };

    const toggleViewer = (id: string) => {
        setOpenViewerId(openViewerId === id ? null : id);
    };

    if (loading) return (
        <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-60 bg-transparent">
            <Loader2 className="animate-spin text-slate-900" size={32} />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mt-6">
                Sinkronisasi
            </p>
        </div>
    );

    const sections = [
        {
            title: "Warta Jemaat",
            items: [{ label: "Warta Mingguan", id: data?.warta, icon: <Newspaper size={20} />, primary: true }]
        },
        {
            title: "Tata Ibadah",
            items: [
                { label: "Ibadah Umum", id: data?.umum, icon: <BookOpen size={18} /> },
                { label: "Ibadah Remaja", id: data?.remaja, icon: <Users size={18} /> },
                { label: "Sekolah Minggu", id: data?.sm, icon: <Baby size={18} /> },
                { label: "Ibadah Sore", id: data?.sore, icon: <Moon size={18} /> },
            ].filter(i => i.id)
        },
        {
            title: "Dokumen Lainnya",
            items: data?.lainnya?.map((doc: any) => ({
                label: doc.label,
                id: doc.id,
                icon: <FileText size={18} />
            })) || []
        }
    ].filter(section => section.items.length > 0);

    return (
        <div className="animate-in fade-in duration-700 pb-32 pt-8 px-5 space-y-10">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Warta dan Acara</h2>
                <p className="text-[15px] font-bold text-slate-900 uppercase tracking-[0.2em]">{data?.minggu}</p>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-[0.2em]">{data?.tanggal}</p>
            </header>

            <div className="space-y-10">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.25em] pl-1 border-l-4 border-slate-900 ml-1">
                            {section.title}
                        </h3>
                        <div className="grid gap-3">
                            {section.items.map((item: any, iIdx: number) => (
                                <div key={iIdx} className="w-full">
                                    <button
                                        onClick={() => toggleViewer(item.id)}
                                        className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all active:scale-[0.97] group ${item.primary ? "bg-slate-900 text-white shadow-xl" : "bg-white border-2 border-slate-100 text-slate-900 shadow-sm hover:border-slate-900"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={item.primary ? "text-slate-400" : "text-slate-900"}>{item.icon}</div>
                                            <span className="text-[12px] font-black uppercase tracking-wider text-left">{item.label}</span>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className={`transition-transform duration-300 ${openViewerId === item.id ? "rotate-180" : ""} ${item.primary ? "text-white" : "text-slate-300 group-hover:text-slate-900"}`}
                                        />
                                    </button>

                                    <PDFViewer id={item.id} isVisible={openViewerId === item.id} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-4">
                    <button
                        onClick={handleToggleArsip}
                        className={`w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed rounded-3xl transition-all ${showArsip
                            ? "border-slate-900 text-slate-900 bg-slate-50"
                            : "border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900"
                            }`}
                    >
                        <ChevronDown size={18} className={`transition-transform duration-300 ${showArsip ? "rotate-180" : ""}`} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            {showArsip ? "Tutup Arsip" : "Arsip Warta"}
                        </span>
                    </button>

                    {showArsip && (
                        <div className="mt-4 space-y-4 animate-in slide-in-from-top-4 duration-500">
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
                                            href={`https://drive.google.com/uc?export=download&id=${item.warta}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all active:scale-[0.98]"
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

export default IbadahTab;