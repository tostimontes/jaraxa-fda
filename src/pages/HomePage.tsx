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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <Box
        sx={{
          position: scrolled ? 'sticky' : 'static',
          top: 0,
          zIndex: 1100,
          width: '100%',
          backgroundColor: scrolled ? 'background.navbar' : 'transparent',
          boxShadow: scrolled ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
          py: scrolled ? 0.5 : 4,
          textAlign: 'center',
          marginY: 0,
        }}
      >
        <Typography
          variant="h1"
          color="primary"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            fontWeight: { xs: 'bold', sm: 'bold', md: 'normal' },
            marginY: { xs: 2, sm: 2, md: 0 },
          }}
        >
          Jaraxa FDA Search
        </Typography>
      </Box>
      <Container
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '100%', md: '75%', xl: '50%' },
          mx: 'auto',
        }}
      >
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
        <Box mt={4} sx={{ bgcolor: 'background.default' }}>
          {loading ? (
            <Box
              display="flex"
              alignItems="center"
            >
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
    </>
  );
};

export default HomePage;
