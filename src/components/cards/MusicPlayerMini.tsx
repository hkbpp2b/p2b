// MusicPlayerMini.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Square, Loader2, SkipBack, SkipForward, Shuffle } from 'lucide-react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import BUKU_ENDE_DATA from '../../assets/bev1.json';

interface MusicPlayerMiniProps {
    initialNomorEnde: string;
}

const MusicPlayerMini = ({ initialNomorEnde }: MusicPlayerMiniProps) => {
    const songList = useMemo(() => BUKU_ENDE_DATA.map(s => String(s.id)), []);
    const [currentId, setCurrentId] = useState(initialNomorEnde || songList[Math.floor(Math.random() * songList.length)]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const playerRef = useRef<any>(null);
    const instrumentRef = useRef<any>(null);
    const activeNotesRef = useRef<Map<string, any>>(new Map());
    const silentAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.muted = true;
        audio.loop = true;
        silentAudioRef.current = audio;

        return () => stopMidi();
    }, []);

    const setupMediaSession = (id: string) => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: `BE No. ${id}`,
                artist: 'HKBP Perumnas II Bekasi',
                album: 'Buku Ende MIDI',
                artwork: [{ src: 'https://placehold.co/512x512/0f172a/white?text=BE', sizes: '512x512', type: 'image/png' }]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (playerRef.current) {
                    playerRef.current.play();
                    silentAudioRef.current?.play().catch(() => { });
                    setIsPlaying(true);
                    navigator.mediaSession.playbackState = 'playing';
                }
            });
            navigator.mediaSession.setActionHandler('pause', () => stopMidi());
            navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
            navigator.mediaSession.setActionHandler('previoustrack', () => handlePrev());
        }
    };

    const initAudio = async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }
        if (!instrumentRef.current) {
            instrumentRef.current = await Soundfont.instrument(audioContextRef.current, 'acoustic_grand_piano');
        }
    };

    const stopMidi = () => {
        if (playerRef.current) {
            playerRef.current.stop();
            playerRef.current = null;
        }
        activeNotesRef.current.forEach(node => node.stop());
        activeNotesRef.current.clear();
        silentAudioRef.current?.pause();
        setIsPlaying(false);
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    };

    const playMidi = async (id: string) => {
        stopMidi();
        try {
            setIsLoading(true);
            await initAudio();

            if (silentAudioRef.current) {
                silentAudioRef.current.play().catch(e => console.warn("Silent audio trigger failed", e));
            }

            setupMediaSession(id);

            const cleanId = String(id).padStart(3, '0');
            const response = await fetch(`/music/BE${cleanId}.mid`);
            if (!response.ok) throw new Error('File MIDI tidak ditemukan');
            const arrayBuffer = await response.arrayBuffer();

            playerRef.current = new MidiPlayer.Player((event: any) => {
                if (!instrumentRef.current || !audioContextRef.current) return;
                const key = `${event.noteName}_${event.channel}`;
                if (event.name === 'Note on' && event.velocity > 0) {
                    activeNotesRef.current.get(key)?.stop();
                    const node = instrumentRef.current.play(event.noteName, audioContextRef.current.currentTime, { gain: (event.velocity / 128) * 5 });
                    if (node) activeNotesRef.current.set(key, node);
                } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
                    activeNotesRef.current.get(key)?.stop();
                    activeNotesRef.current.delete(key);
                }
            });

            playerRef.current.on('endOfFile', () => handleAutoNext());
            playerRef.current.loadArrayBuffer(arrayBuffer);
            playerRef.current.play();

            setIsPlaying(true);
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
        } catch (error) {
            console.error("Playback failed", error);
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoNext = () => {
        const nextId = isShuffle
            ? songList[Math.floor(Math.random() * songList.length)]
            : songList[(songList.indexOf(currentId) + 1) % songList.length];
        setCurrentId(nextId);
        playMidi(nextId);
    };

    const handleNext = () => {
        const nextId = songList[(songList.indexOf(currentId) + 1) % songList.length];
        setCurrentId(nextId);
        playMidi(nextId);
    };

    const handlePrev = () => {
        const prevId = songList[(songList.indexOf(currentId) - 1 + songList.length) % songList.length];
        setCurrentId(prevId);
        playMidi(prevId);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="p-2 px-4 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-50 relative">
                {/* Sisi Kiri: Garis Pemisah */}
                <div className="flex items-center justify-end w-3">
                </div>

                <span className="text-xs font-black text-blue-900 tracking-tighter uppercase leading-none">
                    BE No. {currentId}
                </span>

                {/* Tengah: Kontrol Utama */}
                <div className="flex items-center gap-1.5 px-2">
                    <button
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`p-1 transition-all ${isShuffle ? "text-blue-600" : "text-slate-300"}`}
                    >
                        <Shuffle size={12} strokeWidth={3} />
                    </button>

                    <button
                        onClick={handlePrev}
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <SkipBack size={14} fill="currentColor" />
                    </button>

                    <button
                        onClick={() => isPlaying ? stopMidi() : playMidi(currentId)}
                        disabled={isLoading}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 ${isPlaying ? "bg-slate-900 text-white" : "bg-blue-600 text-white"}`}
                    >
                        {isLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : isPlaying ? (
                            <Square size={10} fill="currentColor" />
                        ) : (
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                        )}
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <SkipForward size={14} fill="currentColor" />
                    </button>
                </div>

                {/* Sisi Kanan: Audio Visualizer (Width disamakan dengan sisi kiri agar seimbang) */}
                <div className="flex items-center justify-start w-8">
                    {isPlaying && (
                        <div className="flex gap-0.5 items-end h-2.5">
                            <div className="w-0.5 bg-blue-500 animate-[bounce_1s_infinite_0ms] rounded-full h-1"></div>
                            <div className="w-0.5 bg-blue-500 animate-[bounce_1s_infinite_200ms] h-full rounded-full"></div>
                            <div className="w-0.5 bg-blue-500 animate-[bounce_1s_infinite_400ms] h-1.5 rounded-full"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicPlayerMini;