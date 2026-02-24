// KonselingForm.tsx
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, DatabaseZap, ShieldCheck } from 'lucide-react';

interface KonselingFormProps {
    onBack: () => void;
}

const LayananGerejaForm = ({ onBack }: KonselingFormProps) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [selectedService, setSelectedService] = useState('Baptis');

    const SCRIPT_URL = import.meta.env.VITE_OTHER_URL;
    const services = [
        { id: 'baptis', label: 'Baptis' },
        { id: 'sidi', label: 'Sidi' },
        { id: 'martuppol', label: 'Martuppol' },
        { id: 'pernikahan', label: 'Pernikahan' },
        { id: 'lainnya', label: 'Lainnya' },
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        formData.append('target_sheet', 'Layanan Gereja');
        formData.append('layanan', selectedService);
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
                <ArrowLeft size={18} /> Kembali
            </button>

            <header className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Layanan Gereja
                </h2>
                <p className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.3em]">Permohonan Pelayanan Sakramen</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={handleSubmit}>
                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama Pemohon</label>
                    <input
                        name="nama"
                        type="text"
                        required
                        placeholder="Masukkan nama lengkap..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-emerald-500"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Nomor WhatsApp</label>
                    <input
                        name="whatsapp"
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-emerald-500"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Jenis Layanan</label>
                    <div className="grid grid-cols-2 gap-2">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => setSelectedService(service.label)}
                                className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedService === service.label
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                    : 'bg-slate-50 border-transparent text-slate-400'
                                    }`}
                            >
                                {service.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-2">Pesan atau Keterangan</label>
                    <textarea
                        name="pesan"
                        required
                        placeholder="Tuliskan detail permohonan atau jadwal yang diinginkan..."
                        rows={4}
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-emerald-500 resize-none"
                    />
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Privasi Data</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 leading-relaxed tracking-tight">
                        Informasi permohonan layanan ini bersifat rahasia dan hanya akan diakses oleh bagian pengurus gereja terkait.
                    </p>
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

                        <span className="font-black uppercase text-[12px] tracking-[0.2em] text-white">
                            {status === 'loading' ? 'Mengirim...' :
                                status === 'success' ? 'Berhasil Terkirim' :
                                    status === 'error' ? 'Error: Database Offline' :
                                        'Kirim Permohonan'}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full p-5 rounded-[2rem] border-2 border-slate-100 flex items-center justify-center active:scale-95 transition-all"
                    >
                        <span className="font-black uppercase text-[12px] tracking-[0.2em] text-slate-900">
                            Batal
                        </span>
                    </button>
                </div>
            </form>

            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                <p className="text-[12px] text-slate-900 font-bold leading-relaxed text-center tracking-tight">
                    Pastikan data yang diisi benar. Tim sekretariat akan menghubungi Anda untuk tahap administrasi lebih lanjut.
                </p>
            </div>
        </div>
    );
};

export default LayananGerejaForm;