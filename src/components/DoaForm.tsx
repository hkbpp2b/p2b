import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface DoaFormProps {
    onBack: () => void;
}

const DoaForm = ({ onBack }: DoaFormProps) => {
    const [status, setStatus] = useState<'idle' | 'error'>('idle');

    const handleSend = () => {
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
                    Permohonan Doa
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Kami Ingin Berdoa Bersama Anda</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={(e) => e.preventDefault()}>

                {/* Input Nama */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama (Boleh Inisial)</label>
                    <input
                        type="text"
                        placeholder="Nama atau Anonim..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-300"
                    />
                </div>

                {/* Input Pokok Doa */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pokok Doa / Pergumulan</label>
                    <textarea
                        rows={5}
                        placeholder="Tuliskan pokok doa Anda di sini..."
                        className="w-full bg-slate-50 rounded-[2rem] p-6 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-300 resize-none"
                    ></textarea>
                </div>

                {/* Tombol Kirim */}
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={handleSend}
                        className={`w-full p-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl ${status === 'error'
                                ? 'bg-rose-600'
                                : 'bg-slate-900 active:scale-95'
                            }`}
                    >
                        {status === 'error' ? (
                            <span className="font-black uppercase text-[11px] tracking-[0.1em] text-white text-white">
                                ERROR: DATABASE OFFLINE
                            </span>
                        ) : (
                            <span className="font-black uppercase text-xs tracking-[0.2em] text-white">
                                Kirim Permohonan Doa
                            </span>
                        )}
                    </button>

                    {status === 'error' && (
                        <p className="text-[9px] text-rose-600 font-black text-center uppercase tracking-widest">
                            Server sibuk, permohonan gagal terkirim
                        </p>
                    )}
                </div>
            </form>

            {/* Quote Box - Warna Netral */}
            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed text-center italic">
                    "Bersukacitalah dalam pengharapan, sabarlah dalam kesesakan, dan bertekunlah dalam doa!" <br />
                    <span className="not-italic font-black mt-2 block text-slate-800 tracking-tighter">— Roma 12:12</span>
                </p>
            </div>
        </div>
    );
};

export default DoaForm;