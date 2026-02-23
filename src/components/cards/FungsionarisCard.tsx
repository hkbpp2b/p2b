import React, { useState, useEffect } from 'react';
import { Loader2, Users, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

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

    const handleContact = (phone: string) => {
        const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm active:scale-[0.99] transition-all"
            >
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Fungsionaris</h3>
                <div className="text-slate-400">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </button>

            {isOpen && (
                <div className="mt-3 p-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-slate-400" size={28} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {fungsionarisList.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleContact(item.phone)}
                                    className="flex items-center gap-5 p-4 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group"
                                >
                                    <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                        {item.img ? (
                                            <img src={item.img} className="w-full h-full object-cover" alt="profile" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Users size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-tight break-words">
                                            {item.name}
                                        </h4>
                                        <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">
                                            {item.role}
                                        </p>
                                    </div>
                                    <div className="text-slate-300 group-hover:text-green-500 transition-colors flex-shrink-0">
                                        <MessageCircle size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FungsionarisCard;