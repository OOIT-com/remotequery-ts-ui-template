import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { ttLabel } from '../../tabletool-utils';

export type ColumnSelectionType = { colId: string; hide?: boolean };
type ColumnSelectionProps = {
  open: boolean;
  onClose: () => void;
  columns: ColumnSelectionType[];
  setColumns: (columns: ColumnSelectionType[]) => void;
  headerLabels: Record<string, string>;
};

export function ColumnSelection({ open, onClose, columns, setColumns, headerLabels }: ColumnSelectionProps) {
  const [_columns, _setColumns] = useState<ColumnSelectionType[]>(columns);

  useEffect(() => _setColumns(columns.filter((c) => !!headerLabels[c.colId])), [columns, headerLabels]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Select Visible Columns</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          {_columns.map(({ colId, hide }) => (
            <ListItemButton
              divider={true}
              key={colId}
              onClick={() => {
                const t = _columns.map((c) => (c.colId === colId ? { colId, hide: !c.hide } : c));
                _setColumns(t);
              }}
            >
              <Checkbox
                edge="start"
                checked={!hide}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': colId }}
              />
              <ListItemText primary={`${headerLabels[colId]}`} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          key={'apply'}
          onClick={() => {
            setColumns(_columns);
            onClose();
          }}
        >
          {ttLabel('Apply')}
        </Button>
        <Button
          key={'reset'}
          onClick={() => {
            setColumns(
              _columns.map((c) => ({
                ...c,
                hide: false
              }))
            );
            onClose();
          }}
        >
          {ttLabel('Reset')}
        </Button>
        <Button key={'cancel'} onClick={onClose}>
          {ttLabel('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
