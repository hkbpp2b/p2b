// RenunganCard.tsx
import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { ChevronRight, ArrowLeft, Play, Square, Loader2, Sun, Moon, Settings } from 'lucide-react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import BUKU_ENDE_DATA from '../../assets/bev2.json';

export interface RenunganData {
    tanggal: string;
    ayat: string;
    kutipan: string;
    topik: string;
    isi: string;
    nomorEnde: string;
    bukuEnde: string;
    lirikEnde: string; // diambil dari bev2.json sesuai nomor & ayat ende
    judulLagu?: string; // judul lagu dari bev2.json
    tiktokUrl: string; // link video YouTube (kolom "tiktok", diisi Apps Script)
    ukuranVideo: string; // opsional, kolom J, mis. "1920x1080"; kosong = 16:9
}

let cachedRenungan: RenunganData | null = null;

/* ======================= HELPER DATA ======================= */

/* ---------- Buku Ende (data sama dengan BukuEndeCard) ---------- */

interface SongVerse { bait: string; teks: string }
interface SongData { id: string; title: string; verses: SongVerse[] }

/** "3-4" -> [3,4]; "1,3,5" -> [1,3,5]; "2-4" -> [2,3,4] */
const daftarAyat = (s: string): number[] => {
    const out: number[] = [];
    (s || '').replace(/[–—]/g, '-').replace(/\s+/g, '').split(',').forEach(p => {
        const [a, b] = p.split('-').map(Number);
        if (a && b) for (let i = a; i <= b; i++) out.push(i);
        else if (a) out.push(a);
    });
    return out;
};

/**
 * Cari lagu di bev2.json berdasarkan nomor ende, ambil ayat sesuai "BE. No. 102 : 3-4".
 * Kalau ayat tidak tertulis atau tidak ketemu, semua ayat ditampilkan.
 * Hasil lirik: "3. baris\nbaris\n\n4. baris\nbaris"
 */
const cariLaguEnde = (nomor: string, bukuEnde: string): { judul: string; lirik: string } | null => {
    const n = Number((nomor || '').replace(/\D/g, ''));
    if (!n) return null;
    const lagu = (BUKU_ENDE_DATA as SongData[]).find(s => Number(String(s.id).replace(/\D/g, '')) === n);
    if (!lagu) return null;

    const nomorBait = (v: SongVerse) => Number((String(v.bait).match(/\d+/) || [])[0]);
    const m = (bukuEnde || '').match(/No\.?\s*\d+\s*:\s*([\d\s,\-–—]+)/i);
    const diminta = daftarAyat(m ? m[1] : '');
    let bait = diminta.length ? lagu.verses.filter(v => diminta.includes(nomorBait(v))) : lagu.verses;
    if (!bait.length) bait = lagu.verses;

    const lirik = bait
        .map(v => {
            const no = nomorBait(v);
            const teks = bersihkanBr(v.teks);
            return no ? `${no}. ${teks}` : teks;
        })
        .join('\n\n');

    return { judul: lagu.title, lirik };
};

const BULAN: Record<string, number> = {
    januari: 1, january: 1, februari: 2, february: 2, maret: 3, march: 3, april: 4,
    mei: 5, may: 5, juni: 6, june: 6, juli: 7, july: 7, agustus: 8, august: 8,
    september: 9, oktober: 10, october: 10, november: 11, nopember: 11, desember: 12, december: 12,
};
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Parser TSV yang tahan sel berisi baris baru (lirik, isi renungan).
 * Google Sheets membungkus sel seperti itu dengan tanda kutip, jadi split per baris biasa akan memotongnya.
 */
const parseTsv = (text: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { cell += '"'; i++; }
                else inQuotes = false;
            } else cell += c;
        } else if (c === '"' && cell === '') {
            inQuotes = true;
        } else if (c === '\t') {
            row.push(cell); cell = '';
        } else if (c === '\n' || c === '\r') {
            if (c === '\r' && text[i + 1] === '\n') i++;
            row.push(cell); rows.push(row);
            row = []; cell = '';
        } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim() !== ''));
};

