import React, { useRef, useState, useEffect } from 'react';
import videoHero from '../assets/2.mp4';
import VerseBox from './VerseBox';

const ProfileTab = () => { // Note: Pastikan nama file/komponen sesuai keinginanmu
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoVisible, setIsVideoVisible] = useState(true);

    // Fungsi untuk mendapatkan tanggal Minggu terdekat
    const getNextSunday = () => {
        const now = new Date();
        const today = now.getDay();
        const distance = (7 - today) % 7;
        const sunday = new Date(now);
        sunday.setDate(now.getDate() + distance);

        return sunday.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.currentTime >= video.duration - 0.5) {
                setIsVideoVisible(false);
            } else if (video.currentTime < 0.5) {
                setIsVideoVisible(true);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, []);

    const handleOpenMaps = () => {
        const mapsUrl = "https://www.google.com/maps/search/?api=1&query=HKBP+Perumnas+2+Bekasi";
        window.open(mapsUrl, '_blank');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-24">

            {/* 1. SECTION VIDEO HERO */}
            <section className="relative w-full rounded-[2.5rem] overflow-hidden shadow-sm aspect-video bg-slate-900">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-full h-full object-cover scale-[1.5] origin-top transition-opacity duration-500 ${isVideoVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    <source src={videoHero} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                    <div className="space-y-1">
                        <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.3em] mb-1">
                            Topik Minggu:
                        </p>
                        <h2 className="text-white font-bold italic text-xl drop-shadow-lg leading-tight">
                            "ALLAH MEMBERIKAN DAMAI SEJAHTERA"
                        </h2>
                    </div>
                </div>
            </section>

            {/* 2. KARTU JADWAL */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Jadwal Ibadah</h3>
                    {/* TANGGAL OTOMATIS DI SINI */}
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
                        {getNextSunday()}
                    </p>
                </div>

                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-[1px] before:bg-slate-100">
                    {[
                        { name: "Ibadah Subuh", time: "06:00", desc: "Bahasa Batak" },
                        { name: "Ibadah Pagi", time: "10:00", desc: "Bahasa Indonesia" },
                        { name: "Ibadah Sore", time: "17:00", desc: "Remaja & Pemuda" }
                    ].map((item, i) => (
                        <div key={i} className="relative flex items-center gap-6 group">
                            <div className="relative z-10 h-[22px] w-[22px] shrink-0 rounded-full bg-white border-[1.5px] border-slate-200 group-hover:border-blue-600 transition-colors duration-500 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-blue-600 transition-colors duration-500"></div>
                            </div>

                            <div className="flex flex-1 justify-between items-center bg-slate-50/40 p-5 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-sm transition-all duration-300">
                                <div className="flex flex-col">
                                    <span className="text-slate-900 font-bold text-sm tracking-tight">{item.name}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.desc}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-blue-700 font-black text-lg leading-none">{item.time}</span>
                                    <span className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter mt-1 text-right">WIB</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <button
                        onClick={handleOpenMaps}
                        className="text-[11px] text-slate-500 font-bold tracking-tight active:opacity-40 transition-opacity"
                    >
                        Jalan Gunung Gede Raya No. 1 RT. 5/RW. 13, Kayuringin Jaya, Bekasi Selatan
                    </button>
                </div>
            </div>

            <VerseBox
                verse="Sebab di mana dua atau tiga orang berkumpul dalam Nama-Ku, di situ Aku ada di tengah-tengah mereka."
                reference="Matius 18:20"
            />
        </div>
    );
};

export default ProfileTab;