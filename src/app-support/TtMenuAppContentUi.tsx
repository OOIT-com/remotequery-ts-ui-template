import * as React from 'react';
import { FC } from 'react';
import { errorMessage, ExceptionDialog, StatusMessageElement, useException } from '../ui-factory';
import { TtMenuTabsUi } from './TtMenuTabsUi';
import { TtMenuApp } from './types';

export const TtMenuAppContentUi: FC<{ ttMenuApp: TtMenuApp }> = ({ ttMenuApp }) => {
  if (ttMenuApp.menuTabs) {
    return <TtMenuTabsUi menuTabs={ttMenuApp.menuTabs} />;
  }
  if (ttMenuApp.Ui) {
    return <ttMenuApp.Ui />;
  }
  return (
    <StatusMessageElement sx={{ margin: '1em' }} statusMessage={errorMessage(`App ${ttMenuApp.name} is empty!`)} />
  );
};

export function AppException() {
  const exception = useException();
  return <ExceptionDialog exception={exception}></ExceptionDialog>;
}
