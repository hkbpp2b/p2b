// SlideCardHome.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, FileText } from 'lucide-react';

let cachedSlideHomeData: any[] | null = null;

const PDFCoverHome = ({ url }: { url: string }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url || url === "#") {
            setLoading(false);
            return;
        }

        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            if (fileId) {
                setImgSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [url]);

    return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${loading ? 'bg-slate-100' : 'bg-slate-900'}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-slate-400" size={20} />
                </div>
            )}

            {!imgSrc && !loading && (
                <div className="text-slate-400 flex flex-col items-center gap-2">
                    <FileText size={32} strokeWidth={1} />
                </div>
            )}

            {imgSrc && (
                <img
                    src={imgSrc}
                    alt="Cover"
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setImgSrc(null);
                    }}
                />
            )}
        </div>
    );
};

interface SlideCardHomeProps {
    onNavigate?: () => void;
}

const SlideCardHome = ({ onNavigate }: SlideCardHomeProps) => {
    const [slides, setSlides] = useState<any[]>(cachedSlideHomeData || []);
    const [loading, setLoading] = useState(!cachedSlideHomeData);
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);

    const TSV_URL = import.meta.env.VITE_TSV_SLIDE_URL;

    useEffect(() => {
        if (cachedSlideHomeData) return;
        const fetchSlides = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");
                if (rows.length > 1) {
                    const parsed = rows.slice(1).map(row => {
                        const cols = row.split('\t').map(v => v.trim());
                        return {
                            judul: cols[0] || "Untitled Presentation",
                            penulis: cols[1] || "Anonymous",
                            linkPdf: cols[3] || "#"
                        };
                    });
                    setSlides(parsed);
                    cachedSlideHomeData = parsed;
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, [TSV_URL]);

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                if (isDragging) return;
                const nextSlide = (currentSlide + 1) % slides.length;
                sliderRef.current?.scrollTo({
                    left: nextSlide * (sliderRef.current?.offsetWidth || 0),
                    behavior: 'smooth'
                });
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [slides, currentSlide, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragDistance(0);
        setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
        setScrollLeft(sliderRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        setDragDistance(Math.abs(walk));
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleScroll = () => {
        if (sliderRef.current && sliderRef.current.offsetWidth > 0) {
            const index = Math.round(sliderRef.current.scrollLeft / sliderRef.current.offsetWidth);
            if (index !== currentSlide) {
                setCurrentSlide(index);
            }
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (dragDistance > 10) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (onNavigate) {
            onNavigate();
        }
    };

    if (loading) return (
        <div className="bg-white rounded-[2.5rem] aspect-video flex items-center justify-center border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-slate-900" size={24} />
        </div>
    );

    return (
        <div
            onClick={handleClick}
            className="rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 p-3 bg-white relative cursor-pointer active:scale-95 transition-transform duration-200"
        >
            <div className="absolute -top-1 -right-1 z-40 scale-90 pointer-events-none">
                <div className="relative flex items-center justify-center">
                    <svg viewBox="0 25 90 100" className="w-16 h-16 fill-red-500 drop-shadow-md">
                        <path d="M50 5L55 18L68 14L69 27L82 27L79 40L91 44L85 55L94 66L81 70L81 83L68 82L61 94L50 88L39 94L32 82L19 83L19 70L6 66L15 55L9 44L21 40L18 27L31 27L32 14L45 18Z" />
                    </svg>
                    <span className="absolute right-4.5 top-3 text-white text-[9px] font-bold tracking-widest">
                        Baru
                    </span>
                </div>
            </div>

            <div className="mb-2 text-center pointer-events-none">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Wawasan Iman</h3>
                <p className="text-[12px] text-slate-800 font-bold uppercase tracking-[0.1em]">{slides[currentSlide]?.judul}</p>
            </div>

            <div className="rounded-[2rem] overflow-hidden aspect-video relative group bg-slate-900 pointer-events-none">
                <div
                    ref={sliderRef}
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseUp}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar ${isDragging ? 'select-none' : ''}`}
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    {slides.map((slide, idx) => (
                        <div
                            key={idx}
                            className="w-full h-full shrink-0 snap-center relative"
                        >
                            <PDFCoverHome url={slide.linkPdf} />
                        </div>
                    ))}
                </div>

                <div className="absolute top-5 left-6 flex gap-1.5 z-30 pointer-events-none">
                    {slides.map((_, idx) => (
                        <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SlideCardHome;