import React, { FC } from 'react';
import { WithTTDefProp } from '../../../ui-factory';

import { useNavigationContext } from '../../../ui-factory/components/navigation/navigation-utils';
import { errorMessage, StatusMessageElement } from '../../../ui-factory';
import { Line, RenderProcessLog } from '../../utils-legacy';
import { processForwardClose } from '../../../ui-factory/components/navigation/process-forward';

export const FileUploadResult: FC<WithTTDefProp> = ({ ttDef }) => {
  const context = useNavigationContext();
  const { getResult } = context;
  const result = getResult(ttDef.name);

  if (!result) {
    return <StatusMessageElement statusMessage={errorMessage('Unexpected Empty Result!')} />;
  }

  const r = (result.table && result.table[0][2]) || '{}';
  const lines: Line[] = JSON.parse(r).lines.filter((e: Line) => e.state !== 'System');
  return <RenderProcessLog result={{ processLog: { state: '', lines } }} done={() => processForwardClose(context)} />;
};
