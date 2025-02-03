import { RematchDispatch, RematchRootState } from '@rematch/core';
import store from '../../store/store';
import { IRootModel } from '../../store/IModels';

export type IStore = typeof store;
export type IDispatch = RematchDispatch<IRootModel>;
export type IRootState = RematchRootState<IRootModel>;
