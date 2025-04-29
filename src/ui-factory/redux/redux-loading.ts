import { useSelector } from 'react-redux';
import { loading, RootState, store } from './redux-tookit';

export const useLoading = () => useSelector((state: RootState): string => state.tt.loadingMessage ?? '');
export const dispatchLoading = (loadingMessage: string) => {
  return store.dispatch(loading(loadingMessage));
};
