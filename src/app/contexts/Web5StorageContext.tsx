import React from 'react';

export interface IWeb5Storage {
    did: string;
    web5: any;
}

interface IWeb5StorageContextProps {
    web5Storage: Map<string, IWeb5Storage>;
    addToWeb5Storage: (key: string, map: IWeb5Storage) => void;
}

export const Web5StorageContext = React.createContext<IWeb5StorageContextProps>({} as IWeb5StorageContextProps);
