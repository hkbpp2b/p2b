// App.tsx
import { useState, useEffect } from 'react';
import { Home, BookOpen, Heart, MessageSquare, Grid } from 'lucide-react';
import Layout from './components/Layout';
import ProfileTab from './components/tabs/ProfileTab';
import IbadahTab from './components/tabs/IbadahTab';
import GivingTab from './components/tabs/GivingTab';
import OtherTab from './components/tabs/OtherTab';
import AplikasiTab from './components/tabs/AplikasiTab';

function App() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loadedTabs, setLoadedTabs] = useState<string[]>(['profil']);

  const titles: Record<string, string> = {
    profil: 'HKBP P2B',
    warta: 'COMINGSOON',
    ibadah: 'WARTA dan ACARA',
    giving: 'PERSEMBAHAN',
    other: 'LAINNYA'
  };

  const menus = [
    { id: 'profil', label: 'Home', icon: <Home /> },
    { id: 'giving', label: 'Giving', icon: <Heart /> },
    { id: 'ibadah', label: 'Ibadah', icon: <BookOpen /> },
    { id: 'warta', label: 'Warta', icon: <MessageSquare /> },
    { id: 'other', label: 'Lainnya', icon: <Grid /> }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const backgroundQueue = ['giving', 'ibadah', 'warta', 'other'];
    const loadSequentially = async () => {
      // Tunggu 2 detik setelah Home muncul agar user lancar baca Home dulu
      await new Promise(resolve => setTimeout(resolve, 2000));

      for (const tab of backgroundQueue) {
        setLoadedTabs(prev => prev.includes(tab) ? prev : [...prev, tab]);
        // Delay antar tab agar browser tidak hang saat load PDF/Gambar di bg
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };
    loadSequentially();
  }, []);

  const renderTab = (id: string, Component: React.ComponentType) => {
    if (!loadedTabs.includes(id)) return null;
    return (
      <div className={activeTab === id ? 'block' : 'hidden'}>
        <Component />
      </div>
    );
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={titles[activeTab]}
      menus={menus}
    >
      <div className="max-w-3xl mx-auto w-full pt-0">
        <div className="w-full">
          {renderTab('profil', ProfileTab)}
          {renderTab('giving', GivingTab)}
          {renderTab('ibadah', IbadahTab)}
          {renderTab('warta', AplikasiTab)}
          {renderTab('other', OtherTab)}
        </div>
      </div>
    </Layout>
  );
}

export default App;