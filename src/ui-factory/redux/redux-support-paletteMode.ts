import { useSelector } from 'react-redux';
import { getStore, RootState } from './redux-tookit';
import { dispatchDataMap } from './redux-support-tt';

export type PaletteModes = 'light' | 'dark';
export const usePaletteMode = (): PaletteModes =>
  useSelector((state: RootState) => state.tt.dataMap['paletteMode'] || 'light');

export const dispatchPaletteModeToggle = () => {
  const prevMode = getStore().getState().tt.dataMap['paletteMode'];
  dispatchDataMap<string>('paletteMode', prevMode === 'dark' ? 'light' : 'dark');
};
