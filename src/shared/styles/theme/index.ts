import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D01F36',
    },
    background: {
      default: '#EBEBEB',
      paper: '#F9F9F9',
    },
    text: {
      primary: '#444444',
      secondary: '#7D7D7D',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
    h5: {
      fontWeight: 700,
    },
    caption: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 700,
      textTransform: 'inherit',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5em',
        },
      },
    },
  },
});

export default theme;
