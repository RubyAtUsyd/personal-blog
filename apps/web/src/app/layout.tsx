import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ruby Liang — Engineering notebook',
  description: 'Notes on software, systems, and learning how things work.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
