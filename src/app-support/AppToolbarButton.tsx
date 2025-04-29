import { Button } from '@mui/material';
import * as React from 'react';
import { ReactNode } from 'react';

type ToolbarButtonProps = {
  selectedName: string;
  name: string;
  label: string | ReactNode;
  icon: ReactNode;
  setAppName: (name: string) => void;
};

export function AppToolbarButton({ selectedName, name, label, icon, setAppName }: ToolbarButtonProps) {
  return (
    <Button
      startIcon={icon}
      size={'small'}
      style={{
        textTransform: 'none'
      }}
      color="inherit"
      variant={selectedName === name ? 'outlined' : 'text'}
      onClick={() => {
        setAppName(name);
      }}
    >
      {label}
    </Button>
  );
}
