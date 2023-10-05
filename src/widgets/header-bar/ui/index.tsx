import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import BackIcon from '~/shared/assets/back.svg?react';
import MenuIcon from '~/shared/assets/menu-dots.svg?react';

function HeaderBar() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1em 1.5em',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <BackIcon />
      <Typography variant="h5" color={theme.palette.text.primary}>
        Название страницы
      </Typography>
      <MenuIcon />
    </Box>
  );
}

export default HeaderBar;
