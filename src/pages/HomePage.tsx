import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SimpleSearch from '../components/SimpleSearch';
import AdvancedSearch from '../components/AdvancedSearch';
import SearchResults from '../components/SearchResults';
import { fetchMedications } from '../api/fetchMedications';
import { getSuggestionsFromRxNorm } from '../api/rxnormApi';
import ScrollToTopButton from '../components/ScrollToTopButton';

const HomePage = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [spellingSuggestions, setSpellingSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';

  useEffect(() => {
    const cachedResults = sessionStorage.getItem('searchResults');
    if (cachedResults) {
      setResults(JSON.parse(cachedResults));
    }
    setQuery('');
  }, [location.search]);

  const handleSearch = async (query, mode = 'simple') => {
    setLoading(true);
    sessionStorage.removeItem('searchResults');
    sessionStorage.removeItem('searchQuery');
    try {
      let constructedQuery;

      if (mode === 'simple') {
        constructedQuery = `openfda.brand_name:${query}+OR+openfda.generic_name:${query}`;
      } else {
        constructedQuery = query;
      }

      const response = await fetchMedications(constructedQuery);

      if (response.results && response.results.length > 0) {
        const filteredResults = response.results.filter(
          (result) =>
            result.openfda.brand_name?.[0] || result.openfda.generic_name?.[0],
        );
        setResults(filteredResults);

        // ! TO RESEARCH: limiting the number of results to store avoided the crash after "DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'searchResults' exceeded the quota."

        const topResults = filteredResults.slice(0, 20);
        sessionStorage.setItem('searchResults', JSON.stringify(topResults));
      } else {
        const corrections = await getSuggestionsFromRxNorm(query);
        setSpellingSuggestions(corrections);
        sessionStorage.removeItem('searchResults');
      }
    } catch (error) {
      console.error('Search error:', error);
      const corrections = await getSuggestionsFromRxNorm(query);
      setSpellingSuggestions(corrections);
      sessionStorage.removeItem('searchResults');

      setResults([]);
    } finally {
      setLoading(false);
    }
    setQuery('');
  };

  const handleToggleSearchMode = () => {
    setIsAdvanced(!isAdvanced);
    setResults([]);
    sessionStorage.removeItem('searchResults');
    sessionStorage.removeItem('searchQuery');
  };

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Jaraxa FDA Search
      </Typography>
      <FormControlLabel
        control={
          <Switch checked={isAdvanced} onChange={handleToggleSearchMode} />
        }
        label="Advanced Search"
      />
      {isAdvanced ? (
        <AdvancedSearch onSearch={handleSearch} />
      ) : (
        <SimpleSearch
          onSearch={handleSearch}
          initialQuery={initialQuery}
          query={query}
          setQuery={setQuery}
        />
      )}
      <Box mt={4}>
        {loading ? (
          <Box display="flex" alignItems="center">
            <CircularProgress />
            <Box ml={2}>Loading...</Box>
          </Box>
        ) : (
          <SearchResults
            results={results}
            onSearch={handleSearch}
            spellingSuggestions={spellingSuggestions}
            mode={isAdvanced ? 'advanced' : 'simple'}
          />
        )}
      </Box>
      <ScrollToTopButton />
    </Container>
  );
};

export default HomePage;
