import React, { useState, useEffect } from 'react';
import { Loader2, Users, ChevronDown, ChevronUp } from 'lucide-react';

let cachedFungsionarisData: any[] | null = null;

const FungsionarisCard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fungsionarisList, setFungsionarisList] = useState<any[]>(cachedFungsionarisData || []);
    const [loading, setLoading] = useState(false);

    const TSV_URL = import.meta.env.VITE_FUNGSIONARIS_TSV_URL;

    const formatDriveLink = (url: string) => {
        if (!url || url.trim() === "") return null;
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w600` : url;
        }
        return url;
    };

    const fetchFungsionaris = async () => {
        if (cachedFungsionarisData) return;
        setLoading(true);
        try {
            const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
            const text = await response.text();
            const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");

            if (rows.length > 5) {
                const parsedData = rows.slice(5).map(row => {
                    const cols = row.split('\t').map(v => v.trim());
                    return {
                        name: cols[0] || "Nama",
                        role: cols[1] || "Fungsionaris",
                        phone: cols[2] || "",
                        bio: cols[3] || "-",
                        img: formatDriveLink(cols[4]),
                    };
                });
                cachedFungsionarisData = parsedData;
                setFungsionarisList(parsedData);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFungsionaris();
    }, []);

    return (
        <div className="w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center p-6 bg-white active:bg-slate-50 active:scale-[0.99] transition-all relative"
            >
                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase text-center">
                    Fungsionaris
                </h3>
                <div className="text-slate-400 absolute right-6">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </button>

            {isOpen && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100/50 overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-slate-400" size={28} />
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {fungsionarisList.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-5 p-5 hover:bg-white transition-colors cursor-default group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                            {item.img ? (
                                                <img src={item.img} className="w-full h-full object-cover" alt="profile" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Users size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-tight truncate">
                                                {item.name}
                                            </h4>
                                            <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">
                                                {item.role}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FungsionarisCard;