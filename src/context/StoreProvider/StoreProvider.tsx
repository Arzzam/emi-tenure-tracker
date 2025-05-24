import { useRef } from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { IStore } from '@/store/types/store.types';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<IStore>(store);
    if (!storeRef.current) {
        storeRef.current = store;
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
