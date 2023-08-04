import React, { useState, ReactNode } from 'react';
import { Web5StorageContext, IWeb5Storage } from '../contexts/Web5StorageContext';

interface Web5StorageProviderProps {
  children: ReactNode;
}

export const Web5StorageProvider: React.FC<Web5StorageProviderProps> = ({ children }) => {
  const [web5Storage, setWeb5Storage] = useState<Map<string, IWeb5Storage>>(new Map());

  const addToWeb5Storage = (key: string, web5Data: IWeb5Storage) => {
    setWeb5Storage(prevStorage => new Map(prevStorage.set(key, web5Data)));
  };

  return (
    <Web5StorageContext.Provider value={{ web5Storage, addToWeb5Storage }}>
      {children}
    </Web5StorageContext.Provider>
  );
};
