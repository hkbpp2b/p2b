import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface SaranFormProps {
    onBack: () => void;
}

const SaranForm = ({ onBack }: SaranFormProps) => {
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
                    Kritik & Saran
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Bantu Kami Melayani Lebih Baik</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={(e) => e.preventDefault()}>

                {/* Kategori Saran */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kategori Masukan</label>
                    <select className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-300 appearance-none">
                        <option>Layanan Ibadah</option>
                        <option>Fasilitas Gereja</option>
                        <option>Kegiatan Jemaat</option>
                        <option>Lainnya</option>
                    </select>
                </div>

                {/* Isi Pesan */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Isi Kritik / Saran</label>
                    <textarea
                        rows={6}
                        placeholder="Tuliskan masukan Anda secara detail..."
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
                            <span className="font-black uppercase text-[11px] tracking-[0.1em] text-white">
                                ERROR: DATABASE OFFLINE
                            </span>
                        ) : (
                            <span className="font-black uppercase text-xs tracking-[0.2em] text-white">
                                Kirim Masukan
                            </span>
                        )}
                    </button>

                    {status === 'error' && (
                        <p className="text-[9px] text-rose-600 font-black text-center uppercase tracking-widest">
                            Gagal mengirim, koneksi database terputus
                        </p>
                    )}
                </div>
            </form>

            {/* Note Box */}
            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed text-center tracking-tight">
                    Setiap masukan yang Anda berikan sangat berharga bagi peningkatan pelayanan HKBP Perumnas 2 Bekasi. Terima kasih.
                </p>
            </div>
        </div>
    );
};

export default SaranForm;