import { DocumentDef } from '../reporting-support/report-types';
import { processService } from '../ui-factory';
import { toList } from 'remotequery-ts-common';

export async function reportExcelRender(def: DocumentDef) {
  const documentDefJson = JSON.stringify(def);
  const res = await processService('DocumentDefSpreadsheet', { documentDefJson });
  return toList(res)[0];
}
