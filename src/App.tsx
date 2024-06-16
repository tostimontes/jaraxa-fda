import { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Button,
  Box,
  IconButton,
  Container,
} from '@mui/material';
import 'driver.js/dist/driver.css';
import { driverObj } from './utils/driverTour';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './styles/theme';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Footer from './components/Footer';
import { ToggleProvider, useToggle } from './utils/ToggleContext';

interface AppContentProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ToggleProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppContent toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      </ThemeProvider>
    </ToggleProvider>
  );
};

const AppContent: React.FC<AppContentProps> = ({ toggleTheme, isDarkMode }) => {
  const { setSimpleSearch } =
    useToggle();

  const showTour = () => {
    setSimpleSearch();
    driverObj.drive();
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '50%',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'background.default',
            },
          }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Button
        variant="contained"
        id="show-tour-button"
        onClick={showTour}
        sx={{
          position: 'fixed',
          aspectRatio: '1/1',
          bottom: 16,
          right: 16,
          zIndex: 1300,
          borderRadius: '50%',
        }}
      >
        <HelpOutlineIcon />
      </Button>
      <Router>
        <Container disableGutters maxWidth={false} sx={{ m: 0, p: 0 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<HomePage />} />
            <Route path="/details/:id" element={<DetailsPage />} />
          </Routes>
          <Footer />
        </Container>
      </Router>
    </>
  );
};

export default App;
