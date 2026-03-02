// OtherTab.tsx
import React, { useState } from 'react';
import { UserPlus, MessageSquareHeart, MessageCircleWarning, HeartHandshake, ChevronRight } from 'lucide-react';
import DataJemaatForm from '../cards/DataJemaatForm';
import DoaForm from '../cards/DoaForm';
import SaranForm from '../cards/SaranForm';
import KonselingForm from '../cards/KonselingForm';

interface OtherTabProps {
    onSelectContent?: (content: any) => void;
}

const OtherTab = ({ onSelectContent }: OtherTabProps) => {
    const [activeView, setActiveView] = useState<'menu' | 'data-jemaat' | 'doa' | 'saran' | 'konseling'>('menu');

    const services = [
        {
            id: "data-jemaat",
            title: "Pendataan Jemaat",
            desc: "Pendaftaran & pembaruan data",
            icon: <UserPlus size={24} />,
            color: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            id: "konseling",
            title: "Layanan Gereja",
            desc: "Permohonan Sakramen & Layanan",
            icon: <HeartHandshake size={24} />,
            color: "bg-emerald-50",
            iconColor: "text-emerald-600"
        },
        {
            id: "doa",
            title: "Permohonan Doa",
            desc: "Kirim pokok doa kepada gereja",
            icon: <MessageSquareHeart size={24} />,
            color: "bg-rose-50",
            iconColor: "text-rose-600"
        },
        {
            id: "saran",
            title: "Kritik & Saran",
            desc: "Masukan untuk pelayanan gereja",
            icon: <MessageCircleWarning size={24} />,
            color: "bg-amber-50",
            iconColor: "text-amber-600"
        },
    ];

    const handleServiceClick = (service: any) => {
        const isDesktop = window.innerWidth >= 1024;

        if (isDesktop && onSelectContent) {
            setActiveView(service.id);
            onSelectContent({
                type: 'form',
                id: service.id,
                title: service.title,
                subtitle: "Layanan Jemaat Digital"
            });
        } else {
            setActiveView(service.id);
        }
    };

    if (activeView === 'data-jemaat' && window.innerWidth < 1024) return <DataJemaatForm onBack={() => setActiveView('menu')} />;
    if (activeView === 'doa' && window.innerWidth < 1024) return <DoaForm onBack={() => setActiveView('menu')} />;
    if (activeView === 'saran' && window.innerWidth < 1024) return <SaranForm onBack={() => setActiveView('menu')} />;
    if (activeView === 'konseling' && window.innerWidth < 1024) return <KonselingForm onBack={() => setActiveView('menu')} />;

    return (
        <div className="animate-in fade-in duration-700 pb-32 pt-8 px-5 space-y-10">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Layanan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Layanan Jemaat Digital</p>
            </header>

            <div className="space-y-4">
                {services.map((service) => {
                    const isActive = activeView === service.id;
                    return (
                        <button
                            key={service.id}
                            onClick={() => handleServiceClick(service)}
                            className={`w-full p-6 rounded-[2.5rem] flex items-center gap-5 group active:scale-[0.98] transition-all shadow-sm hover:shadow-md border ${isActive
                                    ? "bg-blue-900 border-transparent text-white scale-[1.02] shadow-xl"
                                    : "bg-white border-slate-100 text-slate-900"
                                }`}
                        >
                            <div className={`h-14 w-14 rounded-3xl flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-blue-800" : service.color
                                }`}>
                                <div className={isActive ? "text-white" : service.iconColor}>
                                    {service.icon}
                                </div>
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className={`text-[12px] font-black uppercase tracking-tight ${isActive ? "text-white" : "text-slate-900"}`}>
                                    {service.title}
                                </h3>
                                <p className={`text-[11px] font-medium mt-0.5 ${isActive ? "text-blue-200" : "text-slate-500"}`}>
                                    {service.desc}
                                </p>
                            </div>
                            <div className={isActive ? "text-white" : "text-slate-300"}>
                                <ChevronRight size={20} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mx-2 p-7 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xl">
                <div className="text-center space-y-2">
                    <p className="text-[12px] text-white font-black uppercase tracking-widest">Administrasi Huria</p>
                    <p className="text-[14px] text-slate-300 font-bold tracking-tight">081310683300</p>
                    <p className="text-[12px] text-white font-black uppercase tracking-widest mt-4">Jam Pelayanan Kantor</p>
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