import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';

function EtisCard() {
  const theme = useTheme();

  return (
    <Button
      sx={{
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: '50px',
        alignItems: 'center',
        display: 'flex',
        height: '3em',
        margin: '1em 0em 1em',
        width: '100%',
      }}
      variant="contained"
    >
      <Typography variant="h5" color={theme.palette.primary.main}>
        Привязать профиль ЕТИС
      </Typography>
    </Button>
  );
}

export default EtisCard;
