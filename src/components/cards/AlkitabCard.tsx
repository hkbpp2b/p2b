// AlkitabCard.tsx
import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface AlkitabCardProps {
    onBack: () => void;
}

const AlkitabCard = ({ onBack }: AlkitabCardProps) => {
    const [version, setVersion] = useState<'TB' | 'BT'>('TB');
    const [isVersionOpen, setIsVersionOpen] = useState(false);
    const [isBookSelectOpen, setIsBookSelectOpen] = useState(false);

    const versions = [
        { id: 'TB', name: 'Terjemahan Baru' },
        { id: 'BT', name: 'Batak Toba' }
    ];

    const daftarKitab = [
        "Kejadian", "Keluaran", "Imamat",
    ];

    return (
        <div className="fixed inset-0 z-[60] bg-[#f8f9fa] flex flex-col overflow-hidden">
            <header className="flex-none bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-300">
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setIsBookSelectOpen(true)}
                        className="px-3 py-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Kejadian 1</h2>
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-300">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsVersionOpen(!isVersionOpen)}
                        className="flex items-center gap-1 border border-slate-300 px-2 py-0.5 rounded bg-slate-50"
                    >
                        <span className="text-[10px] font-black text-slate-700">{version}</span>
                        <div className="border-l border-slate-300 h-3 mx-1" />
                        <div className={`w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-slate-600 transition-transform ${isVersionOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isVersionOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[70]">
                            {versions.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => {
                                        setVersion(v.id as 'TB' | 'BT');
                                        setIsVersionOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${version === v.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {v.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-6 space-y-8 pb-32">
                    <div className="py-4 border-b border-slate-200">
                        <h1 className="text-xl font-black text-slate-900 text-center leading-relaxed uppercase tracking-tight">
                            {version === 'TB' ? 'Allah menciptakan langit dan bumi serta isinya' : 'I. Mula ni tano on 1.'}
                        </h1>
                    </div>

                    <div className="space-y-6 text-[17px] leading-[1.8] font-serif text-slate-700">
                        <p className="relative pl-8">
                            <span className="absolute left-0 top-1 text-blue-600 font-bold text-xs">1</span>
                            {version === 'TB' ? 'Pada mulanya Allah menciptakan langit dan bumi.' : 'Di mula ni mulana ditompa Debata langit dohot tano on.'}
                        </p>
                        <p className="relative pl-8">
                            <span className="absolute left-0 top-1 text-blue-600 font-bold text-xs">2</span>
                            {version === 'TB' ? 'Bumi belum berbentuk dan kosong; gelap gulita menutupi samudera raya, dan Roh Allah melayang-layang di atas permukaan air.' : 'Dung i tarulang ma tano i gabe halongonan jala holom di atas lung i, dung i mangareapreap ma Tondi ni Debata di atas ni angka aek.'}
                        </p>
                    </div>
                </div>
            </div>

            {isBookSelectOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 flex-none">
                        <span className="text-sm font-black uppercase tracking-widest text-slate-900">Pilih Kitab</span>
                        <button onClick={() => setIsBookSelectOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={24} className="text-slate-900" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-2 gap-2">
                            {daftarKitab.map((kitab, idx) => (
                                <button key={idx} onClick={() => setIsBookSelectOpen(false)} className="p-4 text-left rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all">
                                    <span className="text-[12px] font-bold uppercase tracking-tight">{kitab}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlkitabCard;