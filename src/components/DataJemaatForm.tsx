import React, { useState } from 'react';
import { ArrowLeft, DatabaseZap } from 'lucide-react';

interface DataJemaatFormProps {
    onBack: () => void;
}

const DataJemaatForm = ({ onBack }: DataJemaatFormProps) => {
    const [status, setStatus] = useState<'idle' | 'error'>('idle');

    const handleSave = () => {
        setStatus('error');
        // Balik ke normal setelah 3 detik
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
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Data Jemaat</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Informasi Administrasi Jemaat</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={(e) => e.preventDefault()}>

                {/* Input Nama */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap (Sesuai KTP)</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama lengkap..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-blue-500"
                    />
                </div>

                {/* Input WA */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nomor WhatsApp Aktif</label>
                    <input
                        type="tel"
                        placeholder="0812..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-emerald-500"
                    />
                </div>

                {/* Input Lingkungan */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Lingkungan / Sektor</label>
                    <input
                        type="text"
                        placeholder="Contoh: Lingkungan 04"
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-rose-500"
                    />
                </div>

                {/* Tombol Simpan */}
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        className={`w-full p-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl ${status === 'error'
                                ? 'bg-rose-600'
                                : 'bg-slate-900 active:scale-95'
                            }`}
                    >
                        {status === 'error' ? (
                            <>
                                <DatabaseZap size={18} className="text-white" />
                                <span className="font-black uppercase text-[11px] tracking-[0.1em] text-white">
                                    ERROR: DATABASE OFFLINE
                                </span>
                            </>
                        ) : (
                            <span className="font-black uppercase text-xs tracking-[0.2em] text-white">
                                Simpan Data
                            </span>
                        )}
                    </button>

                    {status === 'error' && (
                        <p className="text-[9px] text-rose-600 font-black text-center uppercase tracking-widest">
                            Server tidak merespon, coba lagi nanti
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default DataJemaatForm;