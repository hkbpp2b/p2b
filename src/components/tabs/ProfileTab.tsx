// ProfileTab.tsx
import React from 'react';
import HeroCard from '../cards/HeroCard';
import RenunganCard from '../cards/RenunganCard';
import JadwalCard from '../cards/JadwalCard';
import PendetaCard from '../cards/PendetaCard';
import FungsionarisCard from '../cards/FungsionarisCard';

interface ProfileTabProps {
    onHeroSelect: (data: any) => void;
}

const ProfileTab = ({ onHeroSelect }: ProfileTabProps) => {
    return (
        <div className="animate-in fade-in duration-500 pb-24 px-4 space-y-4 bg-slate-50 overflow-y-auto h-full no-scrollbar">
            <HeroCard onSelect={onHeroSelect} />
            <RenunganCard onSelect={onHeroSelect} />
            <JadwalCard />
            <PendetaCard />
            <FungsionarisCard />
        </div>
    );
};

export default ProfileTab;