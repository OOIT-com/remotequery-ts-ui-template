import React from 'react';
import { Box, Button, Container, Grid, Stack } from '@mui/material';
import { useLabels, useUserInfo } from '../ui-factory';

export function UserInfoUi() {
  const userInfo = useUserInfo();
  const { label } = useLabels();
  return (
    <Container maxWidth={'md'}>
      <Stack spacing={2}>
        <Box sx={{ fontSize: '1.8em', fontWeight: 'bold' }}>User Info</Box>

        <Box sx={{ fontSize: '1.4em', fontWeight: 'bold' }}>{userInfo.userId}</Box>

        <Box sx={{ fontWeight: 'bold' }}>{label('sessionId')}</Box>
        <Box>{userInfo.sessionId}</Box>

        <Box sx={{ fontSize: '1.4', fontWeight: 'bold' }}>Roles</Box>

        <Box>
          <Grid container spacing={2}>
            {[...userInfo.roles].sort().map((role) => (
              <Grid key={role} item xs={4}>
                {role}
              </Grid>
            ))}
          </Grid>
        </Box>
        <Stack direction={'row'}>
          <Button onClick={() => window.location.reload()}>{label('Logout')}</Button>
        </Stack>
      </Stack>
    </Container>
  );
}
