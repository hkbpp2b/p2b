// SaranForm.tsx
import React, { useState } from 'react';
import { ArrowLeft, Send, Loader2, CheckCircle2, MessageCircleWarning } from 'lucide-react';

interface SaranFormProps {
    onBack: () => void;
}

const SaranForm = ({ onBack }: SaranFormProps) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const SCRIPT_URL = import.meta.env.VITE_OTHER_URL;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        formData.append('target_sheet', 'Kritik dan Saran');
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
                className="flex items-center gap-2 text-slate-900 font-black uppercase text-xs tracking-[0.2em]"
            >
                <ArrowLeft size={18} /> Kembali
            </button>

            <header className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Kritik & Saran
                </h2>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-[0.3em]">Bantu Kami Melayani Lebih Baik</p>
            </header>

            <form className="space-y-6 bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60" onSubmit={handleSubmit}>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Nama (Opsional)</label>
                    <input
                        name="nama"
                        type="text"
                        placeholder="Masukkan nama Anda..."
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-amber-500"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Kritik atau Saran</label>
                    <textarea
                        name="saran"
                        required
                        placeholder="Tuliskan masukan Anda di sini..."
                        rows={6}
                        className="w-full bg-slate-50 rounded-[1.5rem] p-5 text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-amber-500 resize-none"
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
                        {status === 'error' && <MessageCircleWarning size={18} className="text-white" />}

                        <span className="font-black uppercase text-xs tracking-[0.2em] text-white">
                            {status === 'loading' ? 'Mengirim...' :
                                status === 'success' ? 'Terima Kasih' :
                                    status === 'error' ? 'Gagal Terkirim' :
                                        'Kirim Masukan'}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full p-5 rounded-[2rem] border-2 border-slate-200 flex items-center justify-center active:scale-95 transition-all"
                    >
                        <span className="font-black uppercase text-xs tracking-[0.2em] text-slate-900">
                            Batal
                        </span>
                    </button>
                </div>
            </form>

            <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                <p className="text-xs text-slate-900 font-bold leading-relaxed text-center tracking-tight">
                    Setiap masukan yang Anda berikan sangat berharga bagi peningkatan pelayanan gereja. Terima kasih.
                </p>
            </div>
        </div>
    );
};

export default SaranForm;