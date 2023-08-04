import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dreddit',
  description: 'No dread reddit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
