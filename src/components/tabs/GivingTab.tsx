import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Copy, ChevronRight, Wallet, Loader2, QrCode } from 'lucide-react';

let cachedGivingData: any[] | null = null;

const GivingTab = () => {
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [givingData, setGivingData] = useState<any[]>(cachedGivingData || []);
    const [loading, setLoading] = useState(!cachedGivingData);


    const TSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoIpT64H7mZe1JiK8yPpr0HhXSr7dgfM5zM8sOzzLhz0SviQoJzxN425Ln9UxqRU19-R_1p4IpI3DK/pub?gid=1003566266&single=true&output=tsv";

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

                        console.log(`Baris ${index + 1}:`, cols);

                        let rawQr = cols[2] || "";

                        if (rawQr.includes('drive.google.com')) {
                            const fileId = rawQr.match(/\/d\/(.+?)\//) || rawQr.match(/id=(.+?)(&|$)/);
                            if (fileId) {
                                rawQr = `https://lh3.googleusercontent.com/u/0/d/${fileId[1]}=w1000`;
                            }
                        }

                        return {
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
    }, []);

    const copyToClipboard = (text: string) => {
        if (!text || text === "-") return;
        navigator.clipboard.writeText(text);
        alert("Nomor rekening disalin!");
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
    );

    return (
        <div className="animate-in fade-in duration-700 pb-32 pt-8 px-5 space-y-10">
            {/* Header */}
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Persembahan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Transfer atau scan kode QR</p>
            </header>

            {/* --- LIST VIEW --- */}
            <div className="grid grid-cols-1 gap-4">
                {givingData.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedItem(item)}
                        className="flex items-center p-5 bg-white rounded-[2rem] border border-slate-100 active:scale-[0.98] transition-all group shadow-sm text-left"
                    >
                        <div className={`flex-shrink-0 w-14 h-14 rounded-[1.2rem] flex items-center justify-center ${item.norek === "-" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-900"}`}>
                            <Wallet size={24} />
                        </div>

                        <div className="ml-5 flex-grow min-w-0 text-left">
                            <h3 className="text-[14px] font-black text-slate-900 uppercase leading-tight break-words">
                                {item.title}
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-1 break-words">
                                {item.desc}
                            </p>
                        </div>

                        <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-900 transition-colors ml-2" />
                    </button>
                ))}
            </div>

            {/* --- MODAL DETAIL (DIBUKA SAAT LIST DI-KLIK) --- */}
            {selectedItem && createPortal(
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setSelectedItem(null)}
                    />

                    <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col border border-slate-50 overflow-hidden">
                        <div className="flex flex-col items-center text-center">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-8 text-slate-300 hover:text-slate-900 transition-colors"
                            >

                            </button>

                            <div className="mb-6 mt-2">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{selectedItem.title}</h3>
                                <p className="text-[16px] text-blue-600 font-black uppercase mt-1 tracking-widest">{selectedItem.bank}</p>
                            </div>

                            {/* Area QR - Diperbarui agar fit dan jelas */}
                            <div className="bg-white w-full aspect-square rounded-[2.5rem] p-2 mb-8 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                                {selectedItem.qrUrl && selectedItem.qrUrl !== "" ? (
                                    <img
                                        src={selectedItem.qrUrl}
                                        alt="QR Code"
                                        key={selectedItem.qrUrl}
                                        className="w-full h-full object-contain animate-in fade-in zoom-in duration-500"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            if (e.currentTarget.parentElement) {
                                                e.currentTarget.parentElement.innerHTML = `
                        <div class="text-slate-300 text-[10px] font-black uppercase tracking-widest text-center px-4">
                            Gagal Memuat QR<br/>Pastikan Link Direct Image
                        </div>`;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="text-center space-y-2 opacity-20">
                                        <QrCode size={60} className="mx-auto text-slate-900" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">QR Belum Tersedia</p>
                                    </div>
                                )}
                            </div>

                            {/* Tombol Salin */}
                            <button
                                onClick={() => copyToClipboard(selectedItem.norek)}
                                className="w-full bg-slate-900 text-white p-6 rounded-[1.8rem] flex items-center justify-between active:scale-95 transition-all shadow-xl shadow-slate-200 group"
                            >
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Klik untuk Salin</p>
                                    <p className="text-[18px] font-black tracking-tighter leading-none">{selectedItem.norek}</p>
                                    <p className="text-[14px] text-slate-100 font-bold uppercase mt-1.5 truncate max-w-[180px]">A.N {selectedItem.an}</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-2xl">
                                    <Copy size={18} className="text-white" />
                                </div>
                            </button>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="mt-8 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default GivingTab;