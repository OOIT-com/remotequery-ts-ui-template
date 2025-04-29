import { ActionDef, ServiceDataSetter } from '../../types';
import { dispatchLoading } from '../../redux';
import { processAction } from '../../tabletool-utils';
import { isExceptionResult, SRecord, toFirst } from 'remotequery-ts-common';
import { processForward } from '../navigation/process-forward';
import { NavigationContextType } from '../navigation/NavigationProvider';
import { errorMessage, StatusMessage } from '../../status-message';

export async function processDetailAction(
  parameters: SRecord,
  actionDef: ActionDef,
  context: NavigationContextType,
  setData: ServiceDataSetter
): Promise<StatusMessage | undefined> {
  const forward = actionDef.forward;
  if (!forward) {
    console.warn(`Value of forward is empty (action name ${actionDef.name})!`);
    return;
  }
  try {
    dispatchLoading(`Process ${actionDef.name}...`);
    const result = await processAction(actionDef, parameters);
    if (isExceptionResult(result)) {
      return errorMessage(result.exception);
    }
    if (forward === 'refresh' || forward === 'update') {
      setData(result);
    } else {
      processForward({
        actionDef,
        context,
        cx: toFirst(result),
        result
      });
    }
  } finally {
    dispatchLoading('');
  }
}
