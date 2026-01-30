import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface KonselingFormProps {
    onBack: () => void;
}

const LayananGerejaForm = ({ onBack }: KonselingFormProps) => {
    const [status, setStatus] = useState<'idle' | 'error'>('idle');
    const [selectedService, setSelectedService] = useState('baptis');

    const services = [
        { id: 'baptis', label: 'Baptis' },
        { id: 'sidi', label: 'Sidi' },
        { id: 'martuppol', label: 'Martuppol' },
        { id: 'pernikahan', label: 'Pernikahan' },
        { id: 'lainnya', label: 'Lainnya' }, // Opsi tambahan
    ];

    const handleRequest = () => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="space-y-8 pb-32 pt-4 px-2">
            {/* Tombol Back Atas */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-900 font-black uppercase text-[12px] tracking-[0.2em]"
            >
                <ArrowLeft size={18} /> Kembali
            </button>

            {/* Header */}
            <header className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Layanan Gereja
                </h2>
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.3em]">Permohonan Sakramen & Layanan</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={(e) => e.preventDefault()}>

                {/* Pilihan Layanan */}
                <div className="space-y-4">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Jenis Layanan</label>
                    <div className="flex flex-wrap gap-2">
                        {services.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setSelectedService(s.id)}
                                className={`px-5 py-4 rounded-2xl text-[12px] font-black uppercase transition-all border-2 ${selectedService === s.id
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                    : 'bg-slate-50 border-transparent text-slate-400'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nama Lengkap */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama Lengkap</label>
                    <input
                        type="text"
                        placeholder="Nama yang akan didaftarkan..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-[14px] font-bold text-slate-900 outline-none border-2 border-transparent focus:bg-white focus:border-slate-300"
                    />
                </div>

                {/* Form Keterangan (PENTING) */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Keterangan Tambahan</label>
                    <textarea
                        rows={3}
                        placeholder="Tulis detail permohonan atau alasan memilih 'Lainnya'..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-[14px] font-bold text-slate-900 outline-none border-2 border-transparent focus:bg-white focus:border-slate-300 resize-none"
                    />
                </div>

                {/* Rencana Waktu */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Rencana Pelaksanaan</label>
                    <input
                        type="text"
                        placeholder="Contoh: Minggu, 24 Mei 2026"
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-[14px] font-bold text-slate-900 outline-none border-2 border-transparent focus:bg-white focus:border-slate-300"
                    />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <button
                        type="button"
                        onClick={handleRequest}
                        className={`w-full p-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl transition-all ${status === 'error' ? 'bg-rose-600' : 'bg-slate-900 active:scale-95'
                            }`}
                    >
                        {status === 'error' ? (
                            <span className="font-black uppercase text-[12px] tracking-[0.1em] text-white">
                                DATABASE OFFLINE
                            </span>
                        ) : (
                            <>
                                <span className="font-black uppercase text-[12px] tracking-[0.2em] text-white">
                                    Kirim Permohonan
                                </span>
                                <CheckCircle2 size={18} className="text-white/50" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full p-5 rounded-[2rem] border-2 border-slate-200 flex items-center justify-center active:scale-95 transition-all"
                    >
                        <span className="font-black uppercase text-[12px] text-slate-900">
                            Batal
                        </span>
                    </button>
                </div>
            </form>

            {/* Disclaimer */}
            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                <p className="text-[12px] text-slate-900 font-bold leading-relaxed text-center tracking-tight uppercase">
                    Pastikan data yang diisi benar. Tim sekretariat akan menghubungi Anda untuk tahap administrasi fisik lebih lanjut.
                </p>
            </div>
        </div>
    );
};

export default LayananGerejaForm;