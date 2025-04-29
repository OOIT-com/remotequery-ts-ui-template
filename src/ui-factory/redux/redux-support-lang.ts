import { useSelector } from 'react-redux';
import { RootState } from './redux-tookit';
import { dispatchDataMap } from './redux-support-tt';

export const useLang = (): string =>
  useSelector((state: RootState) => state.tt.dataMap['lang'] || localStorage.getItem('selected-lang') || 'en');
export const dispatchLang = (lang: string) => {
  localStorage.setItem('selected-lang', lang);
  dispatchDataMap<string>('lang', lang);
};
