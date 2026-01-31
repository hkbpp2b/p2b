import React, { useState } from 'react';
import { ArrowLeft, DatabaseZap, Plus, Trash2 } from 'lucide-react';

interface DataJemaatFormProps {
    onBack: () => void;
}

const DataJemaatForm = ({ onBack }: DataJemaatFormProps) => {
    const [status, setStatus] = useState<'idle' | 'error'>('idle');
    const [anak, setAnak] = useState<string[]>(['']);

    const handleAddAnak = () => setAnak([...anak, '']);
    const handleRemoveAnak = (index: number) => {
        const newAnak = anak.filter((_, i) => i !== index);
        setAnak(newAnak.length ? newAnak : ['']);
    };

    const handleAnakChange = (index: number, value: string) => {
        const newAnak = [...anak];
        newAnak[index] = value;
        setAnak(newAnak);
    };

    const handleSave = () => {
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
                <ArrowLeft size={16} /> Kembali
            </button>

            {/* Header */}
            <header className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Data Jemaat</h2>
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.3em]">Informasi Administrasi Jemaat</p>
            </header>

            {/* Form Start */}
            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={(e) => e.preventDefault()}>

                {/* 1. Nama Kepala Keluarga */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama Lengkap Kepala Keluarga</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama kepala keluarga..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-blue-500"
                    />
                </div>

                {/* 2. No WA Aktif */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">No. WhatsApp Aktif</label>
                    <input
                        type="tel"
                        placeholder="0812..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-emerald-500"
                    />
                </div>

                {/* 3. Nama Istri */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama Lengkap Istri</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama lengkap istri..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-rose-500"
                    />
                </div>

                {/* 4. Nama Anak (Dinamis) */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama Lengkap Anak</label>
                    {anak.map((nama, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={nama}
                                onChange={(e) => handleAnakChange(index, e.target.value)}
                                placeholder={`Anak ke-${index + 1}`}
                                className="flex-1 bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-900"
                            />
                            {anak.length > 1 && (
                                <button onClick={() => handleRemoveAnak(index)} className="px-2 text-rose-600">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddAnak}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 ml-2"
                    >
                        <Plus size={14} /> Tambah Anak
                    </button>
                </div>

                {/* 5. Alamat */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Alamat Lengkap</label>
                    <textarea
                        placeholder="Jl. Contoh No. 123..."
                        rows={3}
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-900 resize-none"
                    />
                </div>

                {/* 6. Wilayah */}
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Wilayah / Weyk</label>
                    <input
                        type="text"
                        placeholder="Contoh: Weyk 04"
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-900"
                    />
                </div>

                {/* Group Tombol Aksi */}
                <div className="space-y-3 pt-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className={`w-full p-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl transition-all ${status === 'error'
                            ? 'bg-rose-600'
                            : 'bg-slate-900 active:scale-95'
                            }`}
                    >
                        {status === 'error' ? (
                            <>
                                <DatabaseZap size={18} className="text-white" />
                                <span className="font-black uppercase text-[12px] tracking-[0.1em] text-white">
                                    ERROR: DATABASE OFFLINE
                                </span>
                            </>
                        ) : (
                            <span className="font-black uppercase text-xs tracking-[0.2em] text-white">
                                Simpan Data
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full p-5 rounded-[2rem] border-2 border-slate-100 flex items-center justify-center active:scale-95 transition-all"
                    >
                        <span className="font-black uppercase text-[12px] tracking-[0.2em] text-slate-900">
                            Kembali
                        </span>
                    </button>

                    {status === 'error' && (
                        <p className="text-[9px] text-rose-600 font-black text-center uppercase tracking-widest mt-2">
                            Server tidak merespon, coba lagi nanti
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default DataJemaatForm;