import React from 'react';
import { Box, Stack } from '@mui/material';

export default function TtMenuTitle({ content }: { content: string | React.ReactNode }) {
  if (typeof content === 'string') {
    return (
      <Stack
        direction={'row'}
        spacing={1}
        mt={'1em'}
        alignItems={'center'}
        sx={{ fontSize: '160%', fontWeight: 'bold' }}
      >
        <Box>{content}</Box>
      </Stack>
    );
  } else {
    return (
      <Stack
        direction={'row'}
        spacing={1}
        mt={'1em'}
        alignItems={'center'}
        sx={{ fontSize: '160%', fontWeight: 'bold' }}
      >
        {content}
      </Stack>
    );
  }
}
