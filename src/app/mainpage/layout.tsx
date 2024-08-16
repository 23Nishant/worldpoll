import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';
//import './globals.css';

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

interface LayoutProps {
  children: ReactNode;
}

const MainPageLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-4 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-primary-foreground">
          Main Page Header
        </h1>
      </header>
      <main className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-secondary py-4 px-4 md:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPageLayout;
