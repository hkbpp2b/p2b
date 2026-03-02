// BukuEndeCard.tsx
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import BUKU_ENDE_DATA from '../../assets/bev1.json';

interface BukuEndeCardProps {
    onBack: () => void;
}

const BukuEndeCard = ({ onBack }: BukuEndeCardProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSongSelectOpen, setIsSongSelectOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentSong = BUKU_ENDE_DATA[currentIndex];

    const filteredSongs = useMemo(() => {
        if (!searchQuery) return BUKU_ENDE_DATA.slice(0, 20);
        return BUKU_ENDE_DATA.filter(song =>
            song.id.toString().includes(searchQuery) ||
            song.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 50);
    }, [searchQuery]);

    const handleNext = () => {
        if (currentIndex < BUKU_ENDE_DATA.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const selectSong = (id: string) => {
        const index = BUKU_ENDE_DATA.findIndex(s => s.id === id);
        if (index !== -1) {
            setCurrentIndex(index);
            setIsSongSelectOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className="fixed lg:absolute inset-0 z-[60] bg-[#f8f9fa] flex flex-col overflow-hidden animate-in slide-in-from-right lg:slide-in-from-none duration-300">
            <header className="flex-none bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-20"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setIsSongSelectOpen(true)}
                        className="px-3 py-1 hover:bg-slate-100 rounded-lg transition-colors text-center"
                    >
                        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">BE {currentSong.id}</h2>
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === BUKU_ENDE_DATA.length - 1}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-20"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="w-9" />
            </header>

            <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-2xl mx-auto p-4 space-y-10 pb-32">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight px-4">
                            {currentSong.title}
                        </h1>

                    </div>

                    <div className="space-y-12">
                        {currentSong.verses.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-left text-left space-y-5">
                                <span className="w-9 h-2 flex items-center justify-center  text-slate-900 text-[12px]">
                                    {item.bait}
                                </span>
                                <p className="text-[17px] leading-[1.8] text-slate-900 font-serif px-2 whitespace-pre-line">
                                    {item.teks}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isSongSelectOpen && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
                    <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 flex-none bg-white">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-900">Cari Nomor BE</span>
                        <button onClick={() => setIsSongSelectOpen(false)} className="p-2 -mr-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} className="text-slate-900" />
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex-none relative">
                        <Search size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nomor atau judul..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        <div className="grid grid-cols-1 gap-2">
                            {filteredSongs.map((song) => (
                                <button
                                    key={song.id}
                                    onClick={() => selectSong(song.id)}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group"
                                >
                                    <span className="text-xl font-black opacity-20 group-hover:opacity-100 w-12 text-left">{song.id}</span>
                                    <span className="text-sm font-bold uppercase tracking-tight text-left truncate flex-1">{song.title}</span>
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