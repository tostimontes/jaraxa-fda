import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Button } from '@mui/material';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';

const SimpleSearch = ({ onSearch, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (query) => {
    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?search=${query}&limit=10`,
    );
    const fuse = new Fuse(response.data.results, {
      keys: [
        'openfda.brand_name',
        'openfda.generic_name',
        'openfda.manufacturer_name',
      ],
    });
    const filteredSuggestions = fuse
      .search(query)
      .map((result) => result.item)
      .filter((item) => item.openfda.brand_name || item.openfda.generic_name);
    const uniqueSuggestions = Array.from(
      new Set(filteredSuggestions.map((a) => a.id)),
    ).map((id) => {
      return filteredSuggestions.find((a) => a.id === id);
    });
    setSuggestions(uniqueSuggestions);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (id) => {
    navigate(`/details/${id}`);
  };

  const handleSearch = () => {
    if (debouncedQuery.length > 2) {
      onSearch(debouncedQuery);
      setSuggestions([]);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <TextField
          fullWidth
          label="Search Medications"
          variant="outlined"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <List>
        {suggestions.length > 0
          ? suggestions.map((suggestion) => (
              <ListItem
                button
                key={suggestion.id}
                onClick={() => handleSelect(suggestion.id)}
              >
                <ListItemText
                  primary={suggestion.openfda.brand_name}
                  secondary={suggestion.openfda.generic_name}
                />
              </ListItem>
            ))
          : query &&
            query.length > 2 && (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
      </List>
    </div>
  );
};

export default SimpleSearch;
