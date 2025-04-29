import React, { FC } from 'react';
import { Box, Button, InputLabel, Stack } from '@mui/material';
import { toList } from 'remotequery-ts-common';
import { WithTTDefProp } from '../../../ui-factory/types';
import { StatusMessageElement, warningMessage } from '../../../ui-factory';
import { processForwardClose } from '../../../ui-factory/components/navigation/process-forward';
import { useNavigationContext } from '../../../ui-factory/components/navigation/navigation-utils';

type Message = { message: string };

/**
 * Display of a list of messages
 * @param def in this case the messageResult ttDef is expected (most likely)
 * The result in this case result is expected to be a table with a single column
 * @constructor
 */
export const MessageResult: FC<WithTTDefProp> = ({ ttDef }: WithTTDefProp) => {
  const context = useNavigationContext();
  const { getResult, back } = context;
  const result = getResult(ttDef.name);
  if (!result) {
    return (
      <StatusMessageElement
        statusMessage={warningMessage('No Result to display!')}
        onClose={() => processForwardClose(context)}
      />
    );
  }
  const messages = toList<Message>(result);
  return (
    <Stack spacing={1}>
      <Stack direction={'row'} justifyContent={'flex-end'}>
        <Button onClick={() => back()}>Back</Button>
      </Stack>
      {ttDef.label ? (
        <InputLabel>{ttDef.label}</InputLabel>
      ) : (
        <InputLabel>{`${messages.length} Message(s)`}</InputLabel>
      )}
      {messages.map(({ message }, index) => (
        <Box key={'' + index} sx={{ color: messageColor(message) }}>
          {message}
        </Box>
      ))}
    </Stack>
  );
};

function messageColor(message = ''): 'red' | 'green' | 'gray' | 'orange' {
  if (message.startsWith('Error')) {
    return 'red';
  } else if (message.startsWith('Warning')) {
    return 'orange';
  } else if (message.startsWith('Ok')) {
    return 'green';
  } else {
    return 'gray';
  }
}
