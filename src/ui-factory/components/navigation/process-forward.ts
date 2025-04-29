import { Result, SRecord } from 'remotequery-ts-common';
import { NavigationContextType } from './NavigationProvider';
import { ActionDef } from '../../types';

export type ProcessForwardArgs = {
  actionDef: ActionDef;
  cx?: SRecord;
  context: NavigationContextType;
  result?: Result;
};

export function processForward({ actionDef, context, cx = {}, result }: ProcessForwardArgs) {
  const { forward } = actionDef;
  const { updateForward, updateCx, back, updateResult } = context;
  if (forward === 'skip') {
    return;
  }
  if (forward === 'back') {
    back();
    return;
  }
  if (forward === 'exit') {
    updateForward('exit');
    return;
  }
  if (forward) {
    updateCx(forward, cx);
    updateForward(forward);
    if (result) {
      updateResult(forward, result);
    }
  }
}

export const processForwardClose = (context: NavigationContextType) => {
  const { updateForward } = context;
  updateForward('close');
};

export function processForwardExit(context: NavigationContextType) {
  const { updateForward } = context;
  updateForward('exit');
}
