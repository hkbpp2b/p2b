import React, { useState } from 'react';
import { UserPlus, MessageSquareHeart, MessageCircleWarning, HeartHandshake, ChevronRight } from 'lucide-react';
import DataJemaatForm from './DataJemaatForm'; // Import file form baru
import DoaForm from './DoaForm'; // Import file baru
import SaranForm from './SaranForm';
import KonselingForm from './KonselingForm';

const OtherTab = () => {
    // State untuk mengontrol halaman mana yang tampil
    const [activeView, setActiveView] = useState<'menu' | 'data-jemaat' | 'doa' | 'saran' | 'konseling'>('menu');

    const services = [
        {
            id: "data-jemaat",
            title: "Data Jemaat",
            desc: "Pendaftaran & pembaruan data",
            icon: <UserPlus className="text-blue-600" size={24} />,
            color: "bg-blue-50",
        },
        {
            id: "doa",
            title: "Permohonan Doa",
            desc: "Kirim pokok doa kepada gereja",
            icon: <MessageSquareHeart className="text-rose-600" size={24} />,
            color: "bg-rose-50",
        },
        {
            id: "saran",
            title: "Kritik & Saran",
            desc: "Masukan untuk pelayanan gereja",
            icon: <MessageCircleWarning className="text-amber-600" size={24} />,
            color: "bg-amber-50",
        },
        {
            id: "konseling",
            title: "Layanan Konseling",
            desc: "Jadwalkan waktu bertemu pendeta",
            icon: <HeartHandshake className="text-emerald-600" size={24} />,
            color: "bg-emerald-50",
        }
    ];

    // LOGIC ROUTING INTERNAL
    // Jika klik "Data Jemaat", tampilkan Form. Selain itu, biarkan menu utama.
    if (activeView === 'data-jemaat') {
        return <DataJemaatForm onBack={() => setActiveView('menu')} />;
    }


    // ... di dalam komponen OtherTab
    if (activeView === 'doa') {
        return <DoaForm onBack={() => setActiveView('menu')} />;
    }

    // Di dalam OtherTab...
    if (activeView === 'saran') {
        return <SaranForm onBack={() => setActiveView('menu')} />;
    }


    // Di dalam komponen OtherTab:
    if (activeView === 'konseling') {
        return <KonselingForm onBack={() => setActiveView('menu')} />;
    }

    // Kamu bisa tambah 'if' lain di sini untuk form doa, dll.
    // if (activeView === 'doa') return <DoaForm onBack={() => setActiveView('menu')} />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-32 pt-4">
            <header className="px-1 text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Lainnya</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Layanan Jemaat Digital</p>
            </header>

            <div className="space-y-4 px-2">
                {services.map((service) => (
                    <button
                        key={service.id}
                        // Update state sesuai ID service yang diklik
                        onClick={() => setActiveView(service.id as any)}
                        className="w-full bg-white border border-slate-100 p-6 rounded-[2.5rem] flex items-center gap-5 group active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
                    >
                        <div className={`h-14 w-14 ${service.color} rounded-3xl flex items-center justify-center shrink-0`}>
                            {service.icon}
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{service.title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{service.desc}</p>
                        </div>
                        <div className="text-slate-200 group-hover:text-slate-400 transition-colors">
                            <ChevronRight size={20} />
                        </div>
                    </button>
                ))}
            </div>

            <div className="mx-2 p-8 bg-slate-900 rounded-[3rem] text-center space-y-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 opacity-50 blur-3xl"></div>
                <p className="relative z-10 text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Butuh Bantuan Lain?</p>
                <p className="relative z-10 text-white/60 text-[11px] leading-relaxed font-medium">
                    Silahkan hubungi Sekretariat HKBP Perumnas 2 Bekasi melalui WhatsApp atau datang langsung pada jam kerja.
                </p>
            </div>
        </div>
    );
};

export default OtherTab;