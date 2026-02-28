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

    const namaFullKitab: Record<string, { TB: string; BT: string }> = {
        "Kej": { TB: "Kejadian", BT: "1 Musa" },
        "Kel": { TB: "Keluaran", BT: "2 Musa" },
        "Ima": { TB: "Imamat", BT: "3 Musa" },
        "Bil": { TB: "Bilangan", BT: "4 Musa" },
        "Ula": { TB: "Ulangan", BT: "5 Musa" },
        "Yos": { TB: "Yosua", BT: "Josua" },
        "Hak": { TB: "Hakim-hakim", BT: "Panguhum" },
        "Rut": { TB: "Rut", BT: "Rut" },
        "1Sa": { TB: "1 Samuel", BT: "1 Samuel" },
        "2Sa": { TB: "2 Samuel", BT: "2 Samuel" },
        "1Ra": { TB: "1 Raja-raja", BT: "1 Raja-raja" },
        "2Ra": { TB: "2 Raja-raja", BT: "2 Raja-raja" },
        "1Ta": { TB: "1 Tawarikh", BT: "1 Kronika" },
        "2Ta": { TB: "2 Tawarikh", BT: "2 Kronika" },
        "Ezr": { TB: "Ezra", BT: "Esra" },
        "Neh": { TB: "Nehemia", BT: "Nehemia" },
        "Est": { TB: "Ester", BT: "Ester" },
        "Ayb": { TB: "Ayub", BT: "Job" },
        "Mzm": { TB: "Mazmur", BT: "Psalmen" },
        "Ams": { TB: "Amsal", BT: "Poda" },
        "Pkh": { TB: "Pengkhotbah", BT: "Parjamita" },
        "Kid": { TB: "Kidung Agung", BT: "Angka Ende" },
        "Yes": { TB: "Yesaya", BT: "Jesaya" },
        "Yer": { TB: "Yeremia", BT: "Jeremia" },
        "Rat": { TB: "Ratapan", BT: "Andung-andung" },
        "Yeh": { TB: "Yehezkiel", BT: "Hesekiel" },
        "Dan": { TB: "Daniel", BT: "Daniel" },
        "Hos": { TB: "Hosea", BT: "Hosea" },
        "Yoel": { TB: "Yoel", BT: "Joel" },
        "Amos": { TB: "Amos", BT: "Amos" },
        "Oba": { TB: "Obaja", BT: "Obaja" },
        "Yun": { TB: "Yunus", BT: "Jona" },
        "Mik": { TB: "Mikha", BT: "Mika" },
        "Nah": { TB: "Nahum", BT: "Nahum" },
        "Hab": { TB: "Habakuk", BT: "Habakuk" },
        "Zef": { TB: "Zefanya", BT: "Sepania" },
        "Hag": { TB: "Hagai", BT: "Haggai" },
        "Zak": { TB: "Zakharia", BT: "Sakaria" },
        "Mal": { TB: "Maleakhi", BT: "Maleaki" },
        "Mat": { TB: "Matius", BT: "Mateus" },
        "Mrk": { TB: "Markus", BT: "Markus" },
        "Luk": { TB: "Lukas", BT: "Lukas" },
        "Yoh": { TB: "Yohanes", BT: "Johannes" },
        "Kis": { TB: "Kisah Para Rasul", BT: "Ulaon ni Apostel" },
        "Rom": { TB: "Roma", BT: "Rom" },
        "1Ko": { TB: "1 Korintus", BT: "1 Korint" },
        "2Ko": { TB: "2 Korintus", BT: "2 Korint" },
        "Gal": { TB: "Galatia", BT: "Galatia" },
        "Efe": { TB: "Efesus", BT: "Epesus" },
        "Flp": { TB: "Filipi", BT: "Pilippi" },
        "Kol": { TB: "Kolose", BT: "Kolosse" },
        "1Te": { TB: "1 Tesalonika", BT: "1 Tessalonik" },
        "2Te": { TB: "2 Tesalonika", BT: "2 Tessalonik" },
        "1Ti": { TB: "1 Timotius", BT: "1 Timoteus" },
        "2Ti": { TB: "2 Timotius", BT: "2 Timoteus" },
        "Tit": { TB: "Titus", BT: "Titus" },
        "Flm": { TB: "Filemon", BT: "Pilemon" },
        "Ibr": { TB: "Ibrani", BT: "Heber" },
        "Yak": { TB: "Yakobus", BT: "Jakobus" },
        "1Pt": { TB: "1 Petrus", BT: "1 Petrus" },
        "2Pt": { TB: "2 Petrus", BT: "2 Petrus" },
        "1Yo": { TB: "1 Yohanes", BT: "1 Johannes" },
        "2Yo": { TB: "2 Yohanes", BT: "2 Johannes" },
        "3Yo": { TB: "3 Yohanes", BT: "3 Johannes" },
        "Yud": { TB: "Yudas", BT: "Judas" },
        "Why": { TB: "Wahyu", BT: "Pangungkapon" }
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

    const getNamaKitab = (key: string) => {
        return namaFullKitab[key] ? namaFullKitab[key][version] : key;
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
                            {getNamaKitab(currentKitab)} {currentPasal}
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
                                    <h3 className="text-[14px] font-bold text-blue-600 uppercase tracking-[0.1em] mb-3 ml-1">
                                        {version === 'TB' ? 'Perjanjian Lama' : 'Padan Na Robi'}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {kitabGrup.pl.map(k => (
                                            <button
                                                key={k}
                                                onClick={() => { setCurrentKitab(k); setSelectorTab('pasal'); }}
                                                className={`p-4 text-left text-[12px] font-bold uppercase border rounded-xl ${currentKitab === k ? 'border-slate-900 text-slate-900' : 'border-slate-100 text-slate-600'}`}
                                            >
                                                {getNamaKitab(k)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-black text-red-600 uppercase tracking-widest mb-3 ml-1">
                                        {version === 'TB' ? 'Perjanjian Baru' : 'Padan Na Imbaru'}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {kitabGrup.pb.map(k => (
                                            <button
                                                key={k}
                                                onClick={() => { setCurrentKitab(k); setSelectorTab('pasal'); }}
                                                className={`p-4 text-left text-[11px] font-bold uppercase border rounded-xl ${currentKitab === k ? 'border-slate-900 text-slate-900' : 'border-slate-100 text-slate-600'}`}
                                            >
                                                {getNamaKitab(k)}
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