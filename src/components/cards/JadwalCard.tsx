import React from 'react';

const JadwalCard = () => {
    // URL Live mandiri
    const LIVE_URL = "https://www.youtube.com/@hkbpperumnas2bekasi/live";

    // Fungsi hitung tanggal Minggu depan otomatis
    const getNextSunday = () => {
        const now = new Date();
        const nextSunday = new Date();
        nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
        return nextSunday.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const jadwal = [
        { name: "Kebaktian Umum", time: "06.00", desc: "Bahasa Batak" },
        { name: "Sekolah Minggu", time: "08.00", desc: "Bahasa Indonesia" },
        { name: "Kebaktian Umum", time: "10.00", desc: "Bahasa Batak" },
        { name: "Kebaktian Live", time: "10.00", desc: "YouTube HKBP P2B", isLive: true, link: LIVE_URL },
        { name: "Kebaktian Remaja", time: "10.00", desc: "Bahasa Indonesia" },
        { name: "Kebaktian Umum", time: "18.00", desc: "Bahasa Indonesia" }
    ];

    return (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-black text-blue-800 tracking-tighter uppercase mb-1">Jadwal Kebaktian</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{getNextSunday()}</p>
            </div>

            <div className="space-y-2">
                {jadwal.map((item, i) => (
                    <div
                        key={i}
                        onClick={() => item.isLive && window.open(item.link, '_blank')}
                        className={`flex justify-between items-center p-5 rounded-[2rem] border border-transparent bg-slate-50 transition-all duration-200 ${item.isLive ? "cursor-pointer active:scale-95 active:border-red-200" : ""
                            }`}
                    >
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <span className={`block font-black text-[14px] uppercase tracking-tight ${item.isLive ? "text-red-600" : "text-slate-900"}`}>
                                    {item.name}
                                </span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.isLive ? "text-red-400" : "text-slate-400"}`}>
                                {item.desc}
                            </span>
                        </div>

                        <div className="text-right">
                            <span className={`block font-black text-xl tracking-tighter leading-none ${item.isLive ? "text-red-600" : "text-slate-900"}`}>
                                {item.time}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${item.isLive ? "text-red-400" : "text-slate-400"}`}>
                                WIB
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JadwalCard;