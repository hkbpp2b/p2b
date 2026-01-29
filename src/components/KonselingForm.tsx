import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface KonselingFormProps {
    onBack: () => void;
}

const KonselingForm = ({ onBack }: KonselingFormProps) => {
    const [status, setStatus] = useState<'idle' | 'error'>('idle');

    const handleRequest = () => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="space-y-8 pb-32 pt-4 px-2">
            {/* Tombol Back */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]"
            >
                <ArrowLeft size={16} /> Kembali
            </button>

            {/* Header */}
            <header className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
                    Layanan Konseling
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Bimbingan Pastoral & Konsultasi</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={(e) => e.preventDefault()}>

                {/* Pilihan Metode */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Metode Pertemuan</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" className="p-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase border-2 border-slate-900">Tatap Muka</button>
                        <button type="button" className="p-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase text-slate-400 border-2 border-transparent">Online / WA</button>
                    </div>
                </div>

                {/* Topik Konseling */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Topik Singkat</label>
                    <input
                        type="text"
                        placeholder="Misal: Keluarga, Pekerjaan, dll..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-300"
                    />
                </div>

                {/* Jadwal */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Rencana Waktu</label>
                    <input
                        type="text"
                        placeholder="Contoh: Sabtu Sore"
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-300"
                    />
                </div>

                {/* Tombol Ajukan */}
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={handleRequest}
                        className={`w-full p-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl ${status === 'error'
                                ? 'bg-rose-600'
                                : 'bg-slate-900 active:scale-95'
                            }`}
                    >
                        {status === 'error' ? (
                            <span className="font-black uppercase text-[11px] tracking-[0.1em] text-white">
                                ERROR: DATABASE OFFLINE
                            </span>
                        ) : (
                            <span className="font-black uppercase text-xs tracking-[0.2em] text-white">
                                Jadwalkan Konseling
                            </span>
                        )}
                    </button>

                    {status === 'error' && (
                        <p className="text-[9px] text-rose-600 font-black text-center uppercase tracking-widest">
                            Gagal memproses jadwal, silakan hubungi sekretariat
                        </p>
                    )}
                </div>
            </form>

            {/* Note Box */}
            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed text-center tracking-tight">
                    Privasi Anda terjaga sepenuhnya. Pendeta atau tim konselor akan menghubungi Anda untuk konfirmasi jadwal lebih lanjut.
                </p>
            </div>
        </div>
    );
};

export default KonselingForm;