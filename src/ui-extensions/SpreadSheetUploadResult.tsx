//"FILE_TID", "FILENAME", "X_ANALYSIS"

import React, { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  AlertTitle,
  Container,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

import { ProcessingResult } from '../myapp/shared/components/ProcessingResult';
import { WithTTDefProp } from '../ui-factory';
import { toList } from 'remotequery-ts-common';

import { useNavigationContext } from '../ui-factory/components/navigation/navigation-utils';
import { errorMessage, StatusMessageElement, successMessage } from '../ui-factory';

type XRequest = { serviceId: string; ref: string; parameterUsed: any; exceptions: string[] };
type XTable = { table: string; numberOfRequests: number; startRef: string; endRef: string; requests: XRequest[] };
type XSheet = { sheet: string; tables: XTable[] };
type XAnalysis = {
  sheets: XSheet[];
  useBatch: boolean;
  useSheetnameForPrefix: boolean;
  fileTid: string;
  filename: string;
  documentBytesLength: number;
};

type Entry = { fileTid: string; filename: string; xAnalysis: string };

export function SpreadSheetUploadResult({ ttDef }: WithTTDefProp) {
  const [list, setList] = useState<Entry[]>([]);
  const context = useNavigationContext();
  const { getResult } = context;
  const result = getResult(ttDef.name);

  useEffect(() => {
    setList(toList(result) as Entry[]);
  }, [result]);

  const firstEntry = list[0];
  const json = useMemo(
    () => (firstEntry?.xAnalysis ? JSON.parse(firstEntry.xAnalysis) : undefined),
    [firstEntry]
  ) as XAnalysis[];

  if (!result) {
    return (
      <Alert>
        <AlertTitle>No result available.</AlertTitle>
      </Alert>
    );
  }

  return (
    <Container>
      {firstEntry ? (
        <React.Fragment key={'first-entry'}>
          <div>
            {json && json[0]
              ? json[0].sheets.map((e, sheetIndex) => (
                  <div key={sheetIndex}>
                    <InputLabel sx={{ fontSize: '1.2em' }}>Sheet: {e.sheet}</InputLabel>

                    <Table size={'small'}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Table Start</TableCell>
                          <TableCell>Ref</TableCell>
                          <TableCell>serviceId</TableCell>
                          <TableCell>Result/Exception</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {e.tables.map((t, i1) =>
                          t.requests.map((r, i2) => (
                            <TableRow key={i1 + '--' + i2}>
                              <TableCell key={'startRef'}>{t.startRef}</TableCell>
                              <TableCell key={'ref'}>{r.ref}</TableCell>
                              <TableCell key={'serviceId'}>{r.serviceId}</TableCell>
                              <TableCell key={'exception'}>
                                {r.exceptions ? (
                                  <StatusMessageElement statusMessage={errorMessage('', '', [...r.exceptions])} />
                                ) : (
                                  <StatusMessageElement statusMessage={successMessage('Ok')} />
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ))
              : ''}
          </div>
        </React.Fragment>
      ) : (
        <ProcessingResult ttDef={ttDef} />
      )}
    </Container>
  );
}
