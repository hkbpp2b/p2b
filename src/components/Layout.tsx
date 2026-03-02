// Layout.tsx
import React, { useState, useEffect } from 'react';
import { Home, QrCode, CalendarDays, Newspaper, FileClock } from 'lucide-react';
import LayoutDesktop from './LayoutDesktop';
import LayoutMobile from './LayoutMobile';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    title: string;
    detailContent?: React.ReactNode;
}

const Layout = ({ children, activeTab, setActiveTab, title, detailContent }: LayoutProps) => {
    const menus = [
        { id: 'warta', label: 'App', icon: <FileClock size={22} /> },
        { id: 'ibadah', label: 'Warta', icon: <Newspaper size={22} /> },
        { id: 'profil', label: 'Home', icon: <Home size={22} /> },
        { id: 'giving', label: 'Persembahan', icon: <QrCode size={22} /> },
        { id: 'other', label: 'Layanan', icon: <CalendarDays size={22} /> },
    ];

    useEffect(() => {
        window.history.pushState({ activeTab }, "");
        const handleBackButton = (event: PopStateEvent) => {
            const isOverlayOpen = document.body.classList.contains('modal-open');
            if (isOverlayOpen) return;
            if (activeTab !== 'profil') {
                setActiveTab('profil');
            } else {
                const confirmExit = window.confirm("Ingin menutup aplikasi?");
                if (!confirmExit) {
                    window.history.pushState({ activeTab: 'profil' }, "");
                } else {
                    window.history.back();
                }
            }
        };
        window.addEventListener('popstate', handleBackButton);
        return () => window.removeEventListener('popstate', handleBackButton);
    }, [activeTab, setActiveTab]);

    return (
        <>
            <LayoutDesktop
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                menus={menus}
                detailContent={detailContent}
            >
                {/* Gunakan key berbasis activeTab agar komponen reset saat pindah tab */}
                <div key={activeTab} className="h-full">
                    {children}
                </div>
            </LayoutDesktop>

            <LayoutMobile
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                title={title}
                menus={menus}
            >
                <div key={activeTab} className="h-full">
                    {children}
                </div>
            </LayoutMobile>
        </>
    );
};

export default Layout;