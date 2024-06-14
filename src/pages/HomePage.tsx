import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SimpleSearch from '../components/SimpleSearch';
import AdvancedSearch from '../components/AdvancedSearch';
import SearchResults from '../components/SearchResults';
import { fetchMedications } from '../api/fetchMedications';

const HomePage = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';

  useEffect(() => {
    const cachedResults = localStorage.getItem('searchResults');
    if (cachedResults) {
      setResults(JSON.parse(cachedResults));
    }
    setQuery('');
  }, [location.search]);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const data = await fetchMedications(query);
      const filteredResults = data.results.filter(
        (result) =>
          result.openfda.brand_name?.[0] || result.openfda.generic_name?.[0],
      );
      setResults(filteredResults);
      localStorage.setItem('searchQuery', query);
      localStorage.setItem('searchResults', JSON.stringify(filteredResults));
      // navigate(`/search?query=${query}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
    setQuery('');
  };

  const handleToggleSearchMode = () => {
    setIsAdvanced(!isAdvanced);
    setResults([]);
    localStorage.removeItem('searchResults');
    localStorage.removeItem('searchQuery');
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
        {loading ? <p>Loading...</p> : <SearchResults results={results} />}
      </Box>
    </Container>
  );
};

export default HomePage;
