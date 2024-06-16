import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { fetchMedications } from '../api/fetchMedications';
import { getSuggestionsFromRxNorm } from '../api/rxnormApi';
import HistoryDropdown from './HistoryDropdown';

const SimpleSearch = ({ onSearch, initialQuery, query, setQuery }) => {
  const [debouncedQuery] = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [spellingSuggestions, setSpellingSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
      setNoResults(false);
      setSpellingSuggestions([]);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const constructedQuery = `openfda.brand_name:${query}+OR+openfda.generic_name:${query}`;
      const response = await fetchMedications(constructedQuery);

      if (response.results && response.results.length > 0) {
        const filteredResults = response.results.filter(
          (result) =>
            result.openfda.brand_name?.[0] || result.openfda.generic_name?.[0],
        );
        setSuggestions(filteredResults);
        setNoResults(false);
        setSpellingSuggestions([]);
      } else {
        const corrections = await getSuggestionsFromRxNorm(query);
        setNoResults(true);
        setSpellingSuggestions(corrections);
      }
    } catch (error) {
      console.error('Search error:', error);

      const corrections = await getSuggestionsFromRxNorm(query);

      setNoResults(true);
      setSpellingSuggestions(corrections);
    }
    setLoading(false);
  };

  const handleInputChange = (newValue) => {
    setQuery(newValue);
    if (newValue === '') {
      setSuggestions([]);
      setNoResults(false);
      setSpellingSuggestions([]);
    }
  };

  const handleSelect = (id) => {
    navigate(`/details/${id}`);
  };

  const addSearchToHistory = (searchTerm) => {
    const storedHistory =
      JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!storedHistory.includes(searchTerm)) {
      const updatedHistory = [searchTerm, ...storedHistory.slice(0, 9)];
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleSearch = () => {
    if (debouncedQuery.length > 2) {
      onSearch(debouncedQuery, 'simple');
      setSuggestions([]);
      setSpellingSuggestions([]);
      addSearchToHistory(debouncedQuery);
    } else {
      setSuggestions([]);
      setSpellingSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSpellingSuggestionClick = (suggestion) => {
    onSearch(
      `openfda.brand_name:${suggestion}+OR+openfda.generic_name:${suggestion}`,
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <HistoryDropdown
          value={query}
          onChange={handleInputChange}
          label="Search Medications"
          onKeyPress={handleKeyPress}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Box
        sx={{
          maxHeight: '200px',
          overflow: 'auto',
          backgroundColor: 'background.light',
        }}
      >
        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <CircularProgress size={24} />
            <Box display={'flex'} ml={2} mb={2}>Generating suggestions...</Box>
          </Box>
        ) : (
          <List sx={suggestions.length === 0 && { pt: 0, pb: 0 }}>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
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
            ) : noResults ? (
              <>
                <ListItem>
                  <ListItemText
                    primary={
                      spellingSuggestions.length > 0
                        ? 'No results found. Did you mean:'
                        : 'No suggestions found. Try with a different name'
                    }
                  />
                </ListItem>
                {spellingSuggestions.map((suggestion, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleSpellingSuggestionClick(suggestion)}
                  >
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </>
            ) : (
              query &&
              query.length > 2 && (
                <ListItem>
                  <ListItemText primary="No results found" />
                </ListItem>
              )
            )}
          </List>
        )}
      </Box>
    </div>
  );
};

export default SimpleSearch;
