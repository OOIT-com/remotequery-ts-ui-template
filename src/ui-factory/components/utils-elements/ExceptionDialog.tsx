import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Alert, AlertTitle, DialogContent } from '@mui/material';
import { dispatchException } from '../../redux';
import { ttLabel } from '../../tabletool-utils';

export function ExceptionDialog({ exception }: { exception: string }) {
  return (
    <Dialog open={!!exception} onClose={() => dispatchException('')}>
      <DialogContent>
        <Alert
          key={'exception'}
          severity={'error'}
          action={
            <Button size="small" onClick={() => dispatchException('')}>
              {ttLabel('close')}
            </Button>
          }
        >
          <AlertTitle>{exception}</AlertTitle>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}
