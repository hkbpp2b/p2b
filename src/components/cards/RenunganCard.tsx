import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft, Play, Square, Loader2 } from 'lucide-react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

let cachedRenungan: any = null;

interface RenunganCardProps {
    onSelect?: (data: any) => void;
}

const RenunganCard = ({ onSelect }: RenunganCardProps) => {
    const [data, setData] = useState<any>(cachedRenungan);
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingMidi, setIsLoadingMidi] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const playerRef = useRef<any>(null);
    const instrumentRef = useRef<any>(null);
    const activeNotesRef = useRef<Map<string, any>>(new Map());

    const scrollRef = useRef<HTMLDivElement>(null);

    const TSV_URL = import.meta.env.VITE_TSV_RENUNGAN_URL;

    const handleRenunganClick = () => {
        if (window.innerWidth >= 1024 && onSelect) {
            onSelect({ ...data, type: 'renungan' });
        } else {
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (cachedRenungan) return;
        const fetchRenungan = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");

                if (rows.length > 1) {
                    const cols = rows[1].split('\t').map(col => {
                        let cleaned = col.replace(/^"|"$/g, '').trim();
                        return cleaned.replace(/\[br\]/g, '\n');
                    });

                    const result = {
                        tanggal: cols[0],
                        ayat: cols[1],
                        kutipan: cols[2],
                        topik: cols[3],
                        isi: cols[4].replace(/\[br\]/g, '\n'),
                        nomorEnde: cols[5],
                        bukuEnde: cols[6].replace(/\[br\]/g, '\n'),
                        lirikEnde: cols[7]
                    };

                    setData(result);
                    cachedRenungan = result;
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchRenungan();
    }, []);

    useEffect(() => {
        return () => {
            stopMidi();
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            window.history.pushState({ renunganOpen: true }, "");

            const handleBackInRenungan = () => {
                stopMidi();
                setIsOpen(false);
                document.body.classList.remove('modal-open');
            };

            window.addEventListener('popstate', handleBackInRenungan);
            return () => {
                window.removeEventListener('popstate', handleBackInRenungan);
                document.body.classList.remove('modal-open');
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    const initAudio = async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (!instrumentRef.current) {
            instrumentRef.current = await Soundfont.instrument(audioContextRef.current, 'acoustic_grand_piano');
        }
    };

    const stopMidi = () => {
        playerRef.current?.stop();
        activeNotesRef.current.forEach(node => node.stop());
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
            const cleanNumber = data.nomorEnde.replace(/\D/g, '');

            if (!cleanNumber) {
                alert("error_hubungi_admin");
                return;
            }

            const songId = cleanNumber.padStart(3, '0');
            const midiModule = await import(`../../assets/music/BE${songId}.mid`);
            const midiUrl = midiModule.default;

            const response = await fetch(midiUrl);
            if (!response.ok) throw new Error('MIDI file not found');
            const arrayBuffer = await response.arrayBuffer();

            playerRef.current = new MidiPlayer.Player((event: any) => {
                if (!instrumentRef.current || !audioContextRef.current) return;

                const key = `${event.noteName}_${event.channel}`;

                if (event.name === 'Note on' && event.velocity > 0) {
                    activeNotesRef.current.get(key)?.stop();
                    const node = instrumentRef.current.play(
                        event.noteName,
                        audioContextRef.current.currentTime,
                        { gain: (event.velocity / 128) * 5 }
                    );
                    if (node) activeNotesRef.current.set(key, node);
                } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
                    activeNotesRef.current.get(key)?.stop();
                    activeNotesRef.current.delete(key);
                }
            });

            playerRef.current.loadArrayBuffer(arrayBuffer);
            playerRef.current.play();
            setIsPlaying(true);

            playerRef.current.on('endOfFile', () => {
                activeNotesRef.current.forEach(node => node.stop());
                activeNotesRef.current.clear();
                setIsPlaying(false);
            });

        } catch (error) {
            console.error('Error playing MIDI:', error);
            alert(`File musik BE${data.nomorEnde.padStart(3, '0')} tidak ditemukan.`);
        } finally {
            setIsLoadingMidi(false);
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop } = scrollRef.current;
        setIsScrolled(scrollTop > 20);
    };

    const closeRenungan = () => {
        stopMidi();
        setIsOpen(false);
    };

    if (!data) return null;

    return (
        <>
            <div className="p-6 rounded-[2.5rem] shadow-sm border border-slate-800 bg-slate-900 relative overflow-hidden">
                <div className="mb-6 text-center relative z-10">
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-1">
                        Renungan Harian
                    </h3>
                    <p className="text-[12px] font-black text-slate-100 uppercase tracking-[0.2em]">
                        {data.tanggal}
                    </p>
                </div>

                <div
                    onClick={handleRenunganClick}
                    className="p-7 rounded-[2.5rem] bg-slate-800/50 backdrop-blur-sm active:scale-95 transition-all cursor-pointer relative z-10 border border-slate-700/50 hover:border-slate-600 shadow-xl"
                >
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="text-[18px] font-black text-white leading-tight tracking-tight uppercase">
                                    {data.topik}
                                </h4>
                                <p className="text-[15px] font-semibold text-slate-300 leading-snug italic">
                                    {data.kutipan}
                                </p>
                                <p className="text-[14px] font-black text-blue-400 uppercase tracking-widest pt-1">
                                    — {data.ayat}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-white pt-2 border-t border-slate-700/50">
                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Baca Selengkapnya</span>
                            <ChevronRight size={14} className="text-blue-500" />
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 h-full z-[9999] flex flex-col animate-in slide-in-from-right duration-500 bg-white lg:hidden">
                    <header className="flex-none bg-white border-b border-slate-100 px-2 h-12 flex items-center">
                        <div className="flex-1 flex items-center">
                            <button onClick={closeRenungan} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-900">
                                <ArrowLeft size={22} />
                            </button>
                        </div>
                        <div className={`flex flex-col items-center transition-all duration-300 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                            <h2 className="text-[12px] font-black text-slate-900 tracking-tight uppercase truncate max-w-[180px]">
                                {data.topik}
                            </h2>
                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                                {data.ayat}
                            </span>
                        </div>
                        <div className="flex-1" />
                    </header>

                    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="max-w-2xl mx-auto w-full px-6 pt-8 pb-32 flex flex-col">
                            <div className="mb-10">
                                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-2">
                                    {data.tanggal}
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-8">
                                    {data.topik}
                                </h1>
                                <div className="border-l-[3px] border-slate-900 pl-5 py-1">
                                    <p className="text-[16px] pr-6 md:text-[24px] font-bold text-slate-900 text-left leading-snug mb-3">
                                        {data.kutipan}
                                    </p>
                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                                        {data.ayat}
                                    </p>
                                </div>
                            </div>

                            {data.bukuEnde && (
                                <div className="mb-10 p-6 bg-slate-50 rounded-3xl text-center border border-slate-100">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <p className="text-[16px] font-black text-slate-900 whitespace-pre-line leading-tight">
                                            {data.bukuEnde}
                                        </p>

                                        <button
                                            onClick={playMidi}
                                            disabled={isLoadingMidi}
                                            className={`flex items-center gap-3 pr-5 pl-2 py-1.5 rounded-full transition-all ${isPlaying
                                                ? 'bg-red-50 text-red-600 border border-red-100'
                                                : 'bg-blue-600 text-white'
                                                } disabled:opacity-50`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-red-100' : 'bg-white/20'}`}>
                                                {isLoadingMidi ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : isPlaying ? (
                                                    <Square size={14} fill="currentColor" />
                                                ) : (
                                                    <Play size={14} fill="currentColor" className="ml-0.5" />
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-[11px] font-black uppercase tracking-widest">
                                                    {isPlaying ? '' : ''} BE NO.{data.nomorEnde}
                                                </span>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="mt-8 text-center flex flex-col gap-4">
                                        {data.lirikEnde.split('\n').map((line, index) => (
                                            <p key={index} className="text-[16px] font-bold text-slate-900 italic">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-[16px] p-2 md:text-[16px] font-medium text-slate-900 leading-[1.7] text-left whitespace-pre-line">
                                    {data.isi}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RenunganCard;