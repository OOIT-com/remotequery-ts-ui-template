import { Stack } from '@mui/material';
import * as React from 'react';
import { useUserInfo } from '../../../../ui-factory';

export function TrainingUi() {
  const userInfo = useUserInfo();

  return <Stack spacing={1}>{`${userInfo.userId}, Welcome to the Training Overview Page`}</Stack>;
}
