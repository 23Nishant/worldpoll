import React from 'react';
//import './globals.css';

export const metadata = {
  title: 'Multiple Polls Voting Page',
  description: 'A page with multiple polls for voting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}