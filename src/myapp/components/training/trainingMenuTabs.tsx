import { trainingSections } from './trainingSections';
import { TtMenuTab } from '../../../app-support';
import { TrainingUi } from './components/TrainingUi';

export const trainingMenuTabs: TtMenuTab[] = [
  {
    name: 'training-overview',
    label: 'Trainings',
    Ui: TrainingUi
  },
  {
    name: 'training-admin',
    label: 'Training Admin',
    menuSections: trainingSections
  }
];
