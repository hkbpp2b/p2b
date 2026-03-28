// JadwalCard.tsx
import React, { useState, useEffect } from 'react';

interface JadwalCardProps {
    onSelectDetail?: (detail: any) => void;
    isDesktop?: boolean;
}

const JadwalCard = ({ onSelectDetail, isDesktop }: JadwalCardProps) => {
    const [selectedJadwal, setSelectedJadwal] = useState<string | null>(null);
    const [dataPelayan, setDataPelayan] = useState<any>({});
    const [tanggalMinggu, setTanggalMinggu] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const LIVE_URL = "https://www.youtube.com/@hkbpperumnas2bekasi/live";
    const TSV_URL = import.meta.env.VITE_TSV_PELAYAN_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(TSV_URL);
                const text = await response.text();
                const rows = text.split('\n').map(row =>
                    row.split('\t').map(cell => cell.replace(/[\r\n]+/g, " ").trim())
                );

                if (rows.length > 1) {
                    setTanggalMinggu(rows[1][0] || "");
                }

                const mappedData = {
                    "06.00": formatDetail(rows, 2),
                    "10.00": formatDetail(rows, 3),
                    "18.00": formatDetail(rows, 4),
                    "08.00": formatDetail(rows, 5),
                    "remaja": formatDetail(rows, 6)
                };
                setDataPelayan(mappedData);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDetail = (rows: string[][], colIndex: number) => {
        const details = [];
        for (let i = 1; i < rows.length; i++) {
            const label = rows[i][1];
            const name = rows[i][colIndex];
            if (label && name && name.length > 1) {
                details.push({ label, name });
            }
        }
        return details;
    };

    const jadwal = [
        { id: "06.00", name: "Ibadah Subuh", time: "06.00" },
        { id: "08.00", name: "Sekolah Minggu", time: "08.00" },
        { id: "10.00", name: "Ibadah Pagi", time: "10.00" },
        { id: "10.00_live", name: "Livestreaming", time: "10.00", isLive: true, link: LIVE_URL },
        { id: "remaja", name: "Ibadah Remaja", time: "10.00" },
        { id: "18.00", name: "Ibadah Sore", time: "18.00" }
    ];

    const handleClick = (item: any) => {
        if (isDesktop && onSelectDetail) {
            onSelectDetail({
                type: 'jadwal',
                ...item,
                pelayan: dataPelayan[item.id] || [],
                tanggal: tanggalMinggu
            });
        } else {
            setSelectedJadwal(selectedJadwal === item.id ? null : item.id);
        }
    };

    return (
        <div className="p-6 rounded-[2.5rem] shadow-sm border border-slate-100 bg-white relative overflow-hidden">
            <div className="mb-4 text-center">
                <h3 className="text-xl font-black text-blue-900 tracking-tighter uppercase">Ibadah Minggu</h3>
                <p className="text-[12px] text-slate-900 font-bold uppercase tracking-[0.1em]">{tanggalMinggu}</p>
            </div>
            <div className="space-y-3">
                {jadwal.map((item, i) => {
                    const isActive = selectedJadwal === item.id;
                    return (
                        <div key={i} className="group">
                            <button
                                onClick={() => handleClick(item)}
                                className={`w-full flex items-center justify-between p-4 px-6 rounded-[2rem] transition-all duration-300 active:scale-[0.97] group border ${isActive
                                    ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200"
                                    : item.isLive
                                        ? "bg-white border-red-100 hover:border-red-200 text-slate-900"
                                        : "bg-white border-slate-100 hover:border-slate-300 text-slate-900"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-left flex flex-col gap-0.5">
                                        <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${isActive ? "text-slate-400" : "text-slate-900"}`}>
                                            {item.time} WIB
                                        </span>
                                        <span className="text-[13px] font-black uppercase tracking-tight">
                                            {item.name}
                                        </span>
                                    </div>
                                </div>

                                <div className={`transition-all duration-300 ${isActive ? "rotate-180" : "opacity-40 group-hover:opacity-100"}`}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                            </button>

                            {!isDesktop && isActive && (
                                <div className="mt-3 mx-1 p-5 bg-white rounded-[2rem] border border-slate-100 animate-in fade-in zoom-in-95 duration-400">
                                    {item.isLive ? (
                                        <div className="flex flex-col items-center py-4">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-6 text-center leading-relaxed">
                                                Livestreaming Ibadah <br /> via YouTube
                                            </p>
                                            <button
                                                onClick={() => window.open(item.link, '_blank')}
                                                className="w-full bg-red-600 text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                            >
                                                <span className="text-[12px] font-black uppercase tracking-widest">Buka Youtube</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="flex flex-col items-center gap-1 border-b border-slate-50 pb-4">
                                                <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">Pelayan {item.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{tanggalMinggu}</span>
                                            </div>
                                            <div className="divide-y divide-slate-200">
                                                {loading ? <div className="py-10 flex justify-center"></div> :
                                                    dataPelayan[item.id]?.map((p: any, idx: number) => (
                                                        <div key={idx} className="py-2 first:pt-0 last:pb-0">
                                                            <div className="flex gap-4">
                                                                <div className="w-24 shrink-0 pt-0.5">
                                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{p.label}</span>
                                                                </div>
                                                                <div className="flex-grow space-y-2">
                                                                    {p.name.split(',').map((name: string, nIdx: number) => (
                                                                        <span key={nIdx} className="text-[11px] font-bold text-slate-700 block">{name.trim()}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JadwalCard;