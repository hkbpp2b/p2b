// OtherTab.tsx

import React, { useState } from 'react';
import { UserPlus, MessageSquareHeart, MessageCircleWarning, HeartHandshake, ChevronRight } from 'lucide-react';
import DataJemaatForm from '../cards/DataJemaatForm';
import DoaForm from '../cards/DoaForm';
import SaranForm from '../cards/SaranForm';
import KonselingForm from '../cards/KonselingForm';


const OtherTab = () => {
    const [activeView, setActiveView] = useState<'menu' | 'data-jemaat' | 'doa' | 'saran' | 'konseling'>('menu');

    const services = [
        {
            id: "data-jemaat",
            title: "Pendataan Jemaat",
            desc: "Pendaftaran & pembaruan data",
            icon: <UserPlus className="text-blue-600" size={24} />,
            color: "bg-blue-50",
        },
        {
            id: "konseling",
            title: "Layanan Gereja",
            desc: "Permohonan Sakramen & Layanan",
            icon: <HeartHandshake className="text-emerald-600" size={24} />,
            color: "bg-emerald-50",
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
    ];

    if (activeView === 'data-jemaat') return <DataJemaatForm onBack={() => setActiveView('menu')} />;
    if (activeView === 'doa') return <DoaForm onBack={() => setActiveView('menu')} />;
    if (activeView === 'saran') return <SaranForm onBack={() => setActiveView('menu')} />;
    if (activeView === 'konseling') return <KonselingForm onBack={() => setActiveView('menu')} />;

    return (
        <div className="animate-in fade-in duration-700 pb-32 pt-8 px-5 space-y-10">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Layanan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Layanan Jemaat Digital</p>
            </header>

            <div className="space-y-4 px-2">
                {services.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => setActiveView(service.id as any)}
                        className="w-full bg-white border border-slate-100 p-6 rounded-[2.5rem] flex items-center gap-5 group active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
                    >
                        <div className={`h-14 w-14 ${service.color} rounded-3xl flex items-center justify-center shrink-0`}>
                            {service.icon}
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{service.title}</h3>
                            <p className="text-[10px] text-slate-900 font-bold mt-0.5">{service.desc}</p>
                        </div>
                        <div className="text-slate-900 group-hover:text-slate-900 transition-colors">
                            <ChevronRight size={20} />
                        </div>
                    </button>
                ))}
            </div>

            <div className="mx-2 p-7 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xl">
                <div className="text-center space-y-2">
                    <p className="text-[12px] text-white font-black uppercase tracking-widest">Administrasi Huria</p>
                    <div className="text-center space-y-2">
                        <p className="text-[14px] text-slate-300 font-bold tracking-tight">081310683300</p>
                    </div>
                    <p className="text-[12px] text-white font-black uppercase tracking-widest">Jam Pelayanan Kantor</p>
                    <div className="flex flex-col gap-1">
                        <p className="text-[14px] text-slate-300 font-bold tracking-tight">Selasa - Sabtu</p>
                        <p className="text-[14px] text-slate-300 font-bold tracking-tight">09.30 - 16.00 WIB</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OtherTab;