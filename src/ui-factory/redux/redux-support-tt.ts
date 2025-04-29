import { InitState } from '../types';
import { useSelector } from 'react-redux';
import { RootState, setDataMap, setException, setInitState, store } from './redux-tookit';

export const useException = () => useSelector((state: RootState) => state.tt.exception);
export const dispatchException = (exception: string) => store.dispatch(setException(exception));
export const useInitState = () => useSelector((state: RootState) => state.tt.initState);
export const dispatchInitState = (initState: InitState) => store.dispatch(setInitState(initState));
export const useDataMap = <D>(key: string): D => useSelector((state: RootState) => state.tt.dataMap[key]);
export const dispatchDataMap = <D>(key: string, value: D) => store.dispatch(setDataMap({ key, value }));

export const useTTState = () => useSelector((state: RootState) => state.tt);
