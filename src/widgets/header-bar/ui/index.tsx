import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

function HeaderBar({pageName} : {pageName: string}) {
  const theme = useTheme();
  return (
      <Box
          sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: '2em 1em 0em',
              backgroundColor: theme.palette.background.default,
          }}
      >
          <Typography variant="h2">{pageName}</Typography>
      </Box>
  );
}

export default HeaderBar;
