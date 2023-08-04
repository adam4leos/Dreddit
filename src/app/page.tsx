"use client"
import App from "./App";
import { Web5StorageProvider } from './providers/Web5StorageProvider';

export default function Home() {
    return (
      <Web5StorageProvider>
        <App />
      </Web5StorageProvider>
    )
}
