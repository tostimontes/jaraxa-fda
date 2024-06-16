import { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';

const HistoryDropdown = ({ value, onChange, label, onKeyPress }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const handleInputChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Autocomplete
      freeSolo
      fullWidth
      value={value}
      onChange={(event, newValue) => handleInputChange(event, newValue)}
      onInputChange={(event, newValue) => handleInputChange(event, newValue)}
      options={history}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          onKeyPress={onKeyPress}
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: '4px',
          }}
        />
      )}
    />
  );
};

export default HistoryDropdown;
