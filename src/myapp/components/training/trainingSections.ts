import { TtMenuSection } from '../../../app-support';
import { Training_insert, Training_select, Training_update } from './ttdefs/training_select';
import { registerTtDefs } from '../../../ui-factory';

export function load() {
  registerTtDefs([Training_select, Training_insert, Training_update]);
}

load();

export const trainingSections: TtMenuSection[] = [
  {
    name: 'training-section-1',
    colIndex: 0,
    menuEntries: [Training_select]
  }
];
