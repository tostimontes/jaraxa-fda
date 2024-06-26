import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#81c8f8',
      link: '#3eadf7',
    },
    secondary: {
      main: '#ffab91',
    },
    complementary: {
      main: '#a5d6a7',
    },
    background: {
      default: '#d9d9d9',
      light: '#f0f0f0',
      navbar: '#8f8f8f',
      paper: '#fcfcfc',
    },
    otc: {
      main: '#4caf50',
      contrastText: '#ffffff',
    },
    prescription: {
      main: '#f44336',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0288d1',
    },
    secondary: {
      main: '#ff7043',
    },
    complementary: {
      main: '#4caf50',
    },
    background: {
      default: '#121212',
      light: '#363636',
      navbar: '#131313',
      paper: '#1e1e1e',
    },
    otc: {
      main: '#66bb6a',
      contrastText: '#000000',
    },
    prescription: {
      main: '#ef5350',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export { lightTheme, darkTheme };
