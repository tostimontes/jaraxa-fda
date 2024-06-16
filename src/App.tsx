import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Button, Box, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './styles/theme';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
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
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<HomePage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
