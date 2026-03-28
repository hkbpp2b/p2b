// Game2048Card.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Game2048CardProps {
    onBack: () => void;
}

const SHEET_URL = import.meta.env.VITE_2048_URL;
const SALT = import.meta.env.VITE_SALT_URL;

const Game2048Card = ({ onBack }: Game2048CardProps) => {
    const [grid, setGrid] = useState<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [topScores, setTopScores] = useState<{ name: string, score: number }[]>([]);
    const [playerName, setPlayerName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTopScores = useCallback(async () => {
        try {
            const response = await fetch(SHEET_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const text = await response.text();
            if (text.trim().startsWith('<!doctype')) return;
            const data = JSON.parse(text);
            if (Array.isArray(data)) setTopScores(data);
        } catch (error) {
            console.error("Error fetching scores:", error);
        }
    }, []);

    useEffect(() => {
        fetchTopScores();
    }, [fetchTopScores]);

    const addTile = useCallback((board: number[][]) => {
        const emptyTiles = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 0) emptyTiles.push({ r, c });
            }
        }
        if (emptyTiles.length > 0) {
            const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[r][c] = Math.random() > 0.1 ? 2 : 4;
        }
    }, []);

    const initGame = useCallback(() => {
        const board = Array(4).fill(0).map(() => Array(4).fill(0));
        addTile(board);
        addTile(board);
        setGrid(board);
        setScore(0);
        setGameOver(false);
        setSubmitted(false);
        setPlayerName('');
        fetchTopScores();
    }, [addTile, fetchTopScores]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const slide = (row: number[]) => {
        const arr = row.filter(val => val !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                setScore(s => s + arr[i]);
                arr[i + 1] = 0;
            }
        }
        const newRow = arr.filter(val => val !== 0);
        while (newRow.length < 4) newRow.push(0);
        return newRow;
    };

    const move = useCallback((direction: string) => {
        if (gameOver) return;
        setGrid(prevGrid => {
            let board = JSON.parse(JSON.stringify(prevGrid));
            let changed = false;
            if (direction === 'LEFT' || direction === 'RIGHT') {
                for (let i = 0; i < 4; i++) {
                    const oldRow = [...board[i]];
                    const row = direction === 'RIGHT' ? [...board[i]].reverse() : [...board[i]];
                    let newRow = slide(row);
                    if (direction === 'RIGHT') newRow.reverse();
                    board[i] = newRow;
                    if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) changed = true;
                }
            } else {
                for (let c = 0; c < 4; c++) {
                    const column = [board[0][c], board[1][c], board[2][c], board[3][c]];
                    const oldCol = [...column];
                    const row = direction === 'DOWN' ? [...column].reverse() : [...column];
                    let newCol = slide(row);
                    if (direction === 'DOWN') newCol.reverse();
                    for (let r = 0; r < 4; r++) board[r][c] = newCol[r];
                    if (JSON.stringify(oldCol) !== JSON.stringify(newCol)) changed = true;
                }
            }
            if (changed) {
                addTile(board);
                let canMove = false;
                for (let r = 0; r < 4; r++) {
                    for (let c = 0; c < 4; c++) {
                        if (board[r][c] === 0) canMove = true;
                        if (r < 3 && board[r][c] === board[r + 1][c]) canMove = true;
                        if (c < 3 && board[r][c] === board[r][c + 1]) canMove = true;
                    }
                }
                if (!canMove) setGameOver(true);
                return board;
            }
            return prevGrid;
        });
    }, [gameOver, addTile]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
            switch (e.key) {
                case 'ArrowUp': move('UP'); break;
                case 'ArrowDown': move('DOWN'); break;
                case 'ArrowLeft': move('LEFT'); break;
                case 'ArrowRight': move('RIGHT'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    const handleTouchStart = (e: React.TouchEvent) => {
        (window as any).touchStartX = e.touches[0].clientX;
        (window as any).touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - (window as any).touchStartX;
        const dy = e.changedTouches[0].clientY - (window as any).touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
            if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP');
        }
    };

    const saveScore = async () => {
        if (!playerName.trim() || score === 0 || isLoading) return;

        setIsLoading(true);
        const securityToken = btoa(`${playerName}-${score}-${SALT}`);

        try {
            const response = await fetch(SHEET_URL, {
                method: 'POST',
                body: JSON.stringify({ name: playerName, score: score, token: securityToken }),
            });

            const result = await response.json();

            if (result.status === "success") {
                setSubmitted(true);
                setTimeout(() => {
                    fetchTopScores();
                    setIsLoading(false);
                }, 1500);
            } else {
                alert(result.message || "Nama tidak diperbolehkan!");
                setPlayerName('');
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Save error:", error);
            setIsLoading(false);
        }
    };

    const getTileStyle = (val: number) => {
        const styles: { [key: number]: string } = {
            0: 'bg-slate-100/50 text-transparent border-none',
            2: 'bg-sky-400 text-white shadow-sm',
            4: 'bg-emerald-500 text-white shadow-sm',
            8: 'bg-violet-500 text-white shadow-sm',
            16: 'bg-amber-600 text-white shadow-sm',
            32: 'bg-teal-600 text-white shadow-sm',
            64: 'bg-indigo-600 text-white shadow-sm',
            128: 'bg-lime-600 text-white shadow-sm',
            256: 'bg-fuchsia-600 text-white shadow-sm',
            512: 'bg-cyan-700 text-white shadow-sm',
            1024: 'bg-orange-700 text-white shadow-sm',
            2048: 'bg-slate-900 text-white shadow-xl',
        };

        return styles[val] || 'bg-slate-800 text-white';
    };

    return (
        <div className="fixed  lg:absolute inset-0 z-[60] flex flex-col">
            <header className="flex-none  px-4 h-14 flex items-center justify-between">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
                    <ArrowLeft size={20} />
                </button>
            </header>
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center p-6 select-none">
                <div className="w-full max-w-[280px] mb-6">
                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">2048</h1>
                    <div className="mt-6 flex justify-between items-center border-t-2 border-black pt-2">
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Skor</p>
                        <span className="text-2xl font-black text-black">{score}</span>
                    </div>
                </div>
                <div className="relative border-2 border-black p-1 mb-8 touch-none flex-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <div className="grid grid-cols-4 gap-1">
                        {grid.map((row, r) => row.map((val, c) => (
                            <div
                                key={`${r}-${c}`}
                                className={`w-[60px] h-[60px] flex items-center justify-center text-lg font-black transition-all duration-100 ${val !== 0 ? 'scale-95' : ''} ${getTileStyle(val)}`}
                            >
                                {val !== 0 ? val : ''}
                            </div>
                        )))}
                    </div>
                    {gameOver && (
                        <div className="absolute bg-white inset-0 flex flex-col items-center justify-center z-50 p-4 text-center">
                            <p className="font-black text-xl uppercase tracking-tighter  mb-2 text-black">Game Over</p>
                            {!submitted ? (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Nama"
                                        className="w-full border-2 border-black p-2 text-[10px] font-black uppercase outline-none mb-2 focus:bg-slate-50"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        maxLength={10}
                                    />
                                    <button onClick={saveScore} disabled={isLoading} className="w-full bg-black text-white py-2 text-[10px] font-black uppercase mb-2 active:scale-95 transition-transform disabled:opacity-50">
                                        {isLoading ? 'Checking...' : 'Simpan'}
                                    </button>
                                </div>
                            ) : <p className="text-[10px] font-bold uppercase mb-4 text-blue-600">Skor disimpan!</p>}
                            <button onClick={initGame} className="w-full px-5 py-2 border-2 border-black text-black font-black text-[10px] uppercase active:bg-black active:text-white transition-colors">Coba Lagi</button>
                        </div>
                    )}
                </div>
                <div className="w-full max-w-[280px] pb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">Peringkat</h3>
                    {topScores.length === 0 ? (
                        <p className="text-[10px] text-slate-300 font-bold uppercase italic">...</p>
                    ) : (
                        topScores.map((s, i) => (
                            <div key={i} className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black uppercase">{i + 1}. {s.name}</span>
                                <span className="text-[10px] font-mono font-bold text-slate-400">{s.score}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game2048Card;