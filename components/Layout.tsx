import React, { ReactNode } from 'react';
import Nav from './Nav';
import Head from 'next/head';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  activeNavItem?: string;
  setActiveNavItem?: (id: string) => void;
};

export default function Layout({ 
  children, 
  title = 'RoofMaster 24/7', 
  activeNavItem = 'dashboard',
  setActiveNavItem = () => {}
}: LayoutProps) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image - positioned to show the middle at 16:9 aspect ratio */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/images/navimage.png)',
            height: '100vh',
            backgroundPosition: 'center 40%', // Adjust to show the middle of the image
            filter: 'brightness(0.95)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-indigo-900/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Head>
          <title>{title}</title>
          <meta name="description" content="RoofMaster 24/7 Training Platform" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Nav activeItem={activeNavItem} setActiveItem={setActiveNavItem} />
        
        <main>{children}</main>
      </div>
    </div>
  );
}
