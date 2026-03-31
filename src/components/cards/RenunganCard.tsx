// RenunganCard.jsx
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft, Play, Square, Loader2, Sun, Moon, Settings, Type } from 'lucide-react';
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
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [textSize, setTextSize] = useState(16);
    const [showSettings, setShowSettings] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingMidi, setIsLoadingMidi] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const playerRef = useRef<any>(null);
    const instrumentRef = useRef<any>(null);
    const activeNotesRef = useRef<Map<string, any>>(new Map());

    const scrollRef = useRef<HTMLDivElement>(null);

    const TSV_URL = import.meta.env.VITE_TSV_RENUNGAN_URL;

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const adjustTextSize = (delta: number) => {
        setTextSize(prev => Math.min(Math.max(prev + delta, 12), 24));
    };

    const handleRenunganClick = () => {
        if (window.innerWidth >= 1024 && onSelect) {
            onSelect({ ...data, type: 'renungan' });
        } else {
            setIsOpen(true);
        }
    };

    const getTikTokEmbedUrl = (url: string) => {
        if (!url) return "";
        const videoId = url.split('/').pop()?.split('?')[0];
        return `https://www.tiktok.com/embed/v2/${videoId}`;
    };

    useEffect(() => {
        if (isOpen) {
            const script = document.createElement('script');
            script.src = "https://www.tiktok.com/embed.js";
            script.async = true;
            document.body.appendChild(script);

            return () => {
                const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
                if (existingScript) existingScript.remove();
            };
        }
    }, [isOpen]);

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
                        lirikEnde: cols[7],
                        tiktokUrl: cols[8]
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
                setShowSettings(false);
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
        setShowSettings(false);
    };

    if (!data) return null;

    return (
        <>
            <div className="p-4 rounded-[2.5rem] shadow-sm border border-slate-200 bg-white relative overflow-hidden">
                <div className="mb-4 text-center relative z-10">
                    <h3 className="text-xl font-black text-blue-900 tracking-tighter uppercase mb-1">
                        Renungan Harian
                    </h3>
                    <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">
                        {data.tanggal}
                    </p>
                </div>

                <div
                    onClick={handleRenunganClick}
                    className="p-7 rounded-[2.5rem] bg-slate-800 backdrop-blur-sm active:scale-95 transition-all cursor-pointer relative z-10 border border-slate-700/50 hover:border-slate-600 shadow-xl"
                >
                    <div className="space-y-6">
                        <div className="space-y-4">


                            <div className="space-y-3">
                                <h4 className="text-[20px] font-black text-slate-100 text-left leading-tight tracking-tight uppercase">
                                    {data.topik}
                                </h4>
                                <p className="text-[14px] font-semibold text-slate-100 text-left leading-snug">
                                    {data.isi.split(" ").slice(0, 20).join(" ")} ...
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-500 border-b pb-3 ">
                            <p className="text-[13px] font-black text-blue-400 text-center leading-tight">
                                {data.ayat}
                            </p>
                            <div className="space-y-1 border-l border-slate-500 pl-3 flex justify-center items-center">
                                <p className="text-[13px] font-black text-emerald-400 text-left leading-tight">
                                    Ende No.{data.nomorEnde}
                                </p>
                            </div>
                        </div>

                        <div className="flex text-slate-100">
                            <div className="flex items-center gap-1 cursor-pointer">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">Baca Selengkapnya</span>
                                <ChevronRight size={14} className="text-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className={`fixed inset-0 h-full z-[9999] flex flex-col animate-in slide-in-from-right duration-500 lg:hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    <header className={`flex-none  px-2 h-14 flex items-center transition-colors duration-300 relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex-1 flex items-center">
                            <button onClick={closeRenungan} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-900'}`}>
                                <ArrowLeft size={22} />
                            </button>
                        </div>

                        <div className={`flex flex-col items-center transition-all duration-300 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                            <h2 className={`text-[14px] font-black tracking-tight uppercase truncate max-w-45 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Renungan Harian
                            </h2>
                            <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {data.tanggal}
                            </span>
                        </div>

                        <div className="flex-1 flex justify-end relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'} ${showSettings ? 'bg-blue-500/10 text-blue-500' : ''}`}
                            >
                                <Settings size={22} />
                            </button>

                            {showSettings && (
                                <div
                                    className={`absolute top-14 right-2 z-50 w-56 rounded-3xl border p-6 shadow-2xl animate-in fade-in zoom-in duration-200 
            ${isDarkMode
                                            ? 'bg-slate-900 border-slate-800 text-white'
                                            : 'bg-white border-slate-200 text-slate-900'
                                        }`}
                                >
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-wider opacity-60">
                                                Tampilan
                                            </span>
                                            <button
                                                onClick={toggleDarkMode}
                                                className={`flex items-center justify-center rounded-xl px-4 py-2 transition-colors 
            ${isDarkMode
                                                        ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {isDarkMode ? <Moon size={18} fill="currentColor" /> : <Sun size={18} fill="currentColor" />}
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <span className="text-xs font-black uppercase tracking-wider opacity-60">
                                                Ukuran Teks
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => adjustTextSize(-1)}
                                                    className={`flex-1 rounded-xl py-2 font-black transition-colors 
              ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => adjustTextSize(1)}
                                                    className={`flex-1 rounded-xl py-2 font-black transition-colors 
              ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </header>

                    <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="p-4 space-y-4 mb-40 mt-2">
                            <div className={"pb-5 rounded-[2.5rem]  relative overflow-hidden transition-colors duration-300"}>
                                <div className={"flex item-center justify-center transition-colors duration-300"}>
                                    {data.tiktokUrl && (
                                        <div className="h-[555px] w-[320px] rounded-[20px] shadow-sm overflow-hidden relative">
                                            <iframe
                                                src={`${getTikTokEmbedUrl(data.tiktokUrl)}?lang=id-ID&`}
                                                className="absolute"
                                                style={{
                                                    border: 'none',
                                                    height: '600px',
                                                    width: '100%',
                                                    top: '-5px',
                                                    left: 0,

                                                    transform: 'scale(1)',
                                                    transformOrigin: 'top center',
                                                }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                title="TikTok Video Player"
                                            ></iframe>

                                        </div>
                                    )}
                                </div>
                            </div >

                            <div className={`p-6 rounded-[2.5rem] shadow-sm border relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                                <div className="mb-6 text-center relative z-10">
                                    <h3 className={`text-[24px] font-black tracking-tighter uppercase mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                        Renungan Harian
                                    </h3>
                                    <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-100' : 'text-slate-500'}`}>
                                        {data.tanggal}
                                    </p>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className={`p-5 rounded-[2rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-blue-800/10 border-slate-700/50' : 'bg-blue-50/70 border-slate-100'}`}>
                                        <p style={{ fontSize: `${textSize - 1}px` }} className={`font-black text-center uppercase mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                                            {data.ayat}
                                        </p>
                                        <p style={{ fontSize: `${textSize - 1}px` }} className={`font-bold text-center ${isDarkMode ? 'text-blue-100' : 'text-slate-900'}`}>
                                            {data.kutipan}
                                        </p>
                                    </div>

                                    {data.bukuEnde && (
                                        <div className={`p-3 rounded-[2rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-emerald-800/10 border-slate-700/30' : 'bg-emerald-50/70 border-slate-100'}`}>
                                            <div className="flex flex-col items-center gap-4 text-center">
                                                <p style={{ fontSize: `${textSize}px` }} className={`font-black whitespace-pre-line leading-tight ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                                    {data.bukuEnde}
                                                </p>
                                                <button
                                                    onClick={playMidi}
                                                    disabled={isLoadingMidi}
                                                    className={`flex items-center gap-3 pr-5 pl-2 py-1.5 rounded-full transition-all border ${isPlaying
                                                        ? 'border-emerald-800/10 text-red-500 bg-red-500/10'
                                                        : isDarkMode
                                                            ? 'border-slate-600 text-emerald-400 bg-slate-800'
                                                            : 'border-slate-200 text-emerald-600 bg-white'
                                                        } disabled:opacity-50`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPlaying
                                                        ? 'bg-red-500 text-white'
                                                        : isDarkMode
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-emerald-600 text-white'
                                                        }`}>
                                                        {isLoadingMidi ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : isPlaying ? (
                                                            <Square size={14} fill="currentColor" />
                                                        ) : (
                                                            <Play size={14} fill="currentColor" className="ml-0.5" />
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest">
                                                        BE NO.{data.nomorEnde}
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="mt-5 mx-4 space-y-1">
                                                {data.lirikEnde.split('\n').map((line, index) => (
                                                    <p key={index} style={{ fontSize: `${textSize - 1}px` }} className={`font-bold text-center ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>



                            <div className={`p-6 rounded-[2.5rem] shadow-sm border relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                                <div className="p-1">
                                    <h4 style={{ fontSize: `${textSize + 10}px` }} className={`font-black text-center leading-tight tracking-tight uppercase p-2 mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                        {data.topik}
                                    </h4>
                                    <p style={{ fontSize: `${textSize}px` }} className={`font-medium text-left leading-[1.7] tracking-tight whitespace-pre-line ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                        {data.isi}
                                    </p>
                                </div>
                            </div>



                        </div >
                    </div >
                </div >
            )}
        </>
    );
};

export default RenunganCard;