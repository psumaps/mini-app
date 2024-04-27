import React from 'react';
import { Box, Button } from '@mui/material';

function ProfileMenu() {
  return (
    <>
      <Box py="1em">
        <Button
          variant="contained"
          sx={{
            width: '100%',
          }}
        >
          Мои купоны
        </Button>
      </Box>
      <Box />
    </>
  );
}

export default ProfileMenu;
