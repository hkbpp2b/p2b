// GivingTab.tsx
import React, { useState } from 'react';
import { Copy, Wallet, Check, ChevronDown, Download, X, Maximize2 } from 'lucide-react';
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
    const [isImageOpen, setIsImageOpen] = useState(false);

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
        <div className="animate-in fade-in duration-700 pb-32 pt-8 space-y-10">
            <header className="text-center space-y-1 w-full">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Persembahan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">QRIS dan Rekening Gereja</p>
            </header>

            <div className="relative z-10  flex flex-col items-center group px-5">
                <div
                    onClick={() => setIsImageOpen(true)}
                    className="bg-white shadow-sm rounded-[2.5rem] border border-slate-200 overflow-hidden w-full max-w-sm relative cursor-pointer active:scale-95 transition-transform"
                >
                    <img
                        src={downloadFile}
                        alt="QRIS HKBP"
                        className="w-full h-full object-contain scale-100"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    </div>
                </div>
            </div>

            {isImageOpen && (
                <div
                    className="fixed h-full inset-0 z-[999] flex items-center justify-center bg-black "
                    onClick={() => setIsImageOpen(false)}
                >
                    <button
                        className="absolute top-3 right-2 z-[999] p-2 bg-black text-white"
                        onClick={() => setIsImageOpen(false)}
                    >
                        <X size={32} />
                    </button>

                    <div className="relative max-w-full max-h-[80vh] flex flex-col items-center gap-5">
                        <img
                            src={downloadFile}
                            alt="QRIS HKBP Full"
                            className="max-w-full max-h-[80vh] object-contain animate-in zoom-in-95 duration-300"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadQR();
                            }}
                            className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-2xl  font-bold text-[11px] uppercase z-20"
                        >
                            <Download size={16} />
                            Unduh Qris
                        </button>
                    </div>
                </div>
            )}

            <div className="px-4">
                <div className="pt-4 rounded-[2.5rem] shadow-sm border border-slate-200  relative overflow-hidden">
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