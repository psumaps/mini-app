import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#BDBDBD',
      contrastText: '#333333',
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
    h1: {
      fontSize: '21px',
      fontWeight: 700,
    },
    h2: {
      fontSize: '18px',
      fontWeight: 700,
    },
    h3: {
      fontSize: '16px',
      fontWeight: 700,
    },
    h4: {
      fontSize: '14px',
      fontWeight: 700,
    },
    h5: {
      fontSize: '12px',
      fontWeight: 700,
    },
    /*    text: {
      fontSize: '16px',
      fontWeight: 500,
    },*/
    caption: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 500,
      fontSize: '16px',
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
