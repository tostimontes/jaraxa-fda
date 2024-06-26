import { useState, useEffect, FC, ReactNode } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box,
  List,
  ListItem,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface Medication {
  id: string;
  openfda: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    product_type?: string[];
  };
}

interface SearchResultsProps {
  results: Medication[];
  spellingSuggestions: string[];
  onSearch: (query: string) => void;
  mode: string;
}

interface StyledLinkProps {
  to: string;
  children: ReactNode;
}
const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  spellingSuggestions,
  onSearch,
  mode,
}) => {
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState('brand_name_asc');
  const [filterOption, setFilterOption] = useState('');
  const [filteredResults, setFilteredResults] = useState<Medication[]>(
    results || [],
  );
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  useEffect(() => {
    if (results.length === 0) {
      const cachedResults = sessionStorage.getItem('searchResults');
      if (cachedResults) {
        setFilteredResults(JSON.parse(cachedResults));
      }
    } else {
      setFilteredResults(results);
    }
  }, [results]);

  useEffect(() => {
    applyFilters();
  }, [filterOption, results]);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setSortOption(value);
    sortResults(value);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setFilterOption(value);
    applyFilters(value);
  };

  const handleResultsPerPageChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setResultsPerPage(value);
    setPage(1);
  };

  const sortResults = (option: string) => {
    const sortedResults = [...filteredResults].sort((a, b) => {
      if (option === 'brand_name_asc') {
        return (
          a.openfda.brand_name?.[0]?.localeCompare(
            b.openfda.brand_name?.[0] || '',
          ) || 0
        );
      } else if (option === 'brand_name_desc') {
        return (
          b.openfda.brand_name?.[0]?.localeCompare(
            a.openfda.brand_name?.[0] || '',
          ) || 0
        );
      } else if (option === 'generic_name_asc') {
        return (
          a.openfda.generic_name?.[0]?.localeCompare(
            b.openfda.generic_name?.[0] || '',
          ) || 0
        );
      } else if (option === 'generic_name_desc') {
        return (
          b.openfda.generic_name?.[0]?.localeCompare(
            a.openfda.generic_name?.[0] || '',
          ) || 0
        );
      }
      return 0;
    });
    setFilteredResults(sortedResults);
  };

  const handleSearch = (query: string) => {
    onSearch(query);
  };

  const applyFilters = (value?: string) => {
    let newFilteredResults = results;
    if (value && value !== 'all') {
      newFilteredResults = results.filter((result) =>
        result.openfda.manufacturer_name?.includes(value),
      );
    }
    setFilteredResults(newFilteredResults);
  };
  const uniqueManufacturers = Array.from(
    new Set(results.map((result) => result.openfda.manufacturer_name?.[0])),
  );

  const StyledLink: FC<StyledLinkProps> = ({ to, children }) => {
    return (
      <Box
        component={Link}
        to={to}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        {children}
      </Box>
    );
  };

  return (
    <div>
      {results.length > 0 && (
        <Box
          mb={2}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <FormControl
            fullWidth
            sx={{
              flex: { sm: 4 },
              backgroundColor: 'background.light',
              borderRadius: '4px',
            }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} onChange={handleSortChange}>
              <MenuItem value={'brand_name_asc'}>
                Brand Name (Ascending)
              </MenuItem>
              <MenuItem value={'brand_name_desc'}>
                Brand Name (Descending)
              </MenuItem>
              <MenuItem value={'generic_name_asc'}>
                Generic Name (Ascending)
              </MenuItem>
              <MenuItem value={'generic_name_desc'}>
                Generic Name (Descending)
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{
              flex: { sm: 8 },
              backgroundColor: 'background.light',
              borderRadius: '4px',
            }}
          >
            <InputLabel>Filter By Manufacturer</InputLabel>
            <Select value={filterOption} onChange={handleFilterChange}>
              <MenuItem value={'all'}>All Manufacturers</MenuItem>
              {uniqueManufacturers.map((manufacturer, index) => (
                <MenuItem key={index} value={manufacturer}>
                  {manufacturer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{
              flex: { sm: 2 },
              backgroundColor: 'background.light',
              borderRadius: '4px',
            }}
          >
            <InputLabel>Results Per Page</InputLabel>
            <Select
              value={resultsPerPage}
              onChange={handleResultsPerPageChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      {filteredResults
        .slice((page - 1) * resultsPerPage, page * resultsPerPage)
        .map((result) => (
          <Card key={result.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {result.openfda.brand_name?.[0]}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ fontStyle: 'italic' }}
              >
                {result.openfda.generic_name?.[0]}
              </Typography>
              <Typography variant="body1" color="secondary">
                {result.openfda.manufacturer_name?.[0]}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color:
                    result.openfda.product_type?.[0] === 'HUMAN OTC DRUG'
                      ? 'otc.main'
                      : result.openfda.product_type?.[0] ===
                          'HUMAN PRESCRIPTION DRUG'
                        ? 'prescription.main'
                        : 'secondary',
                }}
              >
                <Box component="span" sx={{ color: 'text.primary' }}>
                  Status:{' '}
                </Box>
                {result.openfda.product_type?.[0] === 'HUMAN PRESCRIPTION DRUG'
                  ? 'Prescription'
                  : result.openfda.product_type?.[0] === 'HUMAN OTC DRUG'
                    ? 'OTC'
                    : 'N/A'}
              </Typography>
              <StyledLink to={`/details/${result.id}`}>View Details</StyledLink>
            </CardContent>
          </Card>
        ))}
      {(filteredResults.length === 0 || !filteredResults) &&
        mode === 'advanced' && (
          <Box>
            <Typography variant="body1">No results found</Typography>
          </Box>
        )}
      {(filteredResults.length === 0 || !filteredResults) &&
        mode === 'simple' && (
          <Box>
            {spellingSuggestions.length > 0 ? (
              <List>
                <ListItem>
                  <ListItemText primary="Did you mean:" />
                </ListItem>
                {spellingSuggestions.map((suggestion, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                  >
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">
                No suggestions found, try with a different word
              </Typography>
            )}
          </Box>
        )}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChangePage}
        sx={{ mb: 2 }}
      />
    </div>
  );
};

export default SearchResults;
