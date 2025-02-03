import { init } from '@rematch/core';
import storage from 'redux-persist/lib/storage';
import loadingPlugin from '@rematch/loading';
import persistPlugin from '@rematch/persist';
import * as models from './models';
import { useDispatch } from 'react-redux';
import { IDispatch } from './types/store.types';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['emi'],
};

const persistedConfig = persistPlugin(persistConfig) as never;

const store = init({
  models,
  plugins: [loadingPlugin(), persistedConfig],
});

export default store;

export const useAppDispatch = () => useDispatch<IDispatch>();
