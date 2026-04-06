// IbadahTab.tsx
import { useRef, useEffect } from 'react';
import SlideCard from '../cards/SlideCard';
import WartaCard from '../cards/WartaCard';

interface IbadahTabProps {
    onSelectContent?: (content: any) => void;
    scrollToWawasan?: boolean;
    onScrollDone?: () => void;
}

const IbadahTab = ({ onSelectContent, scrollToWawasan, onScrollDone }: IbadahTabProps) => {
    const wawasanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollToWawasan) {

            const timer = setTimeout(() => {
                wawasanRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                onScrollDone?.();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [scrollToWawasan, onScrollDone]);



    return (
        <div className=" pb-32 pt-8 px-5 space-y-30">
            <WartaCard onSelectContent={onSelectContent} />
            <div ref={wawasanRef}>
                <SlideCard onSelectContent={onSelectContent} />
            </div>
        </div>
    );
};

export default IbadahTab;