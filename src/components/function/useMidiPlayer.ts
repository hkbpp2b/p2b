// hooks/useMidiPlayer.ts
import { useState, useRef, useEffect } from 'react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

export const useMidiPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const playerRef = useRef<any>(null);
    const instrumentRef = useRef<any>(null);
    const activeNotesRef = useRef<Map<string, any>>(new Map());

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
        }
        activeNotesRef.current.forEach(node => {
            try { node.stop(); } catch (e) { /* ignore */ }
        });
        activeNotesRef.current.clear();
        setIsPlaying(false);
    };

    const playMidi = async (nomorEnde: string) => {
        if (isPlaying) {
            stopMidi();
            return;
        }

        if (!nomorEnde) {
            console.error("Nomor Ende tidak ditemukan");
            return;
        }

        try {
            setIsLoading(true);
            await initAudio();

            const cleanNumber = nomorEnde.replace(/\D/g, '');
            const songId = cleanNumber.padStart(3, '0');

            let midiUrl;
            try {
                // Pastikan path ini benar sesuai struktur folder Anda
                // Jika hooks ada di src/hooks dan music ada di src/assets/music:
                const midiModule = await import(`../assets/music/BE${songId}.mid`);
                midiUrl = midiModule.default;
            } catch (err) {
                throw new Error(`File BE${songId}.mid tidak ditemukan di folder assets.`);
            }

            const response = await fetch(midiUrl);
            if (!response.ok) throw new Error('Gagal fetch file MIDI');
            const arrayBuffer = await response.arrayBuffer();

            playerRef.current = new MidiPlayer.Player((event: any) => {
                if (!instrumentRef.current || !audioContextRef.current) return;
                const key = `${event.noteName}_${event.channel}`;

                if (event.name === 'Note on' && event.velocity > 0) {
                    activeNotesRef.current.get(key)?.stop();
                    const node = instrumentRef.current.play(
                        event.noteName,
                        audioContextRef.current.currentTime,
                        { gain: (event.velocity / 128) * 2 }
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

            playerRef.current.on('endOfFile', () => stopMidi());

        } catch (error: any) {
            console.error('MIDI Playback Error:', error);
            alert(error.message || "Gagal memutar musik.");
            stopMidi();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => stopMidi();
    }, []);

    return { isPlaying, isLoading, playMidi, stopMidi };
};