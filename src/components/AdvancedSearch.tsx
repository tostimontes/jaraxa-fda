import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

const AdvancedSearch = ({ onSearch }) => {
  const [brandName, setBrandName] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [marketingStatus, setMarketingStatus] = useState('');

  const handleSearch = () => {
    const queryParts = [];
    if (brandName) {
      queryParts.push(`openfda.brand_name:${brandName}`);
    }
    if (manufacturerName) {
      queryParts.push(`openfda.manufacturer_name:${manufacturerName}`);
    }
    if (activeIngredient) {
      queryParts.push(`openfda.substance_name:${activeIngredient}`);
    }
    if (marketingStatus) {
      queryParts.push(`openfda.product_type:"HUMAN+${marketingStatus}+DRUG"`);
    }
    const query = queryParts.join('+AND+');
    onSearch(query, 'advanced');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      mb={2}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        label="Brand Name"
        variant="outlined"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          flex: { sm: 4 },
          backgroundColor: 'background.light',
          borderRadius: '4px',
        }}
      />
      <TextField
        fullWidth
        label="Manufacturer Name"
        variant="outlined"
        value={manufacturerName}
        onChange={(e) => setManufacturerName(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          flex: { sm: 4 },
          backgroundColor: 'background.light',
          borderRadius: '4px',
        }}
      />
      <TextField
        fullWidth
        label="Active Ingredient"
        variant="outlined"
        value={activeIngredient}
        onChange={(e) => setActiveIngredient(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          flex: { sm: 4 },
          backgroundColor: 'background.light',
          borderRadius: '4px',
        }}
      />
      <FormControl
        fullWidth
        sx={{
          flex: { sm: 3.5 },
          backgroundColor: 'background.light',
          borderRadius: '4px',
        }}
      >
        <InputLabel>Marketing Status</InputLabel>
        <Select
          value={marketingStatus}
          onChange={(e) => setMarketingStatus(e.target.value)}
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="PRESCRIPTION">Prescription</MenuItem>
          <MenuItem value="OTC">OTC</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default AdvancedSearch;

// TODO: no matches found trigger alternative suggestions
