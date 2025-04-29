import React, { FC, ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { ResultDataTable } from '../../../ui-extensions/ResultDataTable';
import { JsonViewer } from '@textea/json-viewer';
import { Result } from 'remotequery-ts-common';
import { errorMessage, Header, StatusMessageElement, successMessage, WithTTDefProp } from '../../../ui-factory';

import { useNavigationContext } from '../../../ui-factory/components/navigation/navigation-utils';

export const ProcessingResult: FC<WithTTDefProp> = ({ ttDef }) => {
  const context = useNavigationContext();
  const { getResult } = context;
  const result = getResult(ttDef.name);

  if (!result) {
    return <StatusMessageElement statusMessage={errorMessage('Unexpected Empty Result!')} />;
  }
  return (
    <Stack>
      {!!ttDef.label && <Header level={4} content={ttDef.label} />}
      <RenderContent result={result} />
    </Stack>
  );
};

function RenderContent({ result }: { result: Result }) {
  const list: ReactNode[] = [];
  const okMessage = result && !result.exception && (!result.table || result.table.length === 0);
  if (okMessage) {
    list.push(<StatusMessageElement statusMessage={successMessage('Success!')} />);
  } else {
    if (result.exception) {
      list.push(
        <StatusMessageElement statusMessage={errorMessage(result.exception)} />

        // <Alert key={'error'} severity={'error'}>
        //   <AlertTitle>Exception</AlertTitle>
        //   <p>{result.exception}</p>
        // </Alert>
      );
    }
    if (result.table && result.table.length > 0) {
      list.push(
        <Box key={'data'}>
          <ResultDataTable
            key={'data'}
            name={(result as any).name || 'sq-result-data'}
            title={'Result Data'}
            header={result.header || []}
            table={result.table || []}
          />
        </Box>
      );
    }
  }
  list.push(
    <Box key={'resultAsJson'}>
      <h5>Result as JSON</h5>
      <JsonViewer value={result || {}} />
    </Box>
  );
  return <>{list}</>;
}
