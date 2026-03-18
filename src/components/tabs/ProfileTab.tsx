// ProfileTab.tsx
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
    return (
        <div className="pb-24 px-4 space-y-4 overflow-y-auto h-full no-scrollbar">
            <HeroCard onSelect={onHeroSelect} />
            <SlideCardHome onNavigate={onNavigateToIbadah} />
            <RenunganCard onSelect={onHeroSelect} />

            <JadwalCard />
            <PendetaCard />
            <FungsionarisCard />
        </div>
    );
};

export default ProfileTab;