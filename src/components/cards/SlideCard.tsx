// SlideCard.tsx
import React, { useState, useEffect } from 'react';
import { Loader2, ChevronDown, X } from 'lucide-react';

let cachedSlideData: any[] | null = null;

const GoogleDriveImage = ({ url, name, className }: { url: string | null, name: string, className: string }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url || url === "#" || url === "-") {
            setLoading(false);
            setImgSrc(null);
            return;
        }

        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            if (fileId) {
                setImgSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=200`);
            } else {
                setImgSrc(url);
                setLoading(false);
            }
        } else {
            setImgSrc(url);
            setLoading(false);
        }
    }, [url]);

    if (!imgSrc && !loading) {
        return (
            <div className={`${className} bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-sm border border-slate-200`}>
                {name.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className={`${className} relative overflow-hidden bg-slate-100 border border-slate-200`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                    <Loader2 className="animate-spin text-slate-300" size={12} />
                </div>
            )}
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={name}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
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

const PDFCover = ({ url }: { url: string }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url || url === "#" || url === "-") {
            setLoading(false);
            setImgSrc(null);
            return;
        }

        if (url.includes('drive.google.com')) {
            const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
            const fileId = match ? match[1] : null;
            if (fileId) {
                setImgSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w500`);
            } else {
                setLoading(false);
                setImgSrc(null);
            }
        } else {
            setLoading(false);
            setImgSrc(null);
        }
    }, [url]);

    return (

        <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden sm:rounded-xl bg-slate-100 border border-slate-200">
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <Loader2 className="animate-spin text-slate-400" size={24} />
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
            <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white tracking-widest uppercase">
                SLIDE
            </div>
        </div>
    );
};

interface SlideCardProps {
    onSelectContent?: (content: any) => void;
}

const SlideCard = ({ onSelectContent }: SlideCardProps) => {
    const [slides, setSlides] = useState<any[]>(cachedSlideData || []);
    const [loading, setLoading] = useState(!cachedSlideData);
    const [visibleCount, setVisibleCount] = useState(3);
    const [fullscreenFile, setFullscreenFile] = useState<string | null>(null);

    const TSV_URL = import.meta.env.VITE_TSV_SLIDE_URL;

    const extractId = (url: string) => {
        if (!url || url === "#" || url === "-") return null;
        const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        if (cachedSlideData) {
            setLoading(false);
            return;
        }

        const fetchSlides = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");

                if (rows.length > 1) {
                    const parsed = rows.slice(1)
                        .map(row => {
                            const cols = row.split('\t').map(v => v.trim());
                            return {
                                judul: cols[0] || "Untitled Presentation",
                                penulis: cols[1] || "Anonymous",
                                fotoPenulis: (cols[2] && cols[2] !== "" && cols[2] !== "-") ? cols[2] : null,
                                linkPdf: (cols[3] && cols[3] !== "" && cols[3] !== "-") ? cols[3] : "#"
                            };
                        })
                        // FILTER: Hanya tampilkan jika judul bukan "-" dan linkPdf bukan "#" atau "-"
                        .filter(item => item.judul !== "-" && item.linkPdf !== "#" && item.linkPdf !== "-");

                    setSlides(parsed);
                    cachedSlideData = parsed;
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
        const handlePopState = (e: PopStateEvent) => {
            setFullscreenFile(null);
            document.body.classList.remove('modal-open');
        };

        if (fullscreenFile) {
            document.body.classList.add('modal-open');
            if (window.history.state?.modal !== 'slide') {
                window.history.pushState({ modal: 'slide' }, "");
            }
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
            document.body.classList.remove('modal-open');
        };
    }, [fullscreenFile]);

    const closeFullscreen = () => {
        if (window.history.state?.modal === 'slide') {
            window.history.back();
        } else {
            setFullscreenFile(null);
            document.body.classList.remove('modal-open');
        }
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    const handleItemClick = (slide: any) => {
        const fileId = extractId(slide.linkPdf);
        const isMobile = window.innerWidth < 1024;

        if (isMobile) {
            setFullscreenFile(fileId);
        } else {
            if (onSelectContent) {
                onSelectContent({
                    ...slide,
                    id: fileId,
                    type: 'pdf'
                });
            }
        }
    };

    const visibleSlides = slides.slice(0, visibleCount);
    const hasMore = visibleCount < slides.length;

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
    );

    return (
        <div className="space-y-6 pt-12 scroll-mt-24">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Pembinaan</h2>
                <p className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.2em]">Materi Pembinaan Warga Jemaat</p>
            </header>
            <div className="w-full max-w-2xl mx-auto">
                <div className="flex flex-col gap-y-10">
                    {visibleSlides.map((slide, index) => (
                        <div key={index} className="flex flex-col group cursor-pointer" onClick={() => handleItemClick(slide)}>
                            <div className="flex flex-col w-full">
                                <PDFCover url={slide.linkPdf} />
                                <div className="mt-4 px-4 sm:px-0 flex gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <GoogleDriveImage
                                            url={slide.fotoPenulis}
                                            name={slide.penulis}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-grow pr-2 text-left">
                                        <h3 className="text-[16px] font-bold leading-tight text-slate-900 line-clamp-2 mb-1">
                                            {slide.judul}
                                        </h3>
                                        <div className="flex flex-wrap items-center text-[13px] text-slate-500 gap-1.5 font-medium">
                                            <span>{slide.penulis}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-12 pb-12">
                        <button
                            onClick={handleLoadMore}
                            className="flex items-center gap-2 px-10 py-3.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all text-xs font-bold uppercase tracking-widest text-slate-900 shadow-sm active:scale-95"
                        >
                            Liat lainnya
                            <ChevronDown size={16} strokeWidth={3} />
                        </button>
                    </div>
                )}

                {fullscreenFile && (
                    <div className="fixed inset-0 z-[999] bg-white flex flex-col lg:hidden">
                        <button
                            onClick={closeFullscreen}
                            className="absolute top-3 left-4 z-[999] p-2 bg-red-900/85 text-white"
                        >
                            <X size={24} />
                        </button>
                        <div className="w-full h-full">
                            <iframe
                                src={`https://drive.google.com/file/d/${fullscreenFile}/preview`}
                                className="w-full h-full border-none"
                                allow="autoplay"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlideCard;