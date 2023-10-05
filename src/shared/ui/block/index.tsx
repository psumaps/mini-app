import React from 'react';
import { Paper } from '@mui/material';

interface BlockProps {
  children: React.ReactNode;
}

function Block({ children }: BlockProps) {
  return (
    <Paper
      elevation={16}
      sx={{
        borderRadius: '1em',
        padding: '1em',
      }}
    >
      {children}
    </Paper>
  );
}

export default Block;
