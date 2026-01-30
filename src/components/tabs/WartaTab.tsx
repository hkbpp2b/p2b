import React, { useState, useEffect } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';

// CACHE Global: Agar data tidak hilang saat navigasi antar tab
let cachedWartaData: any = null;

const WartaTab = () => {
    const [warta, setWarta] = useState<any>(cachedWartaData);
    const [loading, setLoading] = useState(!cachedWartaData);

    // URL Google Sheets (CSV)
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoIpT64H7mZe1JiK8yPpr0HhXSr7dgfM5zM8sOzzLhz0SviQoJzxN425Ln9UxqRU19-R_1p4IpI3DK/pub?output=csv";

    useEffect(() => {
        if (cachedWartaData) return;

        const fetchWartaData = async () => {
            try {
                // Cache buster agar data selalu fresh
                const response = await fetch(`${CSV_URL}&t=${new Date().getTime()}`);
                const csvText = await response.text();
                const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== "");

                if (rows.length > 1) {
                    // Split kolom dan bersihkan karakter kutip/spasi
                    const columns = rows[1].split(',').map(v => v.replace(/^"|"$/g, '').trim());

                    const data = {
                        minggu: columns[0],    // "MINGGU SEPTUAGESIMA"
                        judul: columns[1],     // "Welcome Home"
                        pdfId: columns[5],     // INDEKS 5: Link PDF Warta
                        previewId: columns[6], // INDEKS 6: Link PNG/Gambar Warta
                    };

                    cachedWartaData = data;
                    setWarta(data);
                }
            } catch (error) {
                console.error("Gagal sinkronisasi Warta:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWartaData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="animate-spin text-slate-900" size={32} />
                <p className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Memuat Warta...</p>
            </div>
        );
    }

    // Konstruksi URL Google Drive
    const pdfUrl = `https://drive.google.com/uc?export=download&id=${warta?.pdfId}`;
    const previewUrl = `https://drive.google.com/thumbnail?id=${warta?.previewId}&sz=w1000`;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-32 px-2">
            <section className="space-y-6">
                <header className="px-1 text-center space-y-3">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Warta Jemaat</h2>

                    {/* Badge Minggu - Slate 900 & Font 12px */}
                    <div className="inline-block bg-slate-900 px-6 py-2.5 rounded-full shadow-lg">
                        <p className="text-[12px] text-white font-black uppercase tracking-[0.1em]">
                            {warta?.minggu || "Minggu Warta"}
                        </p>
                    </div>

                    <p className="text-sm text-slate-500 font-extrabold uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
                        {warta?.judul || "Judul tidak tersedia"}
                    </p>
                </header>

                <div className="px-2">
                    {/* Card Container dengan Border Putih 8px */}
                    <div className="relative bg-white rounded-[3rem] border-[8px] border-white shadow-2xl shadow-slate-300 overflow-hidden group">

                        {/* Area Preview Gambar */}
                        <div className="aspect-[3/4] bg-slate-100 flex items-center justify-center">
                            {warta?.previewId ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview Warta"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://placehold.co/600x800/f1f5f9/64748b?text=Warta+Belum+Tersedia";
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center text-slate-300">
                                    <AlertCircle size={48} />
                                    <p className="text-xs font-bold mt-2 uppercase">ID Warta Kosong</p>
                                </div>
                            )}
                        </div>

                        {/* Overlay Gradien Slate 900 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                        {/* Button Action - Font 12px */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-8">
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-white text-slate-900 w-full py-5 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-2xl active:scale-95 transition-all duration-300"
                            >
                                <Download size={20} className="text-slate-900" />
                                Download PDF Warta
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WartaTab;