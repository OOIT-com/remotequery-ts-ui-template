import React, { useEffect } from 'react';
import { Box } from '@mui/material';

import { NavigationProvider } from './NavigationProvider';
import { NotifyFun } from '../../types';
import { resolveTtDef, resolveUiType } from '../../tabletool-utils';
import { errorMessage, infoMessage, StatusMessageElement } from '../../status-message';
import { useNavigationContext } from './navigation-utils';

export function Navigator({ initialForward, done }: Readonly<{ initialForward: string; done: NotifyFun }>) {
  return (
    <NavigationProvider initialForward={initialForward}>
      <NavigatorInner done={done} />
    </NavigationProvider>
  );
}

function NavigatorInner({ done }: Readonly<{ done: NotifyFun }>) {
  const { initialForward, forward, updateForward } = useNavigationContext();

  // useEffect(() => {
  //   updateForward(initialForward);
  // }, [initialForward, updateForward]);

  useEffect(() => {
    if (forward === 'exit') {
      console.log('NavigatorInner exit');
      done();
    }
    if (forward === 'close' || forward === '') {
      updateForward(initialForward);
    }
  }, [forward, initialForward, done, updateForward]);

  if (forward === 'exit') {
    return <StatusMessageElement statusMessage={infoMessage(`Bye bye`)} />;
  }

  if (initialForward === '') {
    return <StatusMessageElement statusMessage={infoMessage(`Waiting for initialForward`)} onClose={done} />;
  }
  if (forward === '') {
    return <StatusMessageElement statusMessage={infoMessage(`Loading...`)} onClose={done} />;
  }

  const ttDef = resolveTtDef(forward);
  if (!ttDef) {
    return (
      <StatusMessageElement
        statusMessage={errorMessage(`Unknown forward: ${forward}`)}
        // onClose={() => setInitialForward('')}
        onClose={() => done()}
      />
    );
  }

  const uiTypeFun = resolveUiType(ttDef.uiType);
  if (typeof uiTypeFun !== 'function') {
    return (
      <StatusMessageElement
        statusMessage={errorMessage(`TT Def : Missing uiType function ${ttDef.uiType}`)}
        // onClose={() => setInitialForward('')}
        onClose={() => done()}
      />
    );
  }
  return <Box>{React.createElement(uiTypeFun, { key: ttDef.name, ttDef: ttDef }, null)}</Box>;
}
