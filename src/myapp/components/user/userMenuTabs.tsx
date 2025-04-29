import { userAccountSections } from './userAccountSections';
import { TtMenuTab } from '../../../app-support';

export const userMenuTabs: TtMenuTab[] = [
  {
    name: 'user-accounts',
    label: 'User Accounts',
    menuSections: userAccountSections
  }
];
