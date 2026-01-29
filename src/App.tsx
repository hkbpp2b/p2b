import { useState } from 'react';
import Layout from './components/Layout';
import ProfileTab from './components/ProfileTab';
import IbadahTab from './components/IbadahTab';
import GivingTab from './components/GivingTab';
import OtherTab from './components/OtherTab';
import WartaTab from './components/WartaTab';

function App() {
  const [activeTab, setActiveTab] = useState('profil');

  // Mapping judul berdasarkan ID tab
  const titles: Record<string, string> = {
    profil: 'PROFIL',
    warta: 'WARTA',
    ibadah: 'IBADAH',
    giving: 'PERSEMBAHAN',
    other: 'LAINNYA'
  };

  return (
    // Kirim prop baru 'title' ke Layout
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={titles[activeTab]}
    >
      <div className="max-w-3xl mx-auto w-full pt-0">
        <div className="w-full">
          {activeTab === 'profil' && <ProfileTab />}
          {activeTab === 'warta' && <WartaTab />}
          {activeTab === 'ibadah' && <IbadahTab />}
          {activeTab === 'giving' && <GivingTab />}
          {activeTab === 'other' && <OtherTab />}
        </div>
      </div>
    </Layout>
  );
}

export default App;