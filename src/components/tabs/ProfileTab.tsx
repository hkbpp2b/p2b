// ProfileTab.tsx
import React, { useState, useEffect } from 'react';
import HeroCard from '../cards/HeroCard';
import RenunganCard from '../cards/RenunganCard';
import JadwalCard from '../cards/JadwalCard';
import PendetaCard from '../cards/PendetaCard';
import FungsionarisCard from '../cards/FungsionarisCard';
import SlideCardHome from '../cards/SlideCardHome';

interface ProfileTabProps {
    onHeroSelect: (data: any) => void;
    onNavigateToIbadah: () => void;
}

const ProfileTab = ({ onHeroSelect, onNavigateToIbadah }: ProfileTabProps) => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkRes = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    return (
        <div className="pb-24 px-4 space-y-4 overflow-y-auto h-full no-scrollbar">
            <HeroCard onSelect={onHeroSelect} />
            <SlideCardHome onNavigate={onNavigateToIbadah} />
            <RenunganCard onSelect={onHeroSelect} />

            <JadwalCard
                isDesktop={isDesktop}
                onSelectDetail={onHeroSelect}
            />

            <PendetaCard />
            <FungsionarisCard />
        </div>
    );
};

export default ProfileTab;