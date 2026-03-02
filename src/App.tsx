// App.tsx
import { useState, useEffect } from 'react';
import { Home, X, Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import ProfileTab from './components/tabs/ProfileTab';
import IbadahTab from './components/tabs/IbadahTab';
import GivingTab from './components/tabs/GivingTab';
import OtherTab from './components/tabs/OtherTab';
import AplikasiTab from './components/tabs/AplikasiTab';
import DataJemaatForm from './components/cards/DataJemaatForm';
import DoaForm from './components/cards/DoaForm';
import SaranForm from './components/cards/SaranForm';
import KonselingForm from './components/cards/KonselingForm';

function App() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loadedTabs, setLoadedTabs] = useState<string[]>(['profil']);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const titles: Record<string, string> = {
    profil: 'HKBP P2B',
    warta: 'COMINGSOON',
    ibadah: 'WARTA dan ACARA',
    giving: 'PERSEMBAHAN',
    other: 'LAYANAN'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const backgroundQueue = ['giving', 'ibadah', 'warta', 'other'];
    const loadSequentially = async () => {
      await new Promise((resolve) => requestAnimationFrame(() => {
        setTimeout(resolve, 50);
      }));

      for (const tab of backgroundQueue) {
        setLoadedTabs((prev) => (prev.includes(tab) ? prev : [...prev, tab]));
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    };

    if (document.readyState === 'complete') {
      loadSequentially();
    } else {
      window.addEventListener('load', loadSequentially, { once: true });
    }
  }, []);


  const renderRightWindow = () => {
    if (!selectedDetail) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10 text-center"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Home size={32} className="opacity-20" />
          </div>
          <p className="font-black uppercase tracking-widest text-xs">Pilih konten di kiri layar untuk melihat detail</p>
        </div>
      );
    }

    if (selectedDetail.type === 'pdf') {
      return (
        <div className="flex flex-col h-full bg-white">
          <div className="flex flex-col h-full">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-100 relative flex justify-center">
              <iframe
                src={`https://drive.google.com/file/d/${selectedDetail.id}/preview`}
                className="w-[125%] h-[110%] shrink-0 border-none"
                style={{
                  transform: 'translateY(-4.5%)',
                  pointerEvents: 'auto',
                }}
                allow="autoplay"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      );
    }

    if (selectedDetail.type === 'form') {
      return (
        <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
          <div className="p-10 pt-10">
            {selectedDetail.id === 'data-jemaat' && <DataJemaatForm onBack={() => setSelectedDetail(null)} />}
            {selectedDetail.id === 'doa' && <DoaForm onBack={() => setSelectedDetail(null)} />}
            {selectedDetail.id === 'saran' && <SaranForm onBack={() => setSelectedDetail(null)} />}
            {selectedDetail.id === 'konseling' && <KonselingForm onBack={() => setSelectedDetail(null)} />}
          </div>
        </div>
      );
    }

    const isRenungan = selectedDetail.type === 'renungan';

    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
        <div className="sticky top-0 z-10 flex justify-end p-12 pointer-events-none"></div>

        <div className="-mt-14">
          {!isRenungan && selectedDetail.url && (
            <div className="w-full aspect-video shrink-0 bg-slate-100 mb-10">
              <img src={selectedDetail.url} className="w-full h-full object-cover" alt="" />
            </div>
          )}

          <div className="p-10 pt-0">
            <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
              {selectedDetail.tanggal}
            </p>

            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-[0.95] mb-8">
              {isRenungan ? selectedDetail.topik : selectedDetail.judul}
            </h2>

            {isRenungan && (
              <div className="border-l-[4px] border-slate-900 pl-6 py-2 mb-10">
                <p className="text-[22px] font-black text-slate-900 italic leading-snug mb-3">
                  "{selectedDetail.kutipan}"
                </p>
                <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  — {selectedDetail.ayat}
                </p>
              </div>
            )}

            {isRenungan && selectedDetail.bukuEnde && (
              <div className="mb-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                  Buku Ende / HKBP
                </h5>
                <p className="text-[18px] font-black text-slate-900 mb-3">
                  {selectedDetail.bukuEnde}
                </p>
                <p className="text-[16px] font-medium text-slate-600 leading-relaxed italic whitespace-pre-line">
                  {selectedDetail.lirikEnde}
                </p>
              </div>
            )}

            <p className="text-[19px] font-medium text-slate-800 leading-[1.8] whitespace-pre-line">
              {isRenungan ? selectedDetail.isi : selectedDetail.deskripsi}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={titles[activeTab]}
      detailContent={renderRightWindow()}
    >

      <div className="max-w-3xl mx-auto w-full pt-0 h-full flex flex-col">
        <div className="w-full flex-1">
          {loadedTabs.includes('profil') && (
            <div className={activeTab === 'profil' ? 'h-full block' : 'hidden'}>
              <ProfileTab onHeroSelect={(data) => setSelectedDetail(data)} />
            </div>
          )}

          {loadedTabs.includes('giving') && (
            <div className={activeTab === 'giving' ? 'block' : 'hidden'} style={{ contentVisibility: activeTab === 'giving' ? 'visible' : 'auto' }}>
              <GivingTab />
            </div>
          )}

          {loadedTabs.includes('ibadah') && (
            <div className={activeTab === 'ibadah' ? 'block' : 'hidden'} style={{ contentVisibility: activeTab === 'ibadah' ? 'visible' : 'auto' }}>
              <IbadahTab onSelectContent={(data) => setSelectedDetail(data)} />
            </div>
          )}

          {loadedTabs.includes('warta') && (
            <div className={activeTab === 'warta' ? 'block' : 'hidden'} style={{ contentVisibility: activeTab === 'warta' ? 'visible' : 'auto' }}>
              <AplikasiTab />
            </div>
          )}

          {loadedTabs.includes('other') && (
            <div className={activeTab === 'other' ? 'block' : 'hidden'}>
              <OtherTab onSelectContent={(data) => setSelectedDetail(data)} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;