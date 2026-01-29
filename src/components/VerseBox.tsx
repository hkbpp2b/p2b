import React from 'react';

interface VerseBoxProps {
    verse: string;
    reference: string;
}

const VerseBox = ({ verse, reference }: VerseBoxProps) => {
    return (
        <div className="mx-2 p-8 bg-slate-50 rounded-[3rem] border border-slate-100 mt-4 mb-8">
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed text-center italic">
                "{verse}" <br />
                <span className="not-italic font-black mt-2 block text-slate-800 tracking-tighter uppercase">— {reference}</span>
            </p>
        </div>
    );
};

export default VerseBox;