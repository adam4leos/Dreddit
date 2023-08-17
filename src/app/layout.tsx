import { Header } from "@/components/Header/Header";
import { Web5StorageProvider } from '@/providers/Web5StorageProvider';
import { PostsProvider } from '@/providers/PostsProvider';

import './globals.css'

export const metadata = {
  title: 'Dreddit',
  description: 'Drive into anything',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <Web5StorageProvider>
          <PostsProvider>
            <div className="Root">
                  <Header />
                  <main className="Root__main">
                    {children}
                  </main>
              </div>
            </PostsProvider>
        </Web5StorageProvider>
      </body>
    </html>
  );
}
