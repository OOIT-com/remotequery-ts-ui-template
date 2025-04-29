import { TtMenuSection } from '../../../app-support';
import { registerTtDefs } from '../../../ui-factory';
import { UserAccount_insert, UserAccount_select, UserAccount_update } from './ttdefs/user-account';

export function load() {
  registerTtDefs([UserAccount_select, UserAccount_insert, UserAccount_update]);
}

load();

export const userAccountSections: TtMenuSection[] = [
  {
    name: 'user-account-1',
    colIndex: 0,
    menuEntries: [UserAccount_select]
  }
];
