import React, { useState, useEffect } from 'react';
import { Download, Loader2, BookOpen, Users, Baby, Moon, Newspaper, FileText } from 'lucide-react';

let cachedIbadahData: any = null;

const IbadahTab = () => {
    const [data, setData] = useState<any>(cachedIbadahData);
    const [loading, setLoading] = useState(!cachedIbadahData);

    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoIpT64H7mZe1JiK8yPpr0HhXSr7dgfM5zM8sOzzLhz0SviQoJzxN425Ln9UxqRU19-R_1p4IpI3DK/pub?output=csv";

    const extractId = (input: string) => {
        if (!input || input === "" || input === "-") return null;
        const url = input.trim();
        if (!url.includes('/')) return url;
        const match = url.match(/\/d\/([^/]+)|id=([^&]+)/);
        return match ? (match[1] || match[2]) : url;
    };

    useEffect(() => {
        if (cachedIbadahData) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`${CSV_URL}&t=${new Date().getTime()}`);
                const text = await res.text();
                const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");

                if (rows.length > 1) {
                    // Ambil Label dari Baris 1 (Header)
                    const headers = rows[0].split(',').map(v => v.replace(/^"|"$/g, '').trim());
                    // Ambil Data dari Baris 2
                    const cols = rows[1].split(',').map(v => v.replace(/^"|"$/g, '').trim());

                    const result = {
                        minggu: cols[0],
                        tanggal: cols[1],
                        warta: extractId(cols[2]),
                        umum: extractId(cols[3]),
                        remaja: extractId(cols[4]),
                        sm: extractId(cols[5]),
                        sore: extractId(cols[6]),
                        // Dokumen Tambahan dengan Label Otomatis dari Header Sheet
                        lainnya: [
                            { label: headers[7], id: extractId(cols[7]) },
                            { label: headers[8], id: extractId(cols[8]) },
                            { label: headers[9], id: extractId(cols[9]) },
                            { label: headers[10], id: extractId(cols[10]) },
                            { label: headers[11], id: extractId(cols[11]) },
                        ].filter(item => item.id)
                    };
                    cachedIbadahData = result;
                    setData(result);
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchData();
    }, []);

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
                label: doc.label, // Menggunakan nama kolom dari Google Sheets
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
                            {section.items.map((item, iIdx) => (
                                <a
                                    key={iIdx}
                                    href={`https://drive.google.com/uc?export=download&id=${item.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-between p-5 rounded-3xl transition-all active:scale-[0.97] group ${item.primary ? "bg-slate-900 text-white shadow-xl" : "bg-white border-2 border-slate-100 text-slate-900 shadow-sm hover:border-slate-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={item.primary ? "text-slate-400" : "text-slate-900"}>{item.icon}</div>
                                        <span className="text-[12px] font-black uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <Download size={18} className={item.primary ? "text-white" : "text-slate-300 group-hover:text-slate-900"} />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IbadahTab;