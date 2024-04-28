import React from 'react';
import { Container, useTheme } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  return (
    <div
      style={{
        background: theme.palette.background.default,
        height: '90vh',
      }}
    >
      <Container
        sx={{
          background: theme.palette.background.default,
          padding: '2em',
        }}
      >
        {children}
      </Container>
    </div>
  );
}

export default Layout;
