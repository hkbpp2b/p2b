import React, { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Mail, Loader2, ArrowLeft, Instagram, Youtube, Facebook, Music2 } from 'lucide-react';


let cachedHeroData: any = null;

const HeroCard = () => {
    const [data, setData] = useState<any>(cachedHeroData);
    const [loading, setLoading] = useState(!cachedHeroData);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const TSV_URL = import.meta.env.VITE_HERO_TSV_URL;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
        setScrollLeft(sliderRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleSliderScroll = () => {
        if (sliderRef.current) {
            const index = Math.round(sliderRef.current.scrollLeft / sliderRef.current.offsetWidth);
            setCurrentSlide(index);
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            setIsScrolled(scrollRef.current.scrollTop > 100);
        }
    };

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
        if (selectedPhoto) {

            document.body.classList.add('modal-open');
            window.history.pushState({ photoOpen: true }, "");

            const handleBackInPhoto = (event: PopStateEvent) => {
                setSelectedPhoto(null);
                document.body.classList.remove('modal-open');
            };

            window.addEventListener('popstate', handleBackInPhoto);
            return () => {
                window.removeEventListener('popstate', handleBackInPhoto);
                document.body.classList.remove('modal-open');
            };
        }
    }, [selectedPhoto]);

    useEffect(() => {
        if (cachedHeroData) return;
        const fetchHeroData = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rawRows = text.split(/\r?\n/).filter(r => r.trim() !== "").map(r => r.split('\t'));

                if (rawRows.length > 1) {
                    let allPhotos: any[] = [];
                    rawRows.forEach((cols, index) => {
                        if (index === 0) return;

                        const imgUrl = (cols[0] || "").trim();
                        const tanggal = (cols[1] || "").trim();
                        const judul = (cols[2] || "").trim();
                        const deskripsi = (cols[3] || "").trim();

                        const isInvalid = (val: string) => {
                            const cleanVal = val.toLowerCase();
                            return !val ||
                                val === "-" ||
                                val === "" ||
                                cleanVal === "judul:" ||
                                cleanVal === "judul";
                        };

                        const isFirstSlide = index === 1;

                        if (!isFirstSlide && isInvalid(judul)) return;

                        const img = formatDriveLink(imgUrl);

                        allPhotos.push({
                            url: img || "",
                            tanggal: isInvalid(tanggal) ? "" : tanggal,
                            judul: isFirstSlide && judul === "-" ? "" : judul,
                            deskripsi: isInvalid(deskripsi) ? "" : deskripsi
                        });
                    });

                    const result = {
                        slides: allPhotos,
                        alamat: "Jl.Gunung Gede Raya No.2 Perumnas 2 Bekasi",
                        telpon: "(021) 8844443 ",
                        email: "hkbpperumnasbekasi@gmail.com",
                        maps: "https://maps.app.goo.gl/pQQHW16Fsv89kkvq6"
                    };

                    setData(result);
                    cachedHeroData = result;
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchHeroData();
    }, []);

    useEffect(() => {
        if (data?.slides?.length > 1 && !selectedPhoto) {
            const timer = setInterval(() => {
                const nextSlide = (currentSlide + 1) % data.slides.length;
                sliderRef.current?.scrollTo({
                    left: nextSlide * sliderRef.current.offsetWidth,
                    behavior: 'smooth'
                });
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [data, selectedPhoto, currentSlide]);

    if (loading) return (
        <div className="bg-white rounded-[2.5rem] h-[380px] flex items-center justify-center border border-slate-100 mt-4 shadow-sm">
            <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
    );

    return (
        <>
            <div
                className="rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 mt-4 p-3 transition-all"
                style={{

                    background: `linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #ffffff 100%)`
                }}
            >

                {/* SLIDER CONTAINER */}
                <div className="rounded-[2rem] overflow-hidden aspect-[4/3] relative bg-slate-900 group">
                    <div
                        ref={sliderRef}
                        onScroll={handleSliderScroll}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className={`flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab ${isDragging ? 'cursor-grabbing select-none snap-none' : ''}`}
                        style={{
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }}
                    >


                        {data?.slides?.map((slide: any, idx: number) => (
                            <div
                                key={idx}
                                className="w-full h-full shrink-0 snap-center relative active:scale-95 transition-transform duration-200"
                                onClick={() => setSelectedPhoto(slide)}
                            >
                                <img src={slide.url} className="w-full h-full object-cover" alt="" />


                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10" />
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-5 right-6 flex gap-1.5 z-30 pointer-events-none">
                        {data?.slides?.map((_: any, idx: number) => (
                            <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
                        ))}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-left z-20 pointer-events-none">
                        <p className="text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                            {data?.slides[currentSlide]?.tanggal || ""}
                        </p>
                        <h3 className="text-white text-[16px] font-black uppercase tracking-tight leading-none">
                            {data?.slides[currentSlide]?.judul || ""}
                        </h3>
                    </div>
                </div>


                <div className="mt-4 px-2 space-y-1 pb-1 text-slate-900">
                    <a href={data?.maps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-2xl active:bg-slate-50 transition-colors">
                        <MapPin size={18} className="text-red-400 shrink-0" />
                        <span className="text-[12px] font-black leading-snug">{data?.alamat}</span>
                    </a>

                    <a href={`tel:${data?.telpon?.replace(/[^0-9]/g, '')}`} className="flex items-center gap-4 p-3 rounded-2xl active:bg-slate-50 transition-colors">
                        <Phone size={18} className="text-blue-600 shrink-0" />
                        <span className="text-[12px] font-black">{data?.telpon}</span>
                    </a>

                    <a href={`mailto:${data?.email}`} className="flex items-center gap-4 p-3 rounded-2xl active:bg-slate-50 transition-colors">
                        <Mail size={18} className="text-red-500 shrink-0" />
                        <span className="text-[12px] font-black truncate">{data?.email}</span>
                    </a>


                    <div className="mt-3 pt-3 border-t border-slate-100/60">


                        <div className="flex gap-2 px-1">
                            <a href="https://www.instagram.com/hkbp.perum2bks/" target="_blank" rel="noopener noreferrer"
                                className="flex-1 py-3 bg-rose-50 rounded-2xl flex justify-center items-center active:bg-rose-100 active:scale-95 transition-all">
                                <Instagram size={18} className="text-pink-600" />
                            </a>
                            <a href="https://www.youtube.com/@HKBPPerumnas2Bekasi" target="_blank" rel="noopener noreferrer"
                                className="flex-1 py-3 bg-red-50 rounded-2xl flex justify-center items-center active:bg-red-100 active:scale-95 transition-all">
                                <Youtube size={18} className="text-red-600" />
                            </a>
                            <a href="https://www.facebook.com/hkbp.perum2bks" target="_blank" rel="noopener noreferrer"
                                className="flex-1 py-3 bg-blue-50 rounded-2xl flex justify-center items-center active:bg-blue-100 active:scale-95 transition-all">
                                <Facebook size={18} className="text-blue-600" />
                            </a>
                            <a href="https://www.tiktok.com/@hkbp.perum2bks" target="_blank" rel="noopener noreferrer"
                                className="flex-1 py-3 bg-slate-600 rounded-2xl flex justify-center items-center active:bg-slate-800 active:scale-95 transition-all">
                                <Music2 size={18} className="text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>


            {selectedPhoto && (
                <div className="fixed inset-0 z-[999] bg-white flex flex-col animate-in fade-in duration-300">


                    <div className="w-full max-w-7xl mx-auto flex flex-col h-full overflow-hidden">


                        <div className={`flex items-center px-6 h-[75px] bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-100 shadow-sm' : 'border-transparent'}`}>
                            <button
                                onClick={() => {
                                    setSelectedPhoto(null);

                                    if (window.history.state?.photoOpen) {

                                    }
                                }}
                                className="..."
                            >
                                <ArrowLeft size={24} />
                            </button>

                            <div className={`ml-4 transition-all duration-500 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <p className="text-[14px] font-black text-slate-900 uppercase leading-none mb-0.5">{selectedPhoto.judul}</p>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">{selectedPhoto.tanggal}</p>
                            </div>
                        </div>

                        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar bg-white">
                            <div className="flex flex-col md:flex-row items-start min-h-full">

                                <div className="w-full md:w-1/2 md:sticky md:top-0 h-[350px] md:h-[calc(100vh-75px)] overflow-hidden bg-slate-50">
                                    <img
                                        src={selectedPhoto.url}
                                        className="w-full h-full object-cover"
                                        alt="Content"
                                    />
                                </div>


                                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col bg-white">
                                    <div className="mb-8">
                                        <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">
                                            {selectedPhoto.tanggal}
                                        </p>
                                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1]">
                                            {selectedPhoto.judul}
                                        </h2>

                                    </div>

                                    <div className="pb-32">
                                        <p className="text-[16px] md:text-[18px] font-bold text-slate-900 leading-[1.8] text-left whitespace-pre-line">
                                            {selectedPhoto.deskripsi}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeroCard;