// QuizAlkitabCard.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Heart, RefreshCw, BookOpen, Trophy } from 'lucide-react';
import alkitabData from '../../assets/tb.json';

interface Ayat {
    ayat: number;
    firman: string;
}

interface Pasal {
    pasal: number;
    ayats: Ayat[];
}

interface Kitab {
    kitab: string;
    pasals: Pasal[];
}

interface Question {
    question: string;
    options: string[];
    answer: number;
    reference: string;
}

interface TopScore {
    name: string;
    score: number;
}

interface QuizAlkitabCardProps {
    onBack: () => void;
}

const SHEET_URL = import.meta.env.VITE_2048_URL;
const SALT = import.meta.env.VITE_SALT_URL;

const QuizAlkitabCard = ({ onBack }: QuizAlkitabCardProps) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizOver, setQuizOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [topScores, setTopScores] = useState<TopScore[]>([]);
    const [playerName, setPlayerName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const keywords = useMemo(() => ({
        PEOPLE: [
            "Paulus", "Yesus", "Sostenes", "Krispus", "Gayus", "Apolos", "Kefas", "Stefanus",
            "Timotius", "Silas", "Barnabas", "Lukas", "Markus", "Matius", "Yohanes", "Petrus",
            "Andreas", "Filipus", "Bartolomeus", "Tomas", "Yakobus", "Yudas", "Lazarus",
            "Maria", "Marta", "Nikodemus", "Zakeus", "Pilatus", "Herodes", "Agripa", "Kornelius",
            "Lidia", "Priskila", "Akwila", "Titus", "Filemon", "Ananias", "Safira", "Tabita",
            "Malkhus", "Simeon", "Elisabet", "Zakharia", "Gamaliel", "Kandake", "Tomas",
            "Bartimeus", "Yairus", "Malchus", "Klefopas", "Lois", "Eunike", "Stefanus",
            "Adam", "Hawa", "Kain", "Habel", "Nuh", "Abraham", "Ishak", "Yakub", "Yusuf",
            "Musa", "Harun", "Yosua", "Gideon", "Simson", "Samuel", "Saul", "Daud", "Salomo",
            "Elia", "Eliab", "Elisa", "Yesaya", "Yeremia", "Yehezkiel", "Daniel", "Yunus", "Ayub",
            "Boas", "Rut", "Ester", "Mordekhai", "Nehemia", "Ezra", "Metusalah", "Enokh",
            "Melkhisedek", "Ismael", "Labu", "Lea", "Rahel", "Dina", "Potifar", "Miryam",
            "Debora", "Barak", "Delila", "Goliat", "Absalom", "Ratu Syeba", "Nebukadnezar",
            "Belsyazar", "Koresh", "Artahsasta", "Darius", "Ahab", "Izebel", "Obaja",
            "Hosea", "Yoel", "Amos", "Mikha", "Nahum", "Habakuk", "Zefanya", "Hagai",
            "Zakharia", "Maleakhi", "Lamekh", "Terah", "Lot", "Sarai", "Ribka",
            "Bileam", "Balak", "Rahab", "Otniel", "Ehud", "Yefta", "Eli", "Elihoref", "Yonatan",
            "Natan", "Batsyeba", "Rehabeam", "Yerobeam", "Hizkia", "Yosia", "Manasye"
        ],
        PLACES: [
            "Korintus", "Yerusalem", "Mesir", "Galilea", "Betlehem", "Nazaret", "Yordan",
            "Efesus", "Roma", "Filipi", "Tesalonika", "Antiohia", "Atena", "Siprus", "Galatia",
            "Kolose", "Babel", "Sodom", "Gomora", "Kanaan", "Sinai", "Yudea", "Samaria",
            "Damaskus", "Tarsus", "Yope", "Kaisarea", "Mekhedonia", "Krete", "Patmos",
            "Asyur", "Persia", "Media", "Edom", "Moab", "Ammon", "Filistin", "Libanon",
            "Sikhem", "Silo", "Ramot-Gilead", "Gaza", "Gazam", "Askelon", "Asdod", "Ekron", "Gat",
            "Golgota", "Getsemani", "Betania", "Hebron", "Betel", "Yerikho", "Ninive",
            "Tirus", "Sidon", "Karmel", "Horeb", "Hermon", "Efrat", "Ararat", "Moria",
            "Pisga", "Tabor", "Zaitun", "Khenisaret", "Laut Teberau", "Laut Mati",
            "Emmaus", "Lida", "Troas", "Miletus", "Bereia", "Derbe", "Listra", "Ikonium",
            "Ur Kasdim", "Arnon", "Yabok", "Basan", "Gilead", "Midian", "Kadesh",
            "Marah", "Elim", "Rafidim", "Nebanya", "Sion", "Lembah Hinom", "Lembah Kidron"
        ],
        OBJECTS: [
            "Bahtera", "Tabut", "Manna", "Gada", "Mezbah", "Kemah Suci", "Bait Allah",
            "Kemenyan", "Mur", "Dinar", "Talenta", "Syamadan", "Kecapi", "Sangkakala",
            "Pelita", "Gandum", "Anggur", "Minyak Urapan", "Roti", "Jala", "Perahu",
            "Mahkota Duri", "Salib", "Kain Kafan", "Batu Putih", "Gulungan Kitab",
            "Zirah", "Pedang Roh", "Ketopong", "Perisai Iman", "Kasut", "Ikat Pinggang",
            "Buli-buli", "Mezbah Pembakaran Ukupan", "Tutup Pendamaian", "Urim", "Tumim",
            "Efod", "Jubah", "Tongkat Harun", "Bulu Domba", "Umban", "Kandil"
        ]
    }), []);

    const fetchTopScores = useCallback(async () => {
        if (!SHEET_URL) return;
        try {
            const response = await fetch(`${SHEET_URL}?type=quiz`);
            const text = await response.text();
            if (text.trim().startsWith('<!doctype')) return;
            const data = JSON.parse(text);
            if (Array.isArray(data)) setTopScores(data);
        } catch (error) {
            console.error("Error fetching scores:", error);
        }
    }, []);

    const generateFromLocal = useCallback(() => {
        setIsLoading(true);
        setSubmitted(false);
        setPlayerName('');
        setLives(5);
        setScore(0);
        setCurrentIndex(0);
        setQuizOver(false);

        const allGenerated: Question[] = [];
        const data = alkitabData as Kitab[];

        const kitabMapping: { [key: string]: { TB: string, BT: string } } = {
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
            "Yoe": { TB: "Yoel", BT: "Joel" },
            "Amo": { TB: "Amos", BT: "Amos" },
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

        const flatVerses: { text: string; ref: string }[] = [];
        data.forEach(k => {
            const namaKitabLengkap = kitabMapping[k.kitab]?.TB || k.kitab;
            k.pasals.forEach(p => {
                p.ayats.forEach(a => {
                    flatVerses.push({
                        text: a.firman,
                        ref: `${namaKitabLengkap} ${p.pasal}:${a.ayat}`
                    });
                });
            });
        });

        const shuffledVerses = flatVerses.sort(() => 0.5 - Math.random());

        for (const v of shuffledVerses) {
            if (allGenerated.length >= 50) break;

            let target: string | null = null;
            let type: 'PEOPLE' | 'PLACES' | 'OBJECTS' = 'PEOPLE';

            for (const p of keywords.PEOPLE) {
                if (v.text.includes(p)) { target = p; type = 'PEOPLE'; break; }
            }
            if (!target) {
                for (const l of keywords.PLACES) {
                    if (v.text.includes(l)) { target = l; type = 'PLACES'; break; }
                }
            }
            if (!target && keywords.OBJECTS) {
                for (const o of keywords.OBJECTS) {
                    if (v.text.includes(o)) { target = o; type = 'OBJECTS'; break; }
                }
            }

            if (target && v.text.length > 30) {
                const questionText = v.text.replace(new RegExp(target, 'g'), "____");
                const pool = keywords[type].filter(item => item !== target);
                const distractors = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
                const options = [...distractors, target].sort(() => 0.5 - Math.random());

                allGenerated.push({
                    question: questionText,
                    options: options,
                    answer: options.indexOf(target),
                    reference: v.ref
                });
            }
        }

        setQuestions(allGenerated);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsLoading(false);
        fetchTopScores();
    }, [keywords, fetchTopScores]);

    useEffect(() => {
        generateFromLocal();
    }, [generateFromLocal]);

    const saveScore = async () => {
        if (!playerName.trim() || score === 0 || isSaving || !SHEET_URL) return;
        setIsSaving(true);
        const securityToken = btoa(`${playerName}-${score}-${SALT}`);
        try {
            const response = await fetch(SHEET_URL, {
                method: 'POST',
                body: JSON.stringify({ name: playerName, score: score, token: securityToken, type: 'quiz' }),
            });
            const result = await response.json();
            if (result.status === "success") {
                setSubmitted(true);
                setTimeout(() => {
                    fetchTopScores();
                    setIsSaving(false);
                }, 1500);
            } else {
                alert(result.message || "Gagal menyimpan skor.");
                setIsSaving(false);
            }
        } catch (error) {
            console.error("Save error:", error);
            setIsSaving(false);
        }
    };

    const handleAnswer = (index: number) => {
        if (isAnswered || quizOver) return;
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === questions[currentIndex].answer) {
            setScore(s => s + 10);
        } else {
            const newLives = lives - 1;
            setLives(newLives);
            if (newLives <= 0) {
                setTimeout(() => setQuizOver(true), 1500);
            }
        }
    };

    const nextQuestion = () => {
        if (lives <= 0) {
            setQuizOver(true);
            return;
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setQuizOver(true);
        }
    };

    if (isLoading) return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6">
            <RefreshCw className="animate-spin mb-4 text-black" size={32} />
            <p className="font-black uppercase tracking-widest text-[10px]">Menyiapkan Ujian Alkitab...</p>
        </div>
    );

    const currentQ = questions[currentIndex];

    return (
        <div className="fixed lg:absolute inset-0 z-[999] bg-white flex flex-col overflow-hidden ">
            <header className="relative flex-none px-4 h-14 flex items-center justify-between">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full z-10">
                    <ArrowLeft size={20} />
                </button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-[12px] font-black uppercase tracking-[0.1em] leading-none">Skor: {score}</p>
                </div>
                <div className="w-9" />
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar px-10 flex flex-col items-center">
                {!quizOver ? (
                    <div className="w-full max-w-[340px] flex flex-col">
                        <div className="mb-4 text-center">
                            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-3">Kuis Alkitab</h1>

                            {/* Indikator Nyawa di bawah Judul */}
                            <div className="flex justify-center gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Heart
                                        key={i}
                                        size={16}
                                        fill={i < lives ? "#ef4444" : "none"}
                                        color={i < lives ? "#ef4444" : "#e2e8f0"}
                                        className={`${i < lives ? "" : ""} transition-all duration-500`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 border-2 border-black p-5 mb-6 relative">
                            <p className="text-[14px] font-bold leading-relaxed text-slate-800">
                                "{currentQ?.question}"
                            </p>
                        </div>

                        <div className="grid gap-2">
                            {currentQ?.options.map((opt, i) => {
                                const isCorrect = i === currentQ.answer;
                                const isSelected = i === selectedOption;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        disabled={isAnswered}
                                        className={`w-full p-4 border-2 text-left transition-all font-black uppercase text-[10px] tracking-wider
                                    ${!isAnswered ? 'border-black hover:bg-black hover:text-white' :
                                                isCorrect ? 'bg-emerald-500 text-white border-black' :
                                                    isSelected ? 'bg-red-500 border-black text-white animate-shake' : 'border-slate-100 opacity-40'}
                                `}
                                    >
                                        {String.fromCharCode(65 + i)}. {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && lives > 0 && (
                            <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <p className="text-[10px] text-center font-extrabold text-slate-900 tracking-widest border-t-2 py-4 ">(TB) {currentQ.reference}</p>
                                </div>
                                <button onClick={nextQuestion} className="w-full bg-black text-white py-4 font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-slate-800 mb-20">
                                    Lanjut
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-[340px] flex flex-col items-center">
                        <div className="w-full border-[4px] border-black p-8 text-center bg-white mb-10">
                            <p className="text-[12px] font-black uppercase tracking-[0.3em] mb-2">Skor </p>
                            <h2 className="text-8xl font-black mb-8 tracking-tighter">{score}</h2>

                            {!submitted ? (
                                <div className="space-y-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Nama Anda"
                                        className="w-full border-2 border-black p-3 text-[10px] font-black uppercase outline-none focus:bg-slate-50"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        maxLength={10}
                                    />
                                    <button onClick={saveScore} disabled={isSaving || !playerName.trim()} className="w-full bg-black text-white py-4 text-[10px] font-black uppercase disabled:opacity-50 transition-opacity">
                                        {isSaving ? 'Menyimpan...' : 'Simpan Skor'}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-black text-white p-3 mb-4">
                                    <p className="text-[10px] font-bold uppercase">Skor Berhasil Masuk!</p>
                                </div>
                            )}

                            <button onClick={generateFromLocal} className="w-full bg-white border-2 border-black py-4 font-black uppercase text-[10px] hover:bg-slate-50">Coba Lagi</button>
                        </div>

                        <div className="w-full px-2 mb-20">
                            <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                                <Trophy size={16} />
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Peringkat</h3>
                            </div>
                            <div className="space-y-2">
                                {topScores.length === 0 ? (
                                    <p className="text-[10px] text-slate-300 font-bold uppercase italic">Memuat peringkat...</p>
                                ) : (
                                    topScores.slice(0, 10).map((s, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <span className="text-[10px] font-black uppercase">{i + 1}. {s.name}</span>
                                            <div className="flex-1 border-b border-dotted border-slate-200 mx-2 mb-1" />
                                            <span className="text-[10px] font-mono font-bold text-black">{s.score}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizAlkitabCard;