import React from 'react';
import { Construction, FileText, Lock } from 'lucide-react';

const WartaTab = () => {
    return (
        <div className="pb-20 pt-8 px-5 max-w-md mx-auto">
            {/* Header */}
            <header className="text-center mb-10 space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Coming Soon
                </h2>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Build Version #az-12v41n
                </p>
            </header>

            {/* Kartu Statis Coming Soon */}
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">

                {/* Ikon Box */}
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-8">
                    <Construction className="text-white" size={28} />
                </div>

                <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Status: Maintenance
                        </p>
                    </div>

                    <h3 className="text-[24px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                        Fitur Sedang <br />Disiapkan
                    </h3>

                    <p className="text-[14px] font-bold text-slate-500 leading-relaxed">
                        tim mulmed sedang berpikir keras untuk menambahkan fitur baru ini.
                    </p>
                </div>

                {/* Garis Dekoratif (Skeleton) - Statis */}
                <div className="mt-10 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl shrink-0 flex items-center justify-center">
                            <FileText size={18} className="text-slate-200" />
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl shrink-0 flex items-center justify-center">
                            <Lock size={18} className="text-slate-200" />
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full w-2/3" />
                    </div>
                </div>


            </div>


        </div>
    );
};

export default WartaTab;