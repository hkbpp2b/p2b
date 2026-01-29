import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // Wajib diimport
import { QrCode, Copy, ZoomIn } from 'lucide-react';

const GivingTab = () => {
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    const qrisData = [
        {
            title: "Persembahan Umum",
            desc: "Pelean Minggu & Kas Gereja",
            qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=PELEAN_HKBP",
            bank: "Bank Mandiri",
            norek: "1670001234567",
            an: "HKBP Perumnas 2"
        },
        {
            title: "Dana Pembangunan",
            desc: "Renovasi & Fasilitas",
            qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=PEMBANGUNAN_HKBP",
            bank: "Bank BRI",
            norek: "001201000456789",
            an: "HKBP Perumnas 2"
        }
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Nomor rekening disalin!");
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-32 pt-4">
            <header className="px-1 text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Persembahan</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Saluran Berkat Digital</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 max-w-4xl mx-auto">
                {qrisData.map((item, i) => (
                    <div key={i} className="bg-white rounded-[3.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
                        <div className="text-center mb-8">
                            <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{item.desc}</p>
                        </div>

                        <div
                            onClick={() => setSelectedItem(item)}
                            className="w-full aspect-square bg-slate-50 rounded-[2.5rem] p-6 flex items-center justify-center mb-8 cursor-zoom-in group relative"
                        >
                            <img src={item.qrUrl} alt={item.title} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem] flex items-center justify-center">
                                <ZoomIn className="text-slate-400" size={32} />
                            </div>
                        </div>

                        <button
                            onClick={() => copyToClipboard(item.norek)}
                            className="w-full bg-slate-900 text-white p-5 rounded-[2rem] flex items-center justify-between active:scale-95 transition-all shadow-lg shadow-slate-200"
                        >
                            <div className="text-left">
                                <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">{item.bank}</p>
                                <p className="text-sm font-black tracking-tight">{item.norek}</p>
                            </div>
                            <Copy size={16} className="text-white/30" />
                        </button>
                    </div>
                ))}
            </div>

            {/* MODAL FULLSCREEN - MENGGUNAKAN PORTAL */}
            {selectedItem && createPortal(
                <div
                    className="fixed inset-0 z-[99999] bg-slate-950 flex items-center justify-center p-6 animate-in fade-in duration-300"
                    onClick={() => setSelectedItem(null)}
                >
                    <div className="w-full max-w-sm flex flex-col items-center space-y-8 pointer-events-none">
                        <div className="text-center space-y-2">
                            <h3 className="text-white text-xl font-black uppercase tracking-[0.2em]">
                                {selectedItem.title}
                            </h3>
                            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                                Scan atau Transfer
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[3.5rem] w-full aspect-square shadow-[0_0_60px_rgba(0,0,0,0.8)] pointer-events-auto">
                            <img
                                src={selectedItem.qrUrl}
                                alt="QR Full"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="w-full bg-white/5 border border-white/10 p-7 rounded-[2.5rem] text-center backdrop-blur-md">
                            <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1">
                                {selectedItem.bank}
                            </p>
                            <p className="text-white text-2xl font-black tracking-tighter">
                                {selectedItem.norek}
                            </p>
                            <p className="text-white/20 text-[9px] font-bold uppercase mt-2 tracking-widest">
                                A.N {selectedItem.an}
                            </p>
                        </div>

                        <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.4em]">
                            Klik di mana saja untuk kembali
                        </p>
                    </div>
                </div>,
                document.body // Merender modal langsung di body
            )}
        </div>
    );
};

export default GivingTab;