/** "baris [br]\nbaris" atau "baris [br] baris" -> "baris\nbaris" (tanpa baris kosong dobel) */
const bersihkanBr = (s: string) =>
    (s || '').replace(/[ \t]*\[br\][ \t]*(\r?\n)?/gi, '\n').replace(/\r/g, '').trim();

/** "15 October 2026" / "15 Oktober 2026" / "2026-10-15" / "15/10/2026" -> "2026-10-15" */
const tanggalKeIso = (s: string): string => {
    const a = s.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (a && BULAN[a[2].toLowerCase()]) return `${a[3]}-${pad(BULAN[a[2].toLowerCase()])}-${pad(+a[1])}`;
    const b = s.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (b) return b[0];
    const c = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (c) return `${c[3]}-${pad(+c[2])}-${pad(+c[1])}`;
    return '';
};

const hariIniIso = () =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date());

/** Pilih baris hari ini; kalau belum ada, baris terbaru sebelum hari ini; kalau tanggal tak terbaca, baris terakhir. */
const pilihBaris = (rows: string[][]): string[] | null => {
    const hariIni = hariIniIso();
    let terbaik: string[] | null = null;
    let isoTerbaik = '';
    for (const r of rows) {
        const iso = tanggalKeIso(r[0] || '');
        if (iso && iso <= hariIni && iso > isoTerbaik) { terbaik = r; isoTerbaik = iso; }
    }
    return terbaik ?? rows[rows.length - 1] ?? null;
};


type VideoInfo = { preview: string; thumb: string; shorts: boolean };

/**
 * Link YouTube -> player embed + thumbnail.
 * Bisa: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID, youtube.com/live/ID.
 */
