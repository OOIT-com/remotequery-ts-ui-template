import { Box, Button, Stack } from '@mui/material';
import { isStatusMessage, NotifyFun, StatusMessage, StatusMessageElement, successMessage } from '../ui-factory';
import React, { FC, ReactElement } from 'react';

export type Line = { message: string; state: string };

export type ProcessLog = {
  processLog?: { state: string; lines: Line[] };
};

export function RenderLine({ line }: { line: Line }): ReactElement {
  if (!line.message) {
    return <></>;
  }
  let color = 'gray';
  const state = line.state || '';
  if (state.toLowerCase().startsWith('error')) {
    color = 'red';
  } else if (state.toLowerCase().startsWith('warn')) {
    color = 'orange';
  } else if (state.toLowerCase().startsWith('ok')) {
    color = 'green';
  }
  return <Box sx={{ color, padding: '0.2em' }}>{line.message}</Box>;
}

export type RenderProcessLogProps = { result: StatusMessage | ProcessLog | null; done?: NotifyFun };

export function RenderProcessLog({ result, done }: RenderProcessLogProps): ReactElement {
  if (result === null) {
    return <></>;
  }

  if (isStatusMessage(result)) {
    return <StatusMessageElement statusMessage={result} onClose={done} />;
  } else if (result.processLog?.lines) {
    return (
      <Stack sx={{ padding: '1em' }}>
        <RenderLines lines={result.processLog.lines} />
        {!!done && <Button onClick={done}>close</Button>}
      </Stack>
    );
  }
  return <></>;
}

const RenderLines: FC<{ lines: Line[] }> = ({ lines }) => {
  if (lines.length === 0) {
    return <StatusMessageElement statusMessage={successMessage('Upload successful')} />;
  } else {
    return (
      <Stack>
        {lines.map((line, index) => (
          <RenderLine key={`${index} ${line.message}`} line={line} />
        ))}
      </Stack>
    );
  }
};
