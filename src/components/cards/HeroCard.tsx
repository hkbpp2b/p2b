import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, Loader2 } from 'lucide-react';

let cachedHeroData: any = null;

const HeroCard = () => {
    const [data, setData] = useState<any>(cachedHeroData);
    const [loading, setLoading] = useState(!cachedHeroData);
    const [currentSlide, setCurrentSlide] = useState(0);

    const TSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoIpT64H7mZe1JiK8yPpr0HhXSr7dgfM5zM8sOzzLhz0SviQoJzxN425Ln9UxqRU19-R_1p4IpI3DK/pub?gid=1428170023&single=true&output=tsv";

    const formatDriveLink = (url: string) => {
        if (!url || !url.includes('http')) return null;
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : url;
        }
        return url;
    };

    useEffect(() => {
        if (cachedHeroData) return;
        const fetchHeroData = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rawRows = text.split(/\r?\n/).filter(r => r.trim() !== "").map(r => r.split('\t'));

                if (rawRows.length > 1) {
                    let allPhotos: string[] = [];
                    rawRows.forEach((cols, index) => {
                        if (index === 0) return;
                        const img = formatDriveLink(cols[0]?.trim());
                        if (img) {
                            allPhotos.push(img);
                            // PRELOADING: Paksa browser unduh gambar di background
                            const link = document.createElement('link');
                            link.rel = 'preload';
                            link.as = 'image';
                            link.href = img;
                            document.head.appendChild(link);
                        }
                    });

                    const firstRow = rawRows[1];
                    const result = {
                        slides: allPhotos,
                        alamat: firstRow[1] || "Alamat belum tersedia",
                        telpon: firstRow[2] || "-",
                        email: firstRow[3] || "-",
                        maps: firstRow[4] || "#"
                    };

                    setData(result);
                    cachedHeroData = result;
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchHeroData();
    }, []);

    useEffect(() => {
        if (data?.slides?.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % data.slides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [data]);

    if (loading) return (
        <div className="bg-white rounded-[2.5rem] h-[380px] flex items-center justify-center border border-slate-100 mt-4 shadow-sm">
            <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
    );

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 mt-4 p-3">

            {/* Box Slideshow - Menggunakan Stacked Layering */}
            <div className="rounded-[2rem] overflow-hidden aspect-[4/3] relative bg-slate-900 shadow-inner">
                {data?.slides?.map((imgUrl: string, idx: number) => (
                    <img
                        key={idx}
                        src={imgUrl}
                        alt={`Slide ${idx}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    />
                ))}

                {/* Dot Indicators */}
                <div className="absolute top-5 right-6 flex gap-1.5 z-30">
                    {data?.slides?.map((_: any, idx: number) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-700 ${idx === currentSlide ? 'w-6 bg-white shadow-lg' : 'w-1.5 bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none z-20" />

                <div className="absolute bottom-6 left-6 right-6 text-left z-20">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">We're glad you're here</p>
                    <h3 className="text-white text-[22px] font-black uppercase tracking-tight leading-none">Welcome Home</h3>
                </div>
            </div>

            {/* Kontak - Slate 900 & Font 12px */}
            <div className="mt-4 px-2 space-y-1 pb-1 text-slate-900">
                <a href={data?.maps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-2xl active:bg-slate-50 transition-colors">
                    <MapPin size={18} className="text-slate-400 shrink-0" />
                    <span className="text-[12px] font-black leading-snug break-words">{data?.alamat}</span>
                </a>
                <a href={`tel:${data?.telpon}`} className="flex items-center gap-4 p-3 rounded-2xl active:bg-slate-50 transition-colors">
                    <Phone size={18} className="text-blue-600 shrink-0" />
                    <span className="text-[12px] font-black">{data?.telpon}</span>
                </a>
                <a href={`mailto:${data?.email}`} className="flex items-center gap-4 p-3 rounded-2xl active:bg-slate-50 transition-colors">
                    <Mail size={18} className="text-red-500 shrink-0" />
                    <span className="text-[12px] font-black truncate">{data?.email}</span>
                </a>
            </div>
        </div>
    );
};

export default HeroCard;