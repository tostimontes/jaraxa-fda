import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        mt: 'auto',
        backgroundColor: 'background',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Link
        href="https://github.com/tostimontes"
        target="_blank"
        rel="noopener"
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': {
            color: 'primary.link',
          },
        }}
      >
        <GitHubIcon sx={{ mr: 1 }} />
        <Typography variant="body1">by tostimontes</Typography>
      </Link>
    </Box>
  );
};

export default Footer;
