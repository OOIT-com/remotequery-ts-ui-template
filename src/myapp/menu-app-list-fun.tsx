import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Person } from '@mui/icons-material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { MenuAppListFun, TtMenuApp, UserInfoUi } from '../app-support';
import * as React from 'react';
import { UserInfo, useUserInfo } from '../ui-factory';
import { trainingMenuTabs } from './components/training/trainingMenuTabs';
import { accountingMenuTabs } from './components/accounting/accountingMenuTabs';
import { userMenuTabs } from './components/user/userMenuTabs';

export const menuAppListFun: MenuAppListFun = async (userInfo: UserInfo): Promise<TtMenuApp[]> => {
  const ttMenuApp: TtMenuApp[] = [];

  if (userInfo.roles.includes('USER')) {
    ttMenuApp.push({
      name: 'training',
      label: 'Training',
      icon: <DirectionsRunIcon />,
      roles: ['USER'],
      menuTabs: trainingMenuTabs
    });
  }

  if (userInfo.roles.includes('ADMIN')) {
    ttMenuApp.push({
      name: 'user-admin',
      label: 'User Admin',
      icon: <AccessTimeIcon />,
      roles: ['ADMIN'],
      menuTabs: userMenuTabs
    });
  }

  ttMenuApp.push({
    name: 'Accounting',
    roles: [],
    label: 'Accounting',
    icon: <ListAltIcon />,

    menuTabs: accountingMenuTabs
  });

  ttMenuApp.push({
    name: 'userInfo',
    roles: [],
    label: UserInfoLabel,
    icon: <Person />,
    Ui: UserInfoUi
  });
  return ttMenuApp;
};

function UserInfoLabel() {
  const userInfo = useUserInfo();
  return <>{userInfo.userId ? userInfo.userId : 'User Info'}</>;
}
