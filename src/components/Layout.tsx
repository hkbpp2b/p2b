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
}

const Layout = ({ children, activeTab, setActiveTab, title }: LayoutProps) => {
    const menus = [
        { id: 'warta', label: 'TBA', icon: <FileClock size={22} /> },
        { id: 'ibadah', label: 'Warta', icon: <Newspaper size={22} /> },
        { id: 'profil', label: 'Home', icon: <Home size={22} /> },
        { id: 'giving', label: 'Persembahan', icon: <QrCode size={22} /> },
        { id: 'other', label: 'Lainnya', icon: <CalendarDays size={22} /> },
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
            >
                {children}
            </LayoutDesktop>

            <LayoutMobile
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                title={title}
                menus={menus}
            >
                {children}
            </LayoutMobile>
        </>
    );
};

export default Layout;