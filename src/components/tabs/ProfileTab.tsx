import HeroCard from '../cards/HeroCard';
import RenunganCard from '../cards/RenunganCard';
import JadwalCard from '../cards/JadwalCard';
import PendetaCard from '../cards/PendetaCard';

const ProfileTab = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-24 px-4 space-y-4 bg-slate-50 overflow-y-auto h-full no-scrollbar">

            <HeroCard />
            <RenunganCard />
            <JadwalCard />
            <PendetaCard />

        </div>
    );
};

export default ProfileTab;