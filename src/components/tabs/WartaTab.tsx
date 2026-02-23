// WartaTab.tsx
import React, { useState, useEffect, useCallback } from 'react';

const WartaTab = () => {
    const [grid, setGrid] = useState<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [topScores, setTopScores] = useState<{ name: string, score: number }[]>([]);
    const [playerName, setPlayerName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('2048_top_scores');
        if (saved) setTopScores(JSON.parse(saved));
    }, []);

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
    }, [addTile]);

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
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
            }

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

    const saveScore = () => {
        if (!playerName.trim()) return;
        const newScores = [...topScores, { name: playerName, score }].sort((a, b) => b.score - a.score).slice(0, 5);
        setTopScores(newScores);
        localStorage.setItem('2048_top_scores', JSON.stringify(newScores));
        setSubmitted(true);
    };

    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center p-6 font-sans select-none overflow-y-auto pb-40">
            <div className="w-full max-w-[280px] mt-[20px] mb-6">
                <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">
                    PAGE COMING <br /> SOON
                </h1>
                <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    This page is under development. <br /> Check back later for full updates.
                </p>
                <div className="mt-6 flex justify-between items-center border-t-2 border-black pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updt_Z12_V4N_14</p>
                    <span className="text-2xl font-black text-black">{score}</span>
                </div>
            </div>

            <div
                className="relative bg-white border-2 border-black p-1 mb-8 touch-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="grid grid-cols-4 gap-1">
                    {grid.map((row, r) => row.map((val, c) => (
                        <div key={`${r}-${c}`} className={`w-[60px] h-[60px] flex items-center justify-center text-lg font-black transition-colors ${val === 0 ? 'bg-slate-50' : 'bg-black text-white'}`}>
                            {val !== 0 ? val : ''}
                        </div>
                    )))}
                </div>

                {gameOver && (
                    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 p-4 text-center">
                        <p className="font-black text-xl uppercase tracking-tighter mb-2 text-black">Game Over</p>
                        {!submitted ? (
                            <div className="w-full">
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    className="w-full border-2 border-black p-2 text-[10px] font-black uppercase outline-none mb-2"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    maxLength={10}
                                />
                                <button onClick={saveScore} className="w-full bg-black text-white py-2 text-[10px] font-black uppercase mb-2">Save Score</button>
                            </div>
                        ) : <p className="text-[10px] font-bold uppercase mb-4 text-slate-400">Score Recorded</p>}
                        <button onClick={initGame} className="px-5 py-2 border-2 border-black text-black font-black text-[10px] uppercase">Retry</button>
                    </div>
                )}
            </div>

            <div className="w-full max-w-[280px]">
                <h3 className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">Top Scorer</h3>
                {topScores.length === 0 ? (
                    <p className="text-[10px] text-slate-300 font-bold uppercase">No records yet</p>
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
    );
};

export default WartaTab;