// BukuEndeCard.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Search, ChevronDown, Play, Square, Loader2 } from 'lucide-react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import BUKU_ENDE_DATA from '../../assets/bev2.json';
import BUKU_NYANYIAN_DATA from '../../assets/bnv2.json';
import KIDUNG_JEMAAT_DATA from '../../assets/kjv2.json';

interface SongVerse {
    bait: string;
    teks: string;
}

interface SongData {
    id: string;
    title: string;
    verses: SongVerse[];
}

interface BukuEndeCardProps {
    onBack: () => void;
}

type BookType = 'BE' | 'BN' | 'KJ';

const BukuEndeCard = ({ onBack }: BukuEndeCardProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSongSelectOpen, setIsSongSelectOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentBook, setCurrentBook] = useState<BookType | null>(null);
    const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingMidi, setIsLoadingMidi] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const playerRef = useRef<any>(null);
    const pianoRef = useRef<Soundfont.Player | null>(null);
    const percussionRef = useRef<Soundfont.Player | null>(null);
    const activeNotesRef = useRef<Map<string, any>>(new Map());

    const books: Record<BookType, { label: string; data: SongData[] }> = {
        BE: { label: 'Buku Ende', data: BUKU_ENDE_DATA as SongData[] },
        BN: { label: 'Buku Nyanyian HKBP', data: BUKU_NYANYIAN_DATA as SongData[] },
        KJ: { label: 'Kidung Jemaat', data: KIDUNG_JEMAAT_DATA as SongData[] },
    };

    const currentData = currentBook ? books[currentBook].data : [];
    const currentSong = currentData[currentIndex] || { id: '-', title: 'Data Kosong', verses: [] };

    const filteredSongs = useMemo(() => {
        if (!currentData.length) return [];
        if (!searchQuery) return currentData.slice();
        return currentData.filter(song =>
            song.id.toString().includes(searchQuery) ||
            song.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 50);
    }, [searchQuery, currentData]);

    useEffect(() => {
        return () => {
            stopMidi();
        };
    }, []);

    const initAudio = async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        // Memuat Piano dan Perkusi secara paralel
        if (!pianoRef.current || !percussionRef.current) {
            const [piano, percussion] = await Promise.all([
                Soundfont.instrument(audioContextRef.current, 'acoustic_grand_piano'),
                Soundfont.instrument(audioContextRef.current, 'marimba') // Marimba memberikan tekstur perkusi yang baik untuk MIDI gerejawi
            ]);
            pianoRef.current = piano;
            percussionRef.current = percussion;
        }
    };

    const stopMidi = () => {
        if (playerRef.current) {
            playerRef.current.stop();
        }
        activeNotesRef.current.forEach(node => {
            try { node.stop(); } catch (e) { }
        });
        activeNotesRef.current.clear();
        setIsPlaying(false);
    };

    const playMidi = async () => {
        if (isPlaying) {
            stopMidi();
            return;
        }

        try {
            setIsLoadingMidi(true);
            await initAudio();

            const songId = currentSong.id.padStart(3, '0');
            const bookPrefix = currentBook === 'BN' ? 'BE' : currentBook;

            // Dynamic import file MIDI
            const midiModule = await import(`../../assets/music/${bookPrefix}${songId}.mid`);
            const midiUrl = midiModule.default;

            const response = await fetch(midiUrl);
            if (!response.ok) throw new Error('MIDI file tidak ditemukan');
            const arrayBuffer = await response.arrayBuffer();

            playerRef.current = new MidiPlayer.Player((event: any) => {
                if (!audioContextRef.current || !pianoRef.current || !percussionRef.current) return;

                const key = `${event.noteName}_${event.channel}`;

                if (event.name === 'Note on' && event.velocity > 0) {
                    activeNotesRef.current.get(key)?.stop();

                    // Logic: Jika channel 10 atau velocity tertentu, gunakan perkusi, sisanya piano
                    const instrument = (event.channel === 10) ? percussionRef.current : pianoRef.current;

                    const node = instrument.play(
                        event.noteName,
                        audioContextRef.current.currentTime,
                        {
                            gain: (event.velocity / 128) * (event.channel === 10 ? 0.8 : 1.2)
                        }
                    );

                    if (node) activeNotesRef.current.set(key, node);

                } else if (
                    event.name === 'Note off' ||
                    (event.name === 'Note on' && event.velocity === 0)
                ) {
                    activeNotesRef.current.get(key)?.stop();
                    activeNotesRef.current.delete(key);
                }
            });

            playerRef.current.loadArrayBuffer(arrayBuffer);
            playerRef.current.play();
            setIsPlaying(true);

            playerRef.current.on('endOfFile', () => {
                stopMidi();
            });

        } catch (error) {
            console.error('Error playing MIDI:', error);
            alert('Gagal memutar musik. Pastikan file MIDI tersedia.');
        } finally {
            setIsLoadingMidi(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < currentData.length - 1) {
            stopMidi();
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            stopMidi();
            setCurrentIndex(prev => prev - 1);
        }
    };

    const selectSong = (id: string) => {
        const index = currentData.findIndex(s => s.id === id);
        if (index !== -1) {
            stopMidi();
            setCurrentIndex(index);
            setIsSongSelectOpen(false);
            setSearchQuery('');
        }
    };

    const bookStyles: Record<string, { bg: string; border: string; accent: string }> = {
        ALKITAB: { bg: 'bg-[#1e293b]', border: 'border-slate-800', accent: 'text-[#FFD700]' },
        BIBEL: { bg: 'bg-[#2d3a5a]', border: 'border-[#1e253a]', accent: 'text-[#FFD700]' },
        KJ: { bg: 'bg-[#15803d]', border: 'border-[#14532d]', accent: 'text-[#fbbf24]' },
        BE: { bg: 'bg-[#1e293b]', border: 'border-slate-900', accent: 'text-slate-100' },
        BN: { bg: 'bg-[#2563eb]', border: 'border-[#1e40af]', accent: 'text-[#FFD700]' }
    };

    if (!currentBook) {
        return (
            <div className="fixed lg:absolute inset-0 z-[60] bg-[#f8f9fa] flex flex-col">
                <header className="flex-none border-b border-slate-100 px-4 h-14 flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                    <span className="ml-1 text-s font-bold uppercase text-slate-900">
                        Pilih Buku Lagu
                    </span>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-md mx-auto py-10 px-6">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-10 justify-items-center">
                            {(Object.keys(books) as BookType[]).map((key) => {
                                const style = bookStyles[key] || bookStyles.ALKITAB;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setCurrentBook(key);
                                            setCurrentIndex(0);
                                            setIsSongSelectOpen(true);
                                        }}
                                        className="flex flex-col items-center justify-center gap-4 group active:scale-95 transition-transform w-full"
                                    >
                                        <div className={`relative w-32 h-44 ${style.bg} rounded-sm overflow-hidden border-l-[5px] ${style.border}`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/5"></div>
                                            <div className="absolute inset-x-0 top-6 flex flex-col items-center px-2">
                                                <span className={`${style.accent} text-[13px] font-bold tracking-[0.15em] font-serif text-center uppercase leading-tight`}>
                                                    {books[key].label}
                                                </span>
                                                <div className={`w-8 h-[1px] ${style.accent} opacity-30 mt-2`}></div>
                                            </div>
                                            <div className="absolute bottom-3 right-3 opacity-60">
                                                <div className="w-2 h-2 rounded-full border border-[#FFFFFF]/90 shadow-[0_0_3px_rgba(255,215,0,0.4)]"></div>
                                            </div>
                                            <div className="absolute right-0 inset-y-0 w-[2px] bg-white/10"></div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 font-serif text-center leading-none">
                                                {books[key].label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed lg:absolute inset-0 z-[60] bg-[#f8f9fa] flex flex-col overflow-hidden animate-in slide-in-from-right lg:slide-in-from-none duration-300">
            <header className="flex-none bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => { stopMidi(); setCurrentBook(null); }} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0 || currentData.length === 0}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-20"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setIsSongSelectOpen(true)}
                        className="px-3 py-1 hover:bg-slate-100 rounded-lg transition-colors text-center"
                    >
                        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                            {currentBook} {currentSong.id}
                        </h2>
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === currentData.length - 1 || currentData.length === 0}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-20"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsBookDropdownOpen(!isBookDropdownOpen)}
                        className="flex items-center gap-1 text-[10px] font-black border border-slate-200 px-2 py-0.5 rounded text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                        {currentBook}
                        <ChevronDown size={12} />
                    </button>
                    {isBookDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[70]">
                            {(Object.keys(books) as BookType[]).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        stopMidi();
                                        setCurrentBook(key);
                                        setCurrentIndex(0);
                                        setIsBookDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-[11px] font-bold uppercase transition-colors ${currentBook === key ? 'text-blue-600 bg-blue-50' : 'text-slate-900 hover:bg-slate-50'}`}
                                >
                                    {books[key].label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-2xl mx-auto p-4 space-y-10 pb-32">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight px-4">
                            {currentSong.title}
                        </h1>

                        {(currentBook === 'BE' || currentBook === 'BN') && (
                            <div className="flex justify-center">
                                <button
                                    onClick={playMidi}
                                    disabled={isLoadingMidi}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all ${isPlaying
                                        ? 'bg-red-50 text-red-600 border border-red-100'
                                        : 'bg-blue-600 text-white'
                                        } disabled:opacity-50`}
                                >
                                    {isLoadingMidi ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : isPlaying ? (
                                        <Square size={18} fill="currentColor" />
                                    ) : (
                                        <Play size={18} fill="currentColor" />
                                    )}
                                    {isLoadingMidi ? 'Memuat Instrumen...' : isPlaying ? 'Berhenti' : 'Putar Musik'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-12">
                        {currentSong.verses.length > 0 ? (
                            currentSong.verses.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-left text-left space-y-5">
                                    <span className="w-9 h-2 flex items-center justify-center text-slate-900 text-[12px] font-bold">
                                        {item.bait}
                                    </span>
                                    <p className="text-[17px] leading-[1.8] text-slate-900 font-serif px-2 whitespace-pre-line">
                                        {item.teks}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-400 py-20 font-bold uppercase text-xs tracking-widest">
                                Tidak ada data lagu
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isSongSelectOpen && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
                    <div className="h-14 border-b border-slate-100 flex items-center px-4 flex-none bg-white">
                        <button
                            onClick={() => {
                                setIsSongSelectOpen(false);
                            }}
                            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <span className="ml-1 text-s font-bold uppercase text-slate-900">
                            Cari Nomor {currentBook}
                        </span>
                    </div>
                    <div className="p-4 bg-white flex-none relative">
                        <Search size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Cari nomor atau judul ${currentBook}...`}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        <div className="grid grid-cols-1 gap-2">
                            {filteredSongs.length > 0 ? (
                                filteredSongs.map((song) => (
                                    <button
                                        key={song.id}
                                        onClick={() => selectSong(song.id)}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group"
                                    >
                                        <span className="text-xl font-black opacity-20 group-hover:opacity-100 w-12 text-left">{song.id}</span>
                                        <span className="text-sm font-bold uppercase tracking-tight text-left truncate flex-1">{song.title}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    Lagu tidak ditemukan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BukuEndeCard;