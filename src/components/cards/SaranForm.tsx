import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

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
            {/* Tombol Back Atas */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-900 font-black uppercase text-xs tracking-[0.2em]"
            >
                <ArrowLeft size={18} /> Kembali
            </button>

            {/* Header */}
            <header className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Kritik & Saran
                </h2>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-[0.3em]">Bantu Kami Melayani Lebih Baik</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={(e) => e.preventDefault()}>

                {/* Kategori Saran */}
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-2">Kategori Masukan</label>
                    <div className="relative">
                        <select className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold text-slate-900 outline-none border-2 border-transparent focus:bg-white focus:border-slate-300 appearance-none cursor-pointer">
                            <option>Layanan Ibadah</option>
                            <option>Fasilitas Gereja</option>
                            <option>Kegiatan Jemaat</option>
                            <option>Lainnya</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900">
                            <ArrowLeft size={16} className="-rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Isi Pesan */}
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-2">Isi Kritik / Saran</label>
                    <textarea
                        rows={6}
                        placeholder="Tuliskan masukan Anda secara detail..."
                        className="w-full bg-slate-50 rounded-[2rem] p-6 text-sm font-bold text-slate-900 outline-none border-2 border-transparent focus:bg-white focus:border-slate-300 resize-none"
                    ></textarea>
                </div>

                {/* Group Tombol Aksi */}
                <div className="space-y-3 pt-2">
                    <button
                        type="button"
                        onClick={handleSend}
                        className={`w-full p-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl transition-all ${status === 'error'
                            ? 'bg-rose-600'
                            : 'bg-slate-900 active:scale-95'
                            }`}
                    >
                        {status === 'error' ? (
                            <span className="font-black uppercase text-xs tracking-[0.1em] text-white">
                                ERROR: DATABASE OFFLINE
                            </span>
                        ) : (
                            <>
                                <span className="font-black uppercase text-xs tracking-[0.2em] text-white">
                                    Kirim Masukan
                                </span>
                                <Send size={18} className="text-white/50" />
                            </>
                        )}
                    </button>

                    {/* Tombol Balik Bawah */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full p-5 rounded-[2rem] border-2 border-slate-200 flex items-center justify-center active:scale-95 transition-all"
                    >
                        <span className="font-black uppercase text-xs tracking-[0.2em] text-slate-900">
                            Kembali
                        </span>
                    </button>

                    {status === 'error' && (
                        <p className="text-xs text-rose-600 font-black text-center uppercase tracking-widest mt-2">
                            Gagal mengirim, koneksi database terputus
                        </p>
                    )}
                </div>
            </form>

            {/* Note Box */}
            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                <p className="text-xs text-slate-900 font-bold leading-relaxed text-center tracking-tight">
                    Setiap masukan yang Anda berikan sangat berharga bagi peningkatan pelayanan HKBP Perumnas 2 Bekasi. Terima kasih.
                </p>
            </div>
        </div>
    );
};

export default SaranForm;