import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';
import React from 'react';

const calcFontSize = (level: number) => {
  switch (level) {
    case 1:
      return '1.8em';
    case 2:
      return '1.4em';
    case 3:
      return '1.2em';
    default:
      return '1em';
  }
};

const calcLineheight = (level: number) => {
  switch (level) {
    case 1:
      return '1.8em';
    case 2:
      return '1.4em';
    case 3:
      return '1.2em';
    default:
      return '1em';
  }
};

export const Header: FC<{ level?: number; content: ReactNode | string }> = ({ content, level = 1 }) => (
  <Stack sx={{ fontWeight: 800, fontSize: calcFontSize(level), lineHeight: calcLineheight(level) }}>{content}</Stack>
);
