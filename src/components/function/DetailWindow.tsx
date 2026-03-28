// components/DetailWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, Square, Loader2, Instagram, Youtube, Facebook, Music2, X } from 'lucide-react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import DataJemaatForm from '../cards/DataJemaatForm';
import DoaForm from '../cards/DoaForm';
import SaranForm from '../cards/SaranForm';
import KonselingForm from '../cards/KonselingForm';

interface DetailWindowProps {
    selectedDetail: any;
    onBack: () => void;
}

const DetailWindow = ({ selectedDetail, onBack }: DetailWindowProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingMidi, setIsLoadingMidi] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const playerRef = useRef<any>(null);
    const instrumentRef = useRef<any>(null);
    const activeNotesRef = useRef<Map<string, any>>(new Map());

    useEffect(() => {
        return () => {
            stopMidi();
        };
    }, [selectedDetail]);

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
            const cleanNumber = selectedDetail.nomorEnde.replace(/\D/g, '');

            if (!cleanNumber) {
                alert("Nomor Ende tidak valid");
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
            alert(`File musik BE${selectedDetail.nomorEnde.padStart(3, '0')} tidak ditemukan.`);
        } finally {
            setIsLoadingMidi(false);
        }
    };

    if (!selectedDetail) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Home size={32} className="opacity-20" />
                </div>
                <p className="font-black uppercase tracking-widest text-xs">Pilih konten di kiri layar untuk melihat detail</p>
            </div>
        );
    }

    if (selectedDetail.type === 'jadwal') {
        return (
            <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar p-10">
                <div className="mb-10 text-center">
                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-wide">{selectedDetail.tanggal}</p>
                    <h2 className="text-[34px] font-black text-slate-900 tracking-tight uppercase">{selectedDetail.name}</h2>
                    <p className="text-[22px] font-bold text-slate-900 tracking-tight">{selectedDetail.time} WIB</p>
                </div>

                {selectedDetail.isLive ? (
                    <div className="max-w-md mx-auto w-full p-10 text-center">
                        <p className="text-sm font-bold uppercase text-slate-600 mb-8">Live Streaming ibadah via Youtube</p>
                        <button
                            onClick={() => window.open(selectedDetail.link, '_blank')}
                            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
                        >
                            Buka Youtube
                        </button>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto w-full flex justify-center">
                        <div className="inline-block">
                            <div className="grid grid-cols-1 ">
                                {selectedDetail.pelayan.map((p: any, idx: number) => (
                                    <div key={idx} className="flex items-start p-3">
                                        {/* Sisi Kiri: Label */}
                                        <div className="w-40 shrink-0 text-left pr-6">
                                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest block mt-1">
                                                {p.label}
                                            </span>
                                        </div>

                                        {/* Sisi Kanan: Nama-nama */}
                                        <div className="flex-grow pl-6 border-l-2 border-slate-100 min-w-[250px]">
                                            <div className="space-y-1.5">
                                                {p.name.split(',').map((n: string, i: number) => (
                                                    <p key={i} className="text-[15px] font-bold text-slate-900 tracking-tight leading-tight">
                                                        {n.trim()}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (selectedDetail.type === 'social') {
        return (
            <div className="flex flex-col h-full bg-white">
                <div className="p-12 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                        {selectedDetail.platform === 'INSTAGRAM' && <Instagram size={40} className="text-pink-600" />}
                        {selectedDetail.platform === 'YOUTUBE' && <Youtube size={40} className="text-red-600" />}
                        {selectedDetail.platform === 'FACEBOOK' && <Facebook size={40} className="text-blue-600" />}
                        {selectedDetail.platform === 'TIKTOK' && <Music2 size={40} className="text-slate-900" />}
                    </div>
                    <p className="text-[14px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">{selectedDetail.judul}</p>
                    <p className="text-[32px] font-bold text-slate-900 lowercase tracking-tight mb-1">
                        {selectedDetail.url?.split('/').filter(Boolean).pop()}
                    </p>
                    <a
                        href={selectedDetail.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center gap-3 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] px-10 py-5 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                        Kunjungi {selectedDetail.platform}
                    </a>
                </div>
            </div>
        );
    }

    if (selectedDetail.type === 'pdf') {
        return (
            <div className="flex flex-col h-full bg-white p-4 mt-4">
                <div className="w-full h-full  relative flex justify-center group">

                    <iframe
                        src={`https://drive.google.com/file/d/${selectedDetail.id}/preview`}
                        className="w-[114%] h-[105%] shrink-0 border-none"
                        style={{ transform: 'translateY(-4.5%)', pointerEvents: 'auto' }}
                        title="PDF Preview"
                    />
                </div>
            </div>
        );
    }

    if (selectedDetail.type === 'form') {
        return (
            <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar p-10">
                {selectedDetail.id === 'data-jemaat' && <DataJemaatForm onBack={onBack} />}
                {selectedDetail.id === 'doa' && <DoaForm onBack={onBack} />}
                {selectedDetail.id === 'saran' && <SaranForm onBack={onBack} />}
                {selectedDetail.id === 'konseling' && <KonselingForm onBack={onBack} />}
            </div>
        );
    }

    if (selectedDetail.type === 'renungan') {
        return (
            <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar p-10">
                <div className="max-w-3xl mx-auto w-full space-y-10">

                    <div className="p-5">
                        <div className="mb-4 text-center relative z-10">
                            <h3 className="text-[28px] font-black text-slate-900 tracking-tighter uppercase mb-1">
                                Renungan Harian
                            </h3>
                            <p className="text-[14px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                {selectedDetail.tanggal}
                            </p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="p-4 rounded-[2.5rem] border border-slate-100 bg-blue-800/10">
                                <p className="text-[20px] font-black text-center text-blue-900 uppercase mb-4 leading-tight">
                                    {selectedDetail.ayat}
                                </p>
                                <p className="text-[16px] font-bold text-center text-slate-800 leading-relaxed">
                                    "{selectedDetail.kutipan}"
                                </p>
                            </div>

                            {selectedDetail.bukuEnde && (
                                <div className="p-4 rounded-[2.5rem] border border-blue-50 bg-emerald-800/10">
                                    <div className="flex flex-col items-center gap-6 text-center">
                                        <p className="text-[20px] font-black text-emerald-800 whitespace-pre-line leading-tight">
                                            {selectedDetail.bukuEnde}
                                        </p>

                                        <button
                                            onClick={playMidi}
                                            disabled={isLoadingMidi}
                                            className={`flex items-center gap-2 pr-4 pl-1.5 py-1 rounded-full transition-all border shadow-sm active:scale-95 disabled:opacity-50 ${isPlaying
                                                ? 'border-red-100 text-red-500 bg-red-50/30'
                                                : 'border-slate-200 text-emerald-600 bg-white'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
                                                }`}>
                                                {isLoadingMidi ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : isPlaying ? (
                                                    <Square size={10} fill="currentColor" />
                                                ) : (
                                                    <Play size={10} fill="currentColor" className="ml-0.5" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                BE NO.{selectedDetail.nomorEnde}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="mt-8 space-y-3">
                                        {selectedDetail.lirikEnde.split('\n').map((line: string, index: number) => (
                                            <p key={index} className="text-[16px] font-bold text-center text-slate-900 leading-relaxed">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-1 pb-20">
                        <h4 className="text-[26px] font-black text-slate-900 text-center leading-tight tracking-tighter uppercase mb-8">
                            {selectedDetail.topik}
                        </h4>

                        <p className="text-[16px] font-medium text-slate-800 leading-[1.7] whitespace-pre-line">
                            {selectedDetail.isi}
                        </p>
                    </div>

                </div>
            </div>
        );
    }
};

export default DetailWindow;