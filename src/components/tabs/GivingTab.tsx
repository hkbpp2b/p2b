// GivingTab.tsx
import React, { useState } from 'react';
import { Copy, Wallet, Check, ChevronDown, Download, X } from 'lucide-react';
import downloadFile from '../../assets/qris.png';
// Asumsi asset tambahan untuk swipe, jika belum ada bisa disesuaikan link-nya
import downloadFile2 from '../../assets/qrisGerakanAnakAsuh.png';
import downloadFile3 from '../../assets/qrisRekPembangunganGereja.png';

const GIVING_DATA = [
    {
        id: 'utama',
        title: 'Rekening Huria',
        bank: 'BANK MANDIRI',
        norek: '1670002830270',
        an: 'Huria Kristen Batak Protestan'
    },
    {
        id: 'pembangunan_mandiri',
        title: 'Rekening Pembangunan',
        bank: 'BANK MANDIRI',
        norek: '1670004506258',
        an: 'Huria Kristen Batak Protestan'
    },
    {
        id: 'pembangunan_bni',
        title: 'Rekening Orangtua Asuh',
        bank: 'BANK MANDIRI',
        norek: '1670003086641',
        an: 'Huria Kristen Batak Protestan'
    },
    {
        id: 'pendidikan',
        title: 'Rekening PPG',
        bank: 'BANK MANDIRI',
        norek: '1670010814068',
        an: 'Huria Kristen Batak Protestan'
    }
];

const QRIS_LIST = [
    { src: downloadFile, name: 'QRIS Utama', filename: 'QRIS-HKBP.png' },
    { src: downloadFile2, name: 'QRIS Anak Asuh', filename: 'QRIS-Anak-Asuh.png' },
    { src: downloadFile3, name: 'QRIS Pembangunan', filename: 'QRIS-Pembangunan.png' }
];

const GivingTab = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<{ src: string; filename: string } | null>(null);

    const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000);
            }
        } catch (err) {
            console.error('Gagal menyalin:', err);
        }
        document.body.removeChild(textArea);
    };

    const handleDownloadQR = (src: string, filename: string) => {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };


    return (
        <div className="animate-in fade-in duration-700 pb-32 pt-8 space-y-10">
            {/* Style untuk menyembunyikan scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />

            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">PERSEMBAHAN</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">QRIS dan Rekening Gereja</p>
            </header>

            {/* QRIS Swipe Section */}
            <div className="relative w-full overflow-hidden">
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 pb-1 gap-2 items-center">
                    {QRIS_LIST.map((qris, idx) => (
                        <div
                            key={idx}
                            className="flex-none w-[95%] snap-center"
                            onClick={() => setSelectedImage({ src: qris.src, filename: qris.filename })}
                        >
                            <div className="bg-white shadow-sm rounded-[2.5rem] border border-slate-200 overflow-hidden w-full relative cursor-pointer active:scale-95 transition-transform group">
                                <img
                                    src={qris.src}
                                    alt={qris.name}
                                    className="w-full h-full object-contain scale-100"
                                />
                            </div>
                        </div>
                    ))}
                    {/* Spacer penyeimbang swipe */}
                    <div className="flex-none w-[2%]" />
                </div>
            </div>

            {/* Modal Viewer */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)} // Klik di mana saja untuk tutup
                >


                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-3 right-4 z-[999] p-2 text-white"
                    >
                        <X size={24} />
                    </button>

                    {/* Container Konten - FULL SCREEN Tanpa Padding */}
                    <div
                        className="relative w-full h-full flex items-center justify-center overflow-hidden"
                        onClick={e => e.stopPropagation()} // Mencegah klik di gambar menutup modal
                    >
                        {/* Gambar - Mengisi Penuh Layar (object-cover agar penuh, atau object-contain agar proporsional) */}
                        <img
                            src={selectedImage.src}
                            alt="QRIS Full"
                            // Gunakan h-full w-full object-contain agar gambar utuh terlihat dan pas di layar
                            // Gunakan h-full w-full object-cover jika ingin gambar memaksa memenuhi layar (terpotong dikit tidak apa-apa)
                            className="absolute inset-0 w-full h-full object-contain animate-in zoom-in-100 duration-300"
                        />

                        {/* Tombol Unduh - Melayang di Bagian Bawah Gambar */}
                        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center px-6">
                            <button
                                onClick={() => handleDownloadQR(selectedImage.src, selectedImage.filename)}
                                className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-2xl  font-bold text-[11px] uppercase z-20"
                            >
                                <Download size={16} />
                                Unduh Qris
                            </button>


                        </div>
                    </div>
                </div>
            )}

            <div className="px-4">
                <div className="pt-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="w-full p-5">
                        <div className="mb-2 px-2 text-center pointer-events-none">
                            <h3 className="text-xl font-black text-blue-900 tracking-tighter uppercase">Rekening Gereja</h3>
                            <p className="text-[12px] text-slate-800 font-bold uppercase tracking-widest">HKBP Perumnas 2 Bekasi</p>
                        </div>

                        <div className="space-y-3 pt-4">
                            {GIVING_DATA.map((item) => (
                                <div key={item.id} className={`bg-white rounded-[1.5rem] border-2 transition-all duration-300 ${expandedId === item.id ? 'border-slate-300 shadow-lg' : 'border-slate-100'}`}>
                                    <div onClick={() => toggleExpand(item.id)} className="w-full flex items-center px-4 py-3 cursor-pointer">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedId === item.id ? "bg-blue-900 text-white" : "bg-slate-50 text-slate-400"}`}>
                                            <Wallet size={18} />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.bank}</p>
                                        </div>
                                        <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`} />
                                    </div>

                                    <div className={`transition-all duration-500 overflow-hidden ${expandedId === item.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-5 pb-5">
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-[13px] font-black text-slate-900 tracking-tight">{item.norek}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.an}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => handleCopy(item.norek, item.id, e)}
                                                    className={`p-2.5 rounded-xl transition-all ${copiedId === item.id ? 'bg-blue-500 text-white' : 'bg-white border border-slate-200 text-slate-400 shadow-sm active:scale-90'}`}
                                                >
                                                    {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center space-y-2 w-full">
                <div className="pt-2 px-4">
                    <p className="text-[11px] font-medium text-slate-400 leading-tight italic">
                        Persembahan sangat berarti bagi kemuliaan Tuhan dan pelayanan sesama. Terima kasih
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GivingTab;