export const getVideoEmbed = (url: string): VideoInfo | null => {
    const m = (url || '').match(
        /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/
    );
    if (!m) return null;
    const id = m[1];
    return {
        preview: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`,
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        shorts: /\/shorts\//.test(url),
    };
};

/** Rasio player YouTube biasa 16:9; Shorts 9:16. Kolom J dipakai kalau diisi. */
const RASIO_DEFAULT = 16 / 9;
const RASIO_SHORTS = 9 / 16;

/** "1920x1080" -> rasio lebar/tinggi */
const rasioVideo = (ukuran: string, shorts = false): number => {
    const m = (ukuran || '').match(/(\d+)\s*[x×:\/]\s*(\d+)/);
    if (m && +m[1] > 0 && +m[2] > 0) return +m[1] / +m[2];
    return shorts ? RASIO_SHORTS : RASIO_DEFAULT;
};

/**
 * Bingkai video: tinggi dihitung dari lebar x rasio video, jadi video mengisi bingkai persis.
 * Sudut membulat sama di keempat sisi; isolation + translateZ memastikan sudutnya
 * ikut terpotong di Safari/iOS.
 */
const bingkaiVideo = (rasio: number): CSSProperties => ({
    aspectRatio: `${rasio}`,
    width: `min(100%, calc(70vh * ${rasio}))`,
    borderRadius: 20,
    overflow: 'hidden',
    isolation: 'isolate',
    transform: 'translateZ(0)',
});

/* ======================= KOMPONEN ======================= */

/** Player video renungan (dipakai di HP dan di panel desktop). Bingkai = rasio video, player YouTube mengisi penuh. */
export const VideoRenungan = ({ url, ukuran }: { url: string; ukuran: string }) => {
    const video = getVideoEmbed(url);
    if (!video) return null;

    return (
        <div className="flex justify-center">
            <div className="relative bg-black shadow-sm" style={bingkaiVideo(rasioVideo(ukuran, video.shorts))}>
                <iframe
                    src={video.preview}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    title="Video Renungan"
                />
            </div>
        </div>
    );
};

interface RenunganCardProps {
    onSelect?: (data: RenunganData & { type: 'renungan' }) => void;
}

const RenunganCard = ({ onSelect }: RenunganCardProps) => {
    const [data, setData] = useState<RenunganData | null>(cachedRenungan);
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [textSize, setTextSize] = useState(16);
    const [showSettings, setShowSettings] = useState(false);
    const [thumbGagal, setThumbGagal] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingMidi, setIsLoadingMidi] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const playerRef = useRef<any>(null);
    const instrumentRef = useRef<any>(null);
    const activeNotesRef = useRef<Map<string, any>>(new Map());

    const scrollRef = useRef<HTMLDivElement>(null);

    const TSV_URL = import.meta.env.VITE_TSV_RENUNGAN_URL;

    const video = data ? getVideoEmbed(data.tiktokUrl) : null;
    const rasio = rasioVideo(data?.ukuranVideo || '', video?.shorts);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const adjustTextSize = (delta: number) => {
        setTextSize(prev => Math.min(Math.max(prev + delta, 12), 24));
    };

    const handleRenunganClick = () => {
        if (!data) return;
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
                const sep = TSV_URL.includes('?') ? '&' : '?';
                const response = await fetch(`${TSV_URL}${sep}t=${Date.now()}`);
                const text = await response.text();
                const rows = parseTsv(text).slice(1); // buang header
                const cols = pilihBaris(rows);
                if (!cols) return;

                const col = (i: number) => bersihkanBr(cols[i] || '');
                const lagu = cariLaguEnde(col(5), col(6));
                const result: RenunganData = {
                    tanggal: col(0),
                    ayat: col(1),
                    kutipan: col(2),
                    topik: col(3),
                    isi: col(4),
                    nomorEnde: col(5).replace(/\D/g, ''),
                    bukuEnde: col(6),
                    lirikEnde: col(7) || lagu?.lirik || '', // kolom lirik sheet kosong -> pakai bev2.json
                    judulLagu: lagu?.judul || '',
                    tiktokUrl: (cols[8] || '').trim(),
                    ukuranVideo: (cols[9] || '').trim(),
                };

                setData(result);
                cachedRenungan = result;
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
        if (!data) return;
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
            {/* ===================== KARTU (sebelum diklik) ===================== */}
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
                    className="p-5 rounded-[2.5rem] bg-slate-800 active:scale-95 transition-all cursor-pointer relative z-10 border border-slate-700/50 hover:border-slate-600 shadow-xl"
                >
                    <div className="space-y-5">
                        {/* Cover video */}
                        {video && (
                            <div className="flex justify-center">
                                <div className="relative bg-slate-900" style={bingkaiVideo(rasio)}>
                                    {video.thumb && !thumbGagal ? (
                                        <img
                                            src={video.thumb}
                                            alt="Cover video renungan"
                                            className="absolute inset-0 w-full h-full object-cover"
                                            loading="lazy"
                                            referrerPolicy="no-referrer"
                                            onError={() => setThumbGagal(true)}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                            <Play size={22} fill="currentColor" className="text-slate-900 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ayat | Ende */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-500 border-b pb-3">
                            <p className="text-[13px] font-black text-blue-400 text-center leading-tight flex items-center justify-center">
                                {data.ayat}
                            </p>
                            <div className="border-l border-slate-500 pl-3 flex justify-center items-center">
                                <p className="text-[13px] font-black text-emerald-400 text-center leading-tight">
                                    {data.nomorEnde ? `Ende No.${data.nomorEnde}` : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Lihat renungan */}
                        <div className="flex items-center justify-center gap-1 text-slate-200">
                            <span className="text-[11px] font-bold uppercase tracking-widest">Lihat Renungan</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== HALAMAN DETAIL (setelah diklik) ===================== */}
            {isOpen && (
                <div className={`fixed inset-0 h-full z-[9999] flex flex-col animate-in slide-in-from-right duration-500 lg:hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    <header className={`flex-none px-2 h-14 flex items-center transition-colors duration-300 relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
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
                                    className={`absolute top-14 right-2 z-50 w-56 rounded-3xl border p-6 shadow-2xl animate-in fade-in zoom-in duration-200 ${isDarkMode
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
                                                className={`flex items-center justify-center rounded-xl px-4 py-2 transition-colors ${isDarkMode
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
                                                    className={`flex-1 rounded-xl py-2 font-black transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => adjustTextSize(1)}
                                                    className={`flex-1 rounded-xl py-2 font-black transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
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
                        <div className="p-4 space-y-5 mb-40 mt-2">
                            {/* Judul + tanggal */}
                            <div className="text-center">
                                <h3 className={`text-[24px] font-black tracking-tighter uppercase mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                    Renungan Harian
                                </h3>
                                <p className={`text-[12px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {data.tanggal}
                                </p>
                            </div>

                            {/* Video */}
                            <VideoRenungan url={data.tiktokUrl} ukuran={data.ukuranVideo} />

                            {/* Ayat + isi ayat */}
                            <div className={`p-5 rounded-[2rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-blue-800/10 border-slate-700/50' : 'bg-blue-50/70 border-slate-100'}`}>
                                <p style={{ fontSize: `${textSize - 4}px` }} className={`font-black text-center uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Ayat Hari Ini
                                </p>
                                <p style={{ fontSize: `${textSize - 1}px` }} className={`font-black text-center uppercase mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                                    {data.ayat}
                                </p>
                                <p style={{ fontSize: `${textSize - 1}px` }} className={`font-bold text-center ${isDarkMode ? 'text-blue-100' : 'text-slate-900'}`}>
                                    {data.kutipan}
                                </p>
                            </div>

                            {/* Ende + lirik */}
                            {data.nomorEnde && (
                                <div className={`p-5 rounded-[2rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-emerald-800/10 border-slate-700/30' : 'bg-emerald-50/70 border-slate-100'}`}>
                                    <p style={{ fontSize: `${textSize - 4}px` }} className={`font-black text-center uppercase tracking-[0.2em] mb-3 whitespace-pre-line ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {data.bukuEnde || 'Ende Hari Ini'}
                                    </p>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={playMidi}
                                            disabled={isLoadingMidi}
                                            className={`flex items-center gap-3 pr-5 pl-2 py-1.5 rounded-full transition-all border ${isPlaying
                                                ? 'border-emerald-800/10 text-red-500 bg-red-500/10'
                                                : isDarkMode
                                                    ? 'border-slate-600 text-emerald-400 bg-slate-800'
                                                    : 'border-slate-200 text-emerald-700 bg-white'
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
                                            <span style={{ fontSize: `${textSize - 2}px` }} className="font-black uppercase tracking-widest">
                                                Ende No.{data.nomorEnde}
                                            </span>
                                        </button>
                                    </div>

                                    {data.judulLagu && (
                                        <p style={{ fontSize: `${textSize - 1}px` }} className={`mt-4 font-black text-center uppercase tracking-tight ${isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                                            {data.judulLagu}
                                        </p>
                                    )}

                                    {data.lirikEnde && (
                                        <div className="mt-5 mx-2 space-y-1">
                                            {data.lirikEnde.split('\n').map((line: string, index: number) => (
                                                line.trim() === ''
                                                    ? <div key={index} className="h-3" />
                                                    : <p key={index} style={{ fontSize: `${textSize - 1}px` }} className={`font-bold text-center ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                                        {line}
                                                    </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Isi renungan */}
                            {data.isi && (
                                <div className={`p-6 rounded-[2rem] border shadow-sm transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                                    <p style={{ fontSize: `${textSize}px` }} className={`font-medium text-left leading-[1.7] tracking-tight whitespace-pre-line ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                        {data.isi}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RenunganCard;