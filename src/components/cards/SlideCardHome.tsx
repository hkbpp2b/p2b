// SlideCardHome.tsx
import { useState, useEffect } from 'react';
import { Loader2, FileText } from 'lucide-react';

let cachedSlideHomeData: any[] | null = null;

const PDFCoverHome = ({ url }: { url: string }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url || url === "#" || url === "-") {
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
    const [slide, setSlide] = useState<any>(cachedSlideHomeData ? cachedSlideHomeData[0] : null);
    const [loading, setLoading] = useState(!cachedSlideHomeData);

    const TSV_URL = import.meta.env.VITE_TSV_SLIDE_URL;

    useEffect(() => {
        if (cachedSlideHomeData) return;
        const fetchSlides = async () => {
            try {
                const response = await fetch(`${TSV_URL}&t=${new Date().getTime()}`);
                const text = await response.text();
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");

                if (rows.length > 1) {
                    const row = rows[1];
                    const cols = row.split('\t').map(v => v.trim());

                    const isDataEmpty = cols.every(col => col === "-" || col === "");

                    if (isDataEmpty) {
                        setSlide(null);
                        cachedSlideHomeData = null;
                    } else {
                        const data = {
                            judul: cols[0] || "Untitled Presentation",
                            penulis: cols[1] || "Anonymous",
                            linkPdf: cols[3] || "#"
                        };
                        setSlide(data);
                        cachedSlideHomeData = [data];
                    }
                } else {
                    setSlide(null);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, [TSV_URL]);

    const handleClick = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    if (loading) return (
        <div className="bg-white rounded-[2.5rem] aspect-video flex items-center justify-center border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-slate-900" size={24} />
        </div>
    );

    if (!slide) return null;

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
                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Pembinaan</h3>
                <p className="text-[12px] text-slate-800 font-bold uppercase tracking-widest">Materi Pembinaan Warga Jemaat</p>
            </div>

            <div className="rounded-4xl overflow-hidden aspect-video relative group bg-slate-900 pointer-events-none">
                <div className="w-full h-full relative">
                    <PDFCoverHome url={slide.linkPdf} />
                </div>
            </div>
        </div>
    );
};

export default SlideCardHome;