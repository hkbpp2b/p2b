// App.tsx
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ProfileTab from './components/tabs/ProfileTab';
import IbadahTab from './components/tabs/IbadahTab';
import GivingTab from './components/tabs/GivingTab';
import OtherTab from './components/tabs/OtherTab';
import AplikasiTab from './components/tabs/AplikasiTab';
import DetailWindow from './components/function/DetailWindow';
import { useMidiPlayer } from './components/function/useMidiPlayer';

const TITLES: Record<string, string> = {
  profil: 'HKBP Perumnas 2 Bekasi',
  warta: 'COMINGSOON',
  ibadah: 'WARTA dan ACARA',
  giving: 'PERSEMBAHAN',
  other: 'LAYANAN'
};

function App() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loadedTabs, setLoadedTabs] = useState<string[]>(['profil']);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const { isPlaying, isLoading, playMidi, stopMidi } = useMidiPlayer();
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);


  useEffect(() => {
    stopMidi();
  }, [activeTab, selectedDetail]);

  useEffect(() => {
    const backgroundQueue = ['giving', 'ibadah', 'warta', 'other'];
    const loadSequentially = async () => {
      for (const tab of backgroundQueue) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoadedTabs(prev => prev.includes(tab) ? prev : [...prev, tab]);
      }
    };

    if (document.readyState === 'complete') loadSequentially();
    else window.addEventListener('load', loadSequentially, { once: true });
  }, []);

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={TITLES[activeTab]}
      detailContent={
        <DetailWindow
          selectedDetail={selectedDetail}
          onBack={() => setSelectedDetail(null)}
          midiControls={{ isPlaying, isLoading, playMidi }}
        />
      }
    >
      <div className="max-w-3xl mx-auto w-full pt-0 h-full flex flex-col">
        {loadedTabs.includes('profil') && (
          <div className={activeTab === 'profil' ? 'h-full block' : 'hidden'}>
            <ProfileTab
              onHeroSelect={setSelectedDetail}
              onNavigateToIbadah={() => {
                setActiveTab('ibadah');
                setShouldScroll(true); // Trigger scroll lewat state
              }}
            />
          </div>
        )}
        {loadedTabs.includes('giving') && (
          <div className={activeTab === 'giving' ? 'block' : 'hidden'}>
            <GivingTab />
          </div>
        )}
        {loadedTabs.includes('ibadah') && (
          <div className={activeTab === 'ibadah' ? 'block' : 'hidden'}>
            <IbadahTab
              onSelectContent={setSelectedDetail}
              scrollToWawasan={shouldScroll}
              onScrollDone={() => setShouldScroll(false)}
            />
          </div>
        )}
        {loadedTabs.includes('warta') && (
          <div className={activeTab === 'warta' ? 'block' : 'hidden'}>
            <AplikasiTab />
          </div>
        )}
        {loadedTabs.includes('other') && (
          <div className={activeTab === 'other' ? 'block' : 'hidden'}>
            <OtherTab onSelectContent={setSelectedDetail} />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;