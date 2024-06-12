import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

const AdvancedSearch = ({ onSearch }) => {
  const [drugName, setDrugName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [drugClass, setDrugClass] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');

  const handleSearch = () => {
    const query =
      `${drugName} ${manufacturer} ${drugClass} ${activeIngredient}`.trim();
    onSearch(query);
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Drug Name"
        variant="outlined"
        value={drugName}
        onChange={(e) => setDrugName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Manufacturer"
        variant="outlined"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel>Drug Class</InputLabel>
        <Select
          value={drugClass}
          onChange={(e) => setDrugClass(e.target.value)}
        >
          <MenuItem value={'class1'}>Class 1</MenuItem>
          <MenuItem value={'class2'}>Class 2</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Active Ingredient"
        variant="outlined"
        value={activeIngredient}
        onChange={(e) => setActiveIngredient(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default AdvancedSearch;
