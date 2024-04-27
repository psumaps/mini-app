import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/500.css';

import router from '~/app/router.tsx';
import theme from '~/shared/styles/theme';
import '../tw.css';

function App() {
  return (
    <div>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
