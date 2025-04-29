import React, { FC, ReactNode } from 'react';
import { Alert, AlertTitle, Box, Stack } from '@mui/material';
import { StatusMessage } from './types';
import { useLabels } from '../redux';
import { SxProps } from '@mui/system';

export type StatusMessageProps = {
  statusMessage?: StatusMessage;
  onClose?: () => void;
  actions?: ReactNode;
  sx?: SxProps;
};
export const StatusMessageElement: FC<StatusMessageProps> = ({
  statusMessage,
  onClose,
  actions,
  sx
}: StatusMessageProps) => {
  const { l } = useLabels();

  if (!statusMessage) {
    return <></>;
  }

  const hasUserMessage = !!statusMessage.userMessage;
  const hasSystemMessage = !!statusMessage.systemMessage;

  return (
    <Alert severity={statusMessage.status} onClose={onClose} action={actions} sx={sx}>
      <Stack>
        {hasUserMessage && <AlertTitle key={'user--message'}>{l(statusMessage.userMessage)}</AlertTitle>}

        {hasSystemMessage && (
          <Box key={'system-message'} sx={{ wordBreak: 'break-word' }}>
            {l(statusMessage.systemMessage)}
          </Box>
        )}

        {!!statusMessage.additionalSystemMessages &&
          statusMessage.additionalSystemMessages.map((am) => (
            <Box key={am} sx={{ wordBreak: 'break-word' }}>
              {l(am)}
            </Box>
          ))}
      </Stack>
    </Alert>
  );
};
