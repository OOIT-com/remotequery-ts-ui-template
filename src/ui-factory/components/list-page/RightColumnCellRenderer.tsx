import { Button, Stack } from '@mui/material';
import { processRowAction } from './ag-grid-utils';
import { resolveBoolean2, ttLabel } from '../../tabletool-utils';
import React, { Fragment } from 'react';
import { ActionDef } from '../../types';

import { Result, SRecord } from 'remotequery-ts-common';
import { NavigationContextType } from '../navigation/NavigationProvider';

type CellRendererProps = {
  name: string;
  rowRightActions: ActionDef[];
  context: NavigationContextType;
  data: SRecord;
  setDataAndConfig: (sd: Result) => void;
};

export function RightColumnCellRenderer({ name, rowRightActions, data, setDataAndConfig, context }: CellRendererProps) {
  return (
    <Stack direction={'row'} padding={0.5} spacing={1}>
      {rowRightActions.map((actionDef) => {
        const visible = resolveBoolean2(actionDef.visible ?? true, { ...data });
        if (!visible) {
          return <Fragment key={actionDef.name + '-empty'}></Fragment>;
        }
        return (
          <Button
            size={'small'}
            key={actionDef.name}
            variant={'text'}
            ref={(ref) => {
              if (!ref) return;
              ref.onclick = (e) => {
                e.stopPropagation(); // this works
                processRowAction({ name, actionDef, row: data, setDataAndConfig, context });
              };
            }}
          >
            {ttLabel(actionDef)}
          </Button>
        );
      })}
    </Stack>
  );
}
