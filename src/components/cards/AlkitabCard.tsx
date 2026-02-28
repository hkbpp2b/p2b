// AlkitabCard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, } from 'lucide-react';

interface AlkitabVerse {
    id: number;
    kitab: string;
    pasal: number;
    ayat: number;
    firman: string;
}

interface AlkitabCardProps {
    onBack: () => void;
}

const AlkitabCard = ({ onBack }: AlkitabCardProps) => {
    const [version, setVersion] = useState<'TB' | 'BT'>('TB');
    const [isVersionOpen, setIsVersionOpen] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectorTab, setSelectorTab] = useState<'kitab' | 'pasal' | 'ayat'>('kitab');

    const [alkitabData, setAlkitabData] = useState<AlkitabVerse[]>([]);
    const [currentKitab, setCurrentKitab] = useState('Kej');
    const [currentPasal, setCurrentPasal] = useState(1);
    const [loading, setLoading] = useState(true);


    const namaFullKitab: Record<string, string> = {
        "Kej": "Kejadian", "Kel": "Keluaran", "Ima": "Imamat", "Bil": "Bilangan", "Ula": "Ulangan",
        "Yos": "Yosua", "Hak": "Hakim-hakim", "Rut": "Rut", "1Sa": "1 Samuel", "2Sa": "2 Samuel",
        "1Ra": "1 Raja-raja", "2Ra": "2 Raja-raja", "1Ta": "1 Tawarikh", "2Ta": "2 Tawarikh",
        "Ezr": "Ezra", "Neh": "Nehemia", "Est": "Ester", "Ayb": "Ayub", "Mzm": "Mazmur",
        "Ams": "Amsal", "Pkh": "Pengkhotbah", "Kid": "Kidung Agung", "Yes": "Yesaya", "Yer": "Yeremia",
        "Rat": "Ratapan", "Yeh": "Yehezkiel", "Dan": "Daniel", "Hos": "Hosea", "Yoel": "Yoel",
        "Amos": "Amos", "Oba": "Obaja", "Yun": "Yunus", "Mik": "Mikha", "Nah": "Nahum",
        "Hab": "Habakuk", "Zef": "Zefanya", "Hag": "Hagai", "Zak": "Zakharia", "Mal": "Maleakhi",
        "Mat": "Matius", "Mrk": "Markus", "Luk": "Lukas", "Yoh": "Yohanes", "Kis": "Kisah Para Rasul",
        "Rom": "Roma", "1Ko": "1 Korintus", "2Ko": "2 Korintus", "Gal": "Galatia", "Efe": "Efesus",
        "Flp": "Filipi", "Kol": "Kolose", "1Te": "1 Tesalonika", "2Te": "2 Tesalonika",
        "1Ti": "1 Timotius", "2Ti": "2 Timotius", "Tit": "Titus", "Flm": "Filemon", "Ibr": "Ibrani",
        "Yak": "Yakobus", "1Pt": "1 Petrus", "2Pt": "2 Petrus", "1Yo": "1 Yohanes", "2Yo": "2 Yohanes",
        "3Yo": "3 Yohanes", "Yud": "Yudas", "Why": "Wahyu"
    };

    const daftarPL = [
        "Kej", "Kel", "Ima", "Bil", "Ula", "Yos", "Hak", "Rut", "1Sa", "2Sa",
        "1Ra", "2Ra", "1Ta", "2Ta", "Ezr", "Neh", "Est", "Ayb", "Mzm",
        "Ams", "Pkh", "Kid", "Yes", "Yer", "Rat", "Yeh", "Dan", "Hos", "Yoel",
        "Amos", "Oba", "Yun", "Mik", "Nah", "Hab", "Zef", "Hag", "Zak", "Mal"
    ];

    const daftarPB = [
        "Mat", "Mrk", "Luk", "Yoh", "Kis", "Rom", "1Ko", "2Ko", "Gal", "Efe",
        "Flp", "Kol", "1Te", "2Te", "1Ti", "2Ti", "Tit", "Flm", "Ibr",
        "Yak", "1Pt", "2Pt", "1Yo", "2Yo", "3Yo", "Yud", "Why"
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const fileName = version === 'TB' ? 'tb.csv' : 'bt.csv';
                const response = await fetch(`/${fileName}`);
                const rawData = await response.text();
                const lines = rawData.split(/\r?\n/);
                const parsed: AlkitabVerse[] = [];

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    const match = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
                    if (match && match.length >= 5) {
                        parsed.push({
                            id: parseInt(match[0]),
                            kitab: match[1],
                            pasal: parseInt(match[2]),
                            ayat: parseInt(match[3]),
                            firman: match[4].replace(/^"|"$/g, '').replace(/""/g, '"')
                        });
                    }
                }
                setAlkitabData(parsed);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        loadData();
    }, [version]);

    const versesInPasal = useMemo(() => {
        return alkitabData.filter(v => v.kitab === currentKitab && v.pasal === currentPasal);
    }, [alkitabData, currentKitab, currentPasal]);

    const kitabGrup = useMemo(() => {
        const unik = Array.from(new Set(alkitabData.map(v => v.kitab)));
        return {
            pl: unik.filter(k => daftarPL.includes(k)),
            pb: unik.filter(k => daftarPB.includes(k))
        };
    }, [alkitabData]);

    const listPasal = useMemo(() => {
        const pasals = alkitabData.filter(v => v.kitab === currentKitab).map(v => v.pasal);
        return Array.from(new Set(pasals));
    }, [alkitabData, currentKitab]);

    const scrollToAyat = (ayatNum: number) => {
        setIsSelectorOpen(false);
        setTimeout(() => {
            const element = document.getElementById(`ayat-${ayatNum}`);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };


    return (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col overflow-hidden">
            <header className="flex-none bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between">
                <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-1">
                    <button disabled={currentPasal <= 1} onClick={() => setCurrentPasal(p => p - 1)} className="p-1 text-slate-300 disabled:opacity-20">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => { setSelectorTab('kitab'); setIsSelectorOpen(true); }} className="px-3 py-1 flex items-center gap-1">
                        <span className="text-base font-bold text-slate-900">
                            {namaFullKitab[currentKitab] || currentKitab} {currentPasal}
                        </span>
                    </button>
                    <button onClick={() => setCurrentPasal(p => p + 1)} className="p-1 text-slate-300">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="relative">
                    <button onClick={() => setIsVersionOpen(!isVersionOpen)} className="text-[10px] font-black border px-2 py-0.5 rounded text-slate-700">{version}</button>
                    {isVersionOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[70]">
                            {['TB', 'BT'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => {
                                        if (v !== version) {
                                            setVersion(v as any);
                                            setLoading(true);
                                        }
                                        setIsVersionOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-[11px] font-bold uppercase ${version === v ? 'text-slate-900 bg-slate-50' : 'text-slate-900 hover:bg-slate-50'}`}
                                >
                                    {v === 'TB' ? 'Terjemahan Baru' : 'Batak Toba'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loading ? <div className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-widest">Memuat...</div> :
                    <>
                        {versesInPasal.map((v) => (
                            <div key={v.id} id={`ayat-${v.ayat}`} className="relative pl-6">
                                <span className="absolute left-0 top-1.5 text-[10px] font-bold text-slate-400">{v.ayat}</span>
                                <p className="text-[17px] leading-[1.8] font-serif text-slate-900">{v.firman}</p>
                            </div>
                        ))}
                        <div className="h-40" />
                    </>
                }
            </div>

            {isSelectorOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <header className="h-14 border-b border-slate-100 flex items-center justify-between px-4 flex-none">
                        <button onClick={() => setIsSelectorOpen(false)} className="p-2 -ml-2 text-slate-600">
                            <ArrowLeft size={20} />
                        </button>

                        <div className="flex gap-8">
                            {['kitab', 'pasal', 'ayat'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectorTab(tab as any)}
                                    className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 ${selectorTab === tab ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <button onClick={() => setIsVersionOpen(!isVersionOpen)} className="text-[10px] font-black border px-2 py-0.5 rounded text-slate-700">{version}</button>
                            {isVersionOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[110]">
                                    {['TB', 'BT'].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => {
                                                if (v !== version) {
                                                    setVersion(v as any);
                                                    setLoading(true);
                                                }
                                                setIsVersionOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-[11px] font-bold uppercase ${version === v ? 'text-slate-900 bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {v === 'TB' ? 'Terjemahan Baru' : 'Batak Toba'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4">
                        {selectorTab === 'kitab' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[14px] font-bold text-blue-600 uppercase tracking-[0.1em] mb-3 ml-1">Perjanjian Lama</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {kitabGrup.pl.map(k => (
                                            <button
                                                key={k}
                                                onClick={() => { setCurrentKitab(k); setSelectorTab('pasal'); }}
                                                className={`p-4 text-left text-[12px] font-bold uppercase border rounded-xl ${currentKitab === k ? 'border-slate-900 text-slate-900' : 'border-slate-100 text-slate-600'}`}
                                            >
                                                {namaFullKitab[k] || k}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-black text-red-600 uppercase tracking-widest mb-3 ml-1">Perjanjian Baru</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {kitabGrup.pb.map(k => (
                                            <button
                                                key={k}
                                                onClick={() => { setCurrentKitab(k); setSelectorTab('pasal'); }}
                                                className={`p-4 text-left text-[11px] font-bold uppercase border rounded-xl ${currentKitab === k ? 'border-slate-900 text-slate-900' : 'border-slate-100 text-slate-600'}`}
                                            >
                                                {namaFullKitab[k] || k}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-30" />
                            </div>
                        )}

                        {selectorTab === 'pasal' && (
                            <div className="grid grid-cols-5 gap-2">
                                {listPasal.map(p => (
                                    <button key={p} onClick={() => { setCurrentPasal(p); setSelectorTab('ayat'); }} className={`p-4 text-sm font-bold border rounded-xl ${currentPasal === p ? 'border-slate-900 text-slate-900' : 'border-slate-100 text-slate-600'}`}>{p}</button>
                                ))}
                                <div className="col-span-5 h-30" />
                            </div>
                        )}

                        {selectorTab === 'ayat' && (
                            <div className="grid grid-cols-5 gap-2">
                                {versesInPasal.map(v => (
                                    <button key={v.ayat} onClick={() => scrollToAyat(v.ayat)} className="p-4 text-sm font-bold border border-slate-100 rounded-xl text-slate-600">{v.ayat}</button>
                                ))}
                                <div className="col-span-5 h-30" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlkitabCard;