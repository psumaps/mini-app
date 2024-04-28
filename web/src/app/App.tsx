import React from 'react';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/500.css';

import router from '~/app/router.tsx';
import '../tw.css';

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
