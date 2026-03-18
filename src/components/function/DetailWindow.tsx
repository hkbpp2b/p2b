// components/DetailWindow.tsx
import { Home, Play, Square, Loader2, Instagram, Youtube, Facebook, Music2 } from 'lucide-react';
import DataJemaatForm from '../cards/DataJemaatForm';
import DoaForm from '../cards/DoaForm';
import SaranForm from '../cards/SaranForm';
import KonselingForm from '../cards/KonselingForm';

interface DetailWindowProps {
    selectedDetail: any;
    onBack: () => void;
    midiControls: {
        isPlaying: boolean;
        isLoading: boolean;
        playMidi: (nomor: string) => void;
    };
}

const DetailWindow = ({ selectedDetail, onBack, midiControls }: DetailWindowProps) => {
    const { isPlaying, isLoading, playMidi } = midiControls;

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

    // --- Render Social Logic ---
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
                        {selectedDetail.url.split('/').filter(Boolean).pop()}
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

    // --- Render PDF Logic ---
    if (selectedDetail.type === 'pdf') {
        return (
            <div className="flex flex-col h-full bg-white p-4">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-100 relative flex justify-center">
                    <iframe
                        src={`https://drive.google.com/file/d/${selectedDetail.id}/preview`}
                        className="w-[125%] h-[110%] shrink-0 border-none"
                        style={{ transform: 'translateY(-4.5%)', pointerEvents: 'auto' }}
                        title="PDF Preview"
                    />
                </div>
            </div>
        );
    }

    // --- Render Form Logic ---
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

    // --- Render Renungan & General Detail Logic ---
    const isRenungan = selectedDetail.type === 'renungan';

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
            <div className="-mt-14">
                {!isRenungan && selectedDetail.url && (
                    <div className="w-full aspect-video mb-10">
                        <img src={selectedDetail.url} className="w-full h-full object-contain" alt="Content" />
                    </div>
                )}

                <div className="p-10 pt-0">
                    <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-2">{selectedDetail.tanggal}</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-8">
                        {isRenungan ? selectedDetail.topik : selectedDetail.judul}
                    </h2>

                    {isRenungan && (
                        <>
                            <div className="border-l-[3px] border-slate-900 pl-5 py-1 mb-10">
                                <p className="text-[18px] font-bold text-slate-900 leading-snug mb-3">{selectedDetail.kutipan}</p>
                                <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.2em]">{selectedDetail.ayat}</p>
                            </div>

                            {selectedDetail.bukuEnde && (
                                <div className="mb-10 p-8 bg-slate-50 rounded-3xl text-center border border-slate-100">
                                    <p className="text-[16px] font-black text-slate-900 mb-6 whitespace-pre-line leading-tight">
                                        {selectedDetail.bukuEnde}
                                    </p>

                                    <button
                                        onClick={() => playMidi(selectedDetail.nomorEnde)}
                                        disabled={isLoading}
                                        className={`flex items-center gap-3 pr-5 pl-2 py-1.5 rounded-full mx-auto mb-8 transition-all ${isPlaying ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-600 text-white'
                                            } disabled:opacity-50`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-red-100' : 'bg-white/20'}`}>
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> :
                                                isPlaying ? <Square size={14} fill="currentColor" /> :
                                                    <Play size={14} fill="currentColor" className="ml-0.5" />}
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest">BE NO.{selectedDetail.nomorEnde}</span>
                                    </button>

                                    <div className="flex flex-col gap-4">
                                        {selectedDetail.lirikEnde?.split('\n').map((line: string, index: number) => (
                                            <p key={index} className="text-[16px] font-bold text-slate-900 italic">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <p className="text-[16px] font-medium text-slate-900 leading-[1.8] whitespace-pre-line">
                        {isRenungan ? selectedDetail.isi : selectedDetail.deskripsi}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DetailWindow;