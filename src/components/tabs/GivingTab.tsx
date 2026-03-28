// GivingTab.tsx
import React, { useState, useRef } from 'react';
import { Copy, Wallet, Check, ChevronDown, Download } from 'lucide-react';
import qrisLogo from '../../assets/Logo-qris.png';
import gpnLogo from '../../assets/Logo-gpn.png';
import qrUtama from '../../assets/qrhuria.png';
import downloadFile from '../../assets/qris.png';

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

const GivingTab = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

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

    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.href = downloadFile;
        link.download = 'QRIS-HKBP.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="pb-32 pt-8 px-5 space-y-8 flex flex-col items-center">
            <header className="text-center space-y-1 w-full">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Persembahan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">QRIS dan Rekening Gereja</p>
            </header>

            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white shadow-2xl  rounded-[40px] shadow-slate-200 border-2 border-slate-100 overflow-hidden w-full max-w-sm relative">
                    <img
                        src={downloadFile}
                        alt="QRIS HKBP"
                        className="w-full h-full object-contain scale-100"
                    />
                </div>
            </div>

            <button
                onClick={handleDownloadQR}
                className="flex items-center justify-center gap-2 bg-[#1e293b] text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-wide hover:bg-slate-800 active:scale-95 transition-al -mt-4 relative z-20"
            >
                <Download size={12} />
                Unduh QRIS
            </button>

            <div className="w-full space-y-4 pt-4">
                <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-8 bg-slate-200" />
                    <span className="text-[15px] font-black text-slate-900 uppercase tracking-[0.1em]">Daftar Rekening</span>
                    <div className="h-px w-8 bg-slate-200" />
                </div>

                <div className="space-y-3">
                    {GIVING_DATA.map((item) => (
                        <div key={item.id} className={`bg-white rounded-[1.5rem] border transition-all duration-300 ${expandedId === item.id ? 'border-slate-300 shadow-lg' : 'border-slate-100 shadow-sm'}`}>
                            <div onClick={() => toggleExpand(item.id)} className="w-full flex items-center p-5 cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedId === item.id ? "bg-[#ea1c24] text-white" : "bg-slate-50 text-slate-400"}`}>
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
                                            className={`p-2.5 rounded-xl transition-all ${copiedId === item.id ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400 shadow-sm active:scale-90'}`}
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