// BukuEndeCard.tsx
import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';

interface BukuEndeCardProps {
    onBack: () => void;
}

const BukuEndeCard = ({ onBack }: BukuEndeCardProps) => {
    const [isSongSelectOpen, setIsSongSelectOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const dummyLirik = [
        {
            bait: 1, teks: "Ringgas ma ho tondingku mamuji Debatanta i Ai diparmudumudu ho unang halupahon i, Disesa do dosamu, didaoni sahitmi, diudut do hosamu, diburi tondimi Huhut diapulapul roham na marsak i Asa tung lam humibul mingot uhumNa i "
        },
        { bait: 2, teks: "Na tolhas do tu hita uhumNa na sumurung i Dibaen holong rohaNa Di angka na porsea i Ai ndada dilaluhon tu hita rimas i Sai lam dipatuduhon denggan basaNa i: Ai songon hasundutan dao sian purba i Holang dibaen Ibana sude dosanta i" },
        { bait: 3, teks: "Asi roha ni ama marnida anakkonna i Suman tusi Jahowa marnida na porsea i Diboto do mulanta na sian tano i Tudoshon bungabunga tudoshon bulung i Disi ro habahaba mamintor habang be Suman tusi do jolma, sai mate do sude. " }
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
                        onClick={() => setIsSongSelectOpen(true)}
                        className="px-3 py-1 hover:bg-slate-100 rounded-lg transition-colors text-center"
                    >
                        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">BE 1</h2>

                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-300">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-8 space-y-10 pb-32">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">RINGGAS MA HO TONDINGKU</h1>
                        <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="space-y-10">
                        {dummyLirik.map((item) => (
                            <div key={item.bait} className="flex flex-col items-center text-center space-y-4">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                                    {item.bait}
                                </span>
                                <p className="text-lg leading-relaxed text-slate-700 font-medium px-4">
                                    {item.teks}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isSongSelectOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
                    <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 flex-none">
                        <span className="text-sm font-black uppercase tracking-widest text-slate-900">Cari Nomor BE</span>
                        <button onClick={() => setIsSongSelectOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={24} className="text-slate-900" />
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50 flex-none">
                        <input
                            type="number"
                            placeholder="Masukkan nomor (1-864)..."
                            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-600 outline-none font-bold text-xs"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-1 gap-2">
                            {[1].map((num) => (
                                <button key={num} onClick={() => setIsSongSelectOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all group">
                                    <span className="text-lg font-black opacity-30 group-hover:opacity-100">{num}</span>
                                    <span className="text-sm font-bold uppercase tracking-tight">RINGGAS MAS HO RONDINGKU</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BukuEndeCard;