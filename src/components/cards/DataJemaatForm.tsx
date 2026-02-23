// DataJemaatForm.tsx

import React, { useState } from 'react';
import { ArrowLeft, DatabaseZap, Plus, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

interface DataJemaatFormProps {
    onBack: () => void;
}

const DataJemaatForm = ({ onBack }: DataJemaatFormProps) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [anak, setAnak] = useState<string[]>(['']);

    const SCRIPT_URL = import.meta.env.VITE_OTHER_URL;

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        formData.append('target_sheet', 'Data Jemaat');
        formData.append('nama_anak', anak.filter(n => n.trim() !== '').join(', '));
        formData.append('tanggal', new Date().toLocaleString('id-ID'));

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                onBack();
            }, 2000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <div className="space-y-8 pb-32 pt-4 px-2">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-900 font-black uppercase text-[12px] tracking-[0.2em]"
            >
                <ArrowLeft size={16} /> Kembali
            </button>

            <header className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Data Jemaat</h2>
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.3em]">Informasi Administrasi Jemaat</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={handleSubmit}>
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama Lengkap Kepala Keluarga</label>
                    <input
                        name="nama_kk"
                        type="text"
                        required
                        placeholder="Masukkan nama kepala keluarga..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-blue-500"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">No. WhatsApp Aktif</label>
                    <input
                        name="whatsapp"
                        type="tel"
                        required
                        placeholder="0812..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-emerald-500"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama Lengkap Istri</label>
                    <input
                        name="nama_istri"
                        type="text"
                        placeholder="Masukkan nama lengkap istri..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-rose-500"
                    />
                </div>

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
                                <button type="button" onClick={() => handleRemoveAnak(index)} className="px-2 text-rose-600">
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

                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Alamat Lengkap</label>
                    <textarea
                        name="alamat"
                        required
                        placeholder="Jl. Contoh No. 123..."
                        rows={3}
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-900 resize-none"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Wilayah / Weyk</label>
                    <input
                        name="wilayah"
                        type="text"
                        required
                        placeholder="Contoh: Weyk 04"
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-slate-900"
                    />
                </div>

                <div className="space-y-3 pt-4">
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full p-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl transition-all ${status === 'error' ? 'bg-rose-600' :
                            status === 'success' ? 'bg-emerald-500' :
                                'bg-slate-900 active:scale-95'
                            } disabled:opacity-70`}
                    >
                        {status === 'loading' && <Loader2 size={18} className="text-white animate-spin" />}
                        {status === 'success' && <CheckCircle2 size={18} className="text-white" />}
                        {status === 'error' && <DatabaseZap size={18} className="text-white" />}

                        <span className="font-black uppercase text-[12px] tracking-[0.1em] text-white">
                            {status === 'loading' ? 'Mengirim...' :
                                status === 'success' ? 'Berhasil Disimpan' :
                                    status === 'error' ? 'Error: Database Offline' :
                                        'Simpan Data'}
                        </span>
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
                </div>
            </form>
        </div>
    );
};

export default DataJemaatForm;