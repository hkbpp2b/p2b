// GivingTab.tsx
import React, { useState } from 'react';
import { Copy, Wallet, Check, ChevronDown } from 'lucide-react';
import qrisLogo from '../../assets/Logo-qris.png';
import gpnLogo from '../../assets/Logo-gpn.png';
import qrUtama from '../../assets/qrhuria.png';
import qrPembangunan from '../../assets/qrhuria.png';
import qrPendidikan from '../../assets/qrhuria.png';

const GIVING_DATA = [
    {
        id: 'utama',
        title: 'Rekening Huria',
        qrUrl: qrUtama,
        bank: 'BANK MANDIRI',
        norek: '1670002830270',
        an: 'Huria Kristen Batak Protestan',
        nmid: 'IDXXXXXXXXXX'
    },
    {
        id: 'pembangunan_mandiri',
        title: 'Rekening Pembangunan',
        qrUrl: qrPembangunan,
        bank: 'BANK MANDIRI',
        norek: '1670004506258',
        an: 'Huria Kristen Batak Protestan',
        nmid: 'IDXXXXXXXXXXX'
    },
    {
        id: 'pembangunan_bni',
        title: 'Rekening Orangtua Asuh',
        qrUrl: qrPembangunan,
        bank: 'BANK MANDIRI',
        norek: '1670003086641',
        an: 'Huria Kristen Batak Protestan',
        nmid: 'IDXXXXXXXXXXX'
    },
    {
        id: 'pendidikan',
        title: 'Rekening Pendidikan',
        qrUrl: qrPendidikan,
        bank: 'BANK MANDIRI',
        norek: '1670010814068',
        an: 'Huria Kristen Batak Protestan',
        nmid: 'IDXXXXXXXXXXXX'
    }
];

const GivingTab = () => {
    const [expandedId, setExpandedId] = useState<string | null>(GIVING_DATA[0].id);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="pb-32 pt-8 px-5 space-y-8">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Persembahan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Metode Non-Tunai</p>
            </header>

            <div className="space-y-4">


                <div className="space-y-3">
                    {GIVING_DATA.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-[1.5rem] border transition-all duration-300 ${expandedId === item.id ? 'border-slate-300 shadow-xl' : 'border-slate-100 shadow-sm'}`}
                        >
                            <div
                                onClick={() => toggleExpand(item.id)}
                                className="w-full flex items-center p-5 cursor-pointer active:scale-[0.98] transition-transform"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedId === item.id ? "bg-[#ea1c24] text-white" : "bg-slate-50 text-slate-400"}`}>
                                    <Wallet size={18} />
                                </div>

                                <div className="ml-4 flex-grow">
                                    <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.bank}</p>
                                </div>

                                <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`} />
                            </div>




                            <div className={`transition-all duration-500 overflow-hidden ${expandedId === item.id ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4">
                                    <div className="bg-white rounded-[1rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden mx-auto max-w-sm relative">
                                        <div
                                            className="absolute left-0 top-[25%] w-16 h-32 bg-[#ea1c24] z-0"
                                            style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                                        />
                                        <div
                                            className="absolute right-0 bottom-20 w-20 h-20 bg-[#ea1c24] z-0"
                                            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                                        />
                                        <div className="relative z-10 p-6 flex flex-col items-center">
                                            <div className="flex justify-between items-center w-full mb-8">
                                                <img src={qrisLogo} alt="QRIS" className="h-4 object-contain" />
                                                <img src={gpnLogo} alt="GPN" className="h-6 object-contain" />
                                            </div>
                                            <div className="text-center mb-6">
                                                <p className="text-[16px] font-black text-slate-900">{item.an}</p>
                                                <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-tight">NMID: {item.nmid}</p>
                                            </div>
                                            <div className="bg-white p-1 border-slate-100 border-[12px] border-white shadow-sm w-[85%] aspect-square flex items-center justify-center overflow-hidden">
                                                <img src={item.qrUrl} alt="QR" className="w-full h-full object-contain scale-110" />
                                            </div>
                                            <div className="mt-6 text-center">
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.1em]">Satu QRIS Untuk Semua</p>
                                                <p className="text-[9px] font-bold text-slate-400 mt-1 italic">Cek aplikasi penyelenggara di: www.aspi-qris.id</p>
                                            </div>
                                        </div>
                                        <div className="p-4 relative z-10">
                                            <button
                                                onClick={(e) => handleCopy(item.norek, item.id, e)}
                                                className="w-full py-4 px-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between active:scale-95 transition-all shadow-sm"
                                            >
                                                <div className="text-left">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.bank}</p>
                                                    <p className="text-md font-black text-slate-900 tracking-tight">{item.norek}</p>
                                                </div>
                                                <div className={`p-2.5 rounded-xl transition-colors ${copiedId === item.id ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                    {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GivingTab;