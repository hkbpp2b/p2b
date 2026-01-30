import { useState } from 'react';
import Layout from './components/Layout';
import ProfileTab from './components/tabs/ProfileTab';
import IbadahTab from './components/tabs/IbadahTab';
import GivingTab from './components/tabs/GivingTab';
import OtherTab from './components/tabs/OtherTab';
import WartaTab from './components/tabs/WartaTab';

function App() {
  const [activeTab, setActiveTab] = useState('profil');

  // Mapping judul berdasarkan ID tab
  const titles: Record<string, string> = {
    profil: 'HKBP P2B',
    warta: 'WARTA JEMAAT',
    ibadah: 'TATA IBADAH',
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