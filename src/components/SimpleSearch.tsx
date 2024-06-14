import React, { useState, useEffect } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { fetchMedications } from '../api/fetchMedications';
import { useNavigate } from 'react-router-dom';

const SimpleSearch = ({ onSearch, initialQuery, query, setQuery }) => {
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (query) => {
    try {
      const data = await fetchMedications(query);
      const filteredSuggestions = data.results
        .filter(
          (item) =>
            item.openfda.brand_name?.[0] || item.openfda.generic_name?.[0],
        )
        .sort((a, b) => {
          const aRelevance =
            (a.openfda.brand_name?.includes(query) ? 1 : 0) +
            (a.openfda.generic_name?.includes(query) ? 1 : 0);
          const bRelevance =
            (b.openfda.brand_name?.includes(query) ? 1 : 0) +
            (b.openfda.generic_name?.includes(query) ? 1 : 0);
          return bRelevance - aRelevance;
        });

      setSuggestions(filteredSuggestions);

      if (filteredSuggestions.length === 0) {
        setAlternativeSuggestions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (id) => {
    navigate(`/details/${id}`);
  };

  const handleSearch = () => {
    if (debouncedQuery.length > 2) {
      onSearch(
        `openfda.brand_name:${debouncedQuery}+OR+openfda.generic_name:${debouncedQuery}`,
      );
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
      <Box sx={{ maxHeight: '200px', overflow: 'auto', mt: 2 }}>
        <List>
          {suggestions.length > 0
            ? suggestions.map((suggestion) => (
                <ListItem
                  button
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion.id)}
                >
                  <ListItemText
                    primary={`${suggestion.openfda.brand_name?.[0] || ''} (${suggestion.openfda.generic_name?.[0] || ''})`}
                    secondary={`By ${suggestion.openfda.manufacturer_name?.[0] || 'Unknown'}`}
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
      </Box>
    </div>
  );
};

export default SimpleSearch;
