import { ActionDef, isError, processService } from '../ui-factory';
import { Result } from 'remotequery-ts-common';

const multiServiceId = 'MultiService';

export async function multiServicePromise(actions: ActionDef[]): Promise<Result[]> {
  const requestArray = JSON.stringify(actions);
  let exception: string = '';
  try {
    const sd = await processService(multiServiceId, { requestArray });
    if (sd.table) {
      return sd.table.map(([e]) => JSON.parse(e));
    }
  } catch (e) {
    if (isError(e)) {
      exception = e.message;
    }
  }
  return actions.map((a) => ({ exception: exception || `Error for ${multiServiceId} with action ${a.name}` }));
}
