import React, { useEffect, useMemo, useState } from 'react';
import { TtDef } from '../../types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { ttLabel } from '../../tabletool-utils';

import { SRecord } from 'remotequery-ts-common';

import { useNavigationContext } from '../navigation/navigation-utils';

type RemoteFilterDialogProps = {
  open: boolean;
  onClose: (dirty?: boolean) => void;
  ttDef: TtDef;
};

export function RemoteFilterDialog({ open, onClose, ttDef }: Readonly<RemoteFilterDialogProps>) {
  const { getRemoteFilter, updateRemoteFilter } = useNavigationContext();

  const remoteFilter = getRemoteFilter(ttDef.name);
  const remoteFilterAttributes = useMemo(() => ttDef.attributes.filter((a) => !!a.remoteFilter), [ttDef]);

  const [rfValues, setRfValues] = useState<SRecord>({});

  useEffect(() => {
    if (remoteFilter) {
      setRfValues(remoteFilter);
    }
  }, [remoteFilter]);

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <DialogTitle>Remote Filters</DialogTitle>
      <DialogContent>
        <Stack direction={'column'} spacing={2}>
          {remoteFilterAttributes.map(({ name, label }) => {
            return (
              <TextField
                size={'small'}
                key={name}
                label={ttLabel({ name, label })}
                autoComplete={'off'}
                fullWidth
                type={'text'}
                onChange={(e) => setRfValues((v) => ({ ...v, [name]: e.target.value }))}
                value={rfValues}
              />
            );
          })}
          <Stack direction={'row'} spacing={2}></Stack>
          <Button
            key={'submit'}
            onClick={() => {
              updateRemoteFilter(ttDef.name, rfValues);
              onClose(true);
            }}
          >
            {ttLabel('Set Remote Filter')}
          </Button>
          <Button
            onClick={() => {
              updateRemoteFilter(ttDef.name, {});
              onClose(true);
            }}
          >
            {ttLabel('Clear Remote Filter')}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>...</DialogActions>
    </Dialog>
  );
}
