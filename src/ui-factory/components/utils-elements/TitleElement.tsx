import { LabelDef } from '../../types';
import { ttLabel } from '../../tabletool-utils';
import React from 'react';
import { Box, Stack, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SRecord } from 'remotequery-ts-common';

type TitleElementProps = { def: LabelDef; cx?: SRecord; dirty?: boolean };

export function TitleElement({ def, cx = {}, dirty = false }: TitleElementProps) {
  return (
    <Stack direction={'row'} spacing={1} alignItems={'center'} padding={1}>
      <Box sx={{ fontWeight: 'bold', fontSize: '160%' }}>
        {ttLabel(def, cx)}
        {dirty ? '*' : ''}
      </Box>

      {def.description ? (
        <Tooltip title={<div dangerouslySetInnerHTML={{ __html: ttLabel(def.description) }} />}>
          <IconButton size={'small'}>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ''
      )}
    </Stack>
  );
}
