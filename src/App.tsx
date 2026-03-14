// App.tsx
import { useState, useEffect, useRef } from 'react';
import { Home, Play, Square, Loader2 } from 'lucide-react';
import { Instagram, Youtube, Facebook, Music2 } from 'lucide-react';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import Layout from './components/Layout';
import ProfileTab from './components/tabs/ProfileTab';
import IbadahTab from './components/tabs/IbadahTab';
import GivingTab from './components/tabs/GivingTab';
import OtherTab from './components/tabs/OtherTab';
import AplikasiTab from './components/tabs/AplikasiTab';
import DataJemaatForm from './components/cards/DataJemaatForm';
import DoaForm from './components/cards/DoaForm';
import SaranForm from './components/cards/SaranForm';
import KonselingForm from './components/cards/KonselingForm';

function App() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loadedTabs, setLoadedTabs] = useState<string[]>(['profil']);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingMidi, setIsLoadingMidi] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playerRef = useRef<any>(null);
  const instrumentRef = useRef<any>(null);
  const activeNotesRef = useRef<Map<string, any>>(new Map());

  const titles: Record<string, string> = {
    profil: 'HKBP Perumnas 2 Bekasi',
    warta: 'COMINGSOON',
    ibadah: 'WARTA dan ACARA',
    giving: 'PERSEMBAHAN',
    other: 'LAYANAN'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    stopMidi();
  }, [selectedDetail]);

  useEffect(() => {
    return () => {
      stopMidi();
    };
  }, []);

  useEffect(() => {
    const backgroundQueue = ['giving', 'ibadah', 'warta', 'other'];
    const loadSequentially = async () => {
      await new Promise((resolve) => requestAnimationFrame(() => {
        setTimeout(resolve, 50);
      }));

      for (const tab of backgroundQueue) {
        setLoadedTabs((prev) => (prev.includes(tab) ? prev : [...prev, tab]));
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    };

    if (document.readyState === 'complete') {
      loadSequentially();
    } else {
      window.addEventListener('load', loadSequentially, { once: true });
    }
  }, []);

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
        alert("error_hubungi_admin");
        return;
      }

      const songId = cleanNumber.padStart(3, '0');
      const midiUrl = `/music/BE${songId}.mid`;

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

  const renderRightWindow = () => {
    if (!selectedDetail) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10 text-center"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Home size={32} className="opacity-20" />
          </div>
          <p className="font-black uppercase tracking-widest text-xs">Pilih konten di kiri layar untuk melihat detail</p>
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

            <p className="text-[14px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">
              {selectedDetail.judul}
            </p>

            <p className="text-[32px] font-bold text-slate-900 lowercase tracking-tight mb-1">
              {selectedDetail.url.split('/').filter(Boolean).pop()}
            </p>

            <p className="text-slate-500 font-medium text-[15px] max-w-sm mb-10 leading-relaxed">
              Akun {selectedDetail.platform.toLowerCase()} Resmi Gereja HKBP Perumnas 2 Bekasi
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
        <div className="flex flex-col h-full bg-white">
          <div className="flex flex-col h-full">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-100 relative flex justify-center">
              <iframe
                src={`https://drive.google.com/file/d/${selectedDetail.id}/preview`}
                className="w-[125%] h-[110%] shrink-0 border-none"
                style={{
                  transform: 'translateY(-4.5%)',
                  pointerEvents: 'auto',
                }}
                allow="autoplay"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      );
    }

    if (selectedDetail.type === 'form') {
      return (
        <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
          <div className="p-10 pt-10">
            {selectedDetail.id === 'data-jemaat' && <DataJemaatForm onBack={() => setSelectedDetail(null)} />}
            {selectedDetail.id === 'doa' && <DoaForm onBack={() => setSelectedDetail(null)} />}
            {selectedDetail.id === 'saran' && <SaranForm onBack={() => setSelectedDetail(null)} />}
            {selectedDetail.id === 'konseling' && <KonselingForm onBack={() => setSelectedDetail(null)} />}
          </div>
        </div>
      );
    }

    const isRenungan = selectedDetail.type === 'renungan';

    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
        <div className="sticky top-0 z-10 flex justify-end p-15 pointer-events-none"></div>

        <div className="-mt-14">
          {!isRenungan && selectedDetail.url && (
            <div className="w-full aspect-full mb-10">
              <img
                src={selectedDetail.url}
                className="w-full h-full object-contain"
                alt="Detail content"
              />
            </div>
          )}

          <div className="p-10 pt-0">
            <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-2">
              {selectedDetail.tanggal}
            </p>

            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-8">
              {isRenungan ? selectedDetail.topik : selectedDetail.judul}
            </h2>

            {isRenungan && (
              <div className="border-l-[3px] border-slate-900 pl-5 py-1 mb-10">
                <p className="text-[18px] font-bold text-slate-900 leading-snug mb-3">
                  {selectedDetail.kutipan}
                </p>
                <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  {selectedDetail.ayat}
                </p>
              </div>
            )}

            {isRenungan && selectedDetail.bukuEnde && (
              <div className="mb-10 p-8 bg-slate-50 rounded-3xl text-center border border-slate-100">
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-[18px] font-black text-slate-900 mb-4">
                    {selectedDetail.bukuEnde}
                  </p>

                  <button
                    onClick={playMidi}
                    disabled={isLoadingMidi}
                    className={`flex items-center gap-3 pr-5 pl-2 py-1.5 rounded-full mb-6 transition-all ${isPlaying
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
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      BE NO.{selectedDetail.nomorEnde}
                    </span>
                  </button>
                </div>




                <div className="mt-8 text-center flex flex-col gap-4">
                  {selectedDetail.lirikEnde.split('\n').map((line, index) => (
                    <p key={index} className="text-[16px] font-bold text-slate-900 italic">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}


            <p className="text-[16px] font-medium text-slate-800 leading-[1.8] whitespace-pre-line">
              {isRenungan ? selectedDetail.isi : selectedDetail.deskripsi}
            </p>


          </div>

        </div>
      </div>
    );
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={titles[activeTab]}
      detailContent={renderRightWindow()}
    >
      <div className="max-w-3xl mx-auto w-full pt-0 h-full flex flex-col">
        <div className="w-full flex-1">
          {loadedTabs.includes('profil') && (
            <div className={activeTab === 'profil' ? 'h-full block' : 'hidden'}>
              <ProfileTab onHeroSelect={(data) => setSelectedDetail(data)} />
            </div>
          )}

          {loadedTabs.includes('giving') && (
            <div className={activeTab === 'giving' ? 'block' : 'hidden'} style={{ contentVisibility: activeTab === 'giving' ? 'visible' : 'auto' }}>
              <GivingTab />
            </div>
          )}

          {loadedTabs.includes('ibadah') && (
            <div className={activeTab === 'ibadah' ? 'block' : 'hidden'} style={{ contentVisibility: activeTab === 'ibadah' ? 'visible' : 'auto' }}>
              <IbadahTab onSelectContent={(data) => setSelectedDetail(data)} />
            </div>
          )}

          {loadedTabs.includes('warta') && (
            <div className={activeTab === 'warta' ? 'block' : 'hidden'} style={{ contentVisibility: activeTab === 'warta' ? 'visible' : 'auto' }}>
              <AplikasiTab />
            </div>
          )}

          {loadedTabs.includes('other') && (
            <div className={activeTab === 'other' ? 'block' : 'hidden'}>
              <OtherTab onSelectContent={(data) => setSelectedDetail(data)} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;