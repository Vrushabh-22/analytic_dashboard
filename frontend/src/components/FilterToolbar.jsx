import { useState, useEffect, useMemo } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Stack, Button, IconButton } from '@mui/material';
import debounce from 'lodash/debounce';
import { FILTER_CONFIGS } from '../utils';
import CloseIcon from '@mui/icons-material/Close';

export default function FilterToolbar({ filters, onFilterChange }) {
  const [search, setSearch] = useState(filters.keyword || '');

  const debouncedSearch = useMemo(
    () => debounce((keyword) => {
      onFilterChange({ keyword });
    }, 500),
    [onFilterChange]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'rank_range') {
      if (value === '') onFilterChange({ rank_min: '', rank_max: '', rank_range: '' });
      else if (value === 'top10') onFilterChange({ rank_min: 1, rank_max: 10, rank_range: value });
      else if (value === '11-50') onFilterChange({ rank_min: 11, rank_max: 50, rank_range: value });
      else if (value === '51-100') onFilterChange({ rank_min: 51, rank_max: 100, rank_range: value });
    } else {
      onFilterChange({ [key]: value });
    }
  };

  const handleClearAll = () => {
    setSearch('');
    debouncedSearch.cancel();
    onFilterChange({
      keyword: '',
      category: '',
      status: '',
      device_type: '',
      source_type: '',
      rank_range: '',
      rank_min: '',
      rank_max: ''
    });
  };

  return (
    <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" alignItems="center" sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
      <TextField
        label="Search Keywords"
        variant="outlined"
        size="small"
        value={search}
        onChange={handleSearchChange}
        sx={{ minWidth: 200, flexGrow: 1 }}
        InputProps={{
          endAdornment: search ? (
            <IconButton size="small" onClick={() => { 
                setSearch('')
                debouncedSearch('') 
              }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : null
        }}
      />

      {FILTER_CONFIGS().map(config => (
        <FormControl key={config.key} size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{config.label}</InputLabel>
          <Select
            value={filters[config.key] || ''}
            label={config.label}
            onChange={(e) => handleFilterChange(config.key, e.target.value)}
          >
            <MenuItem value=""><em>{config.allLabel}</em></MenuItem>
            {config.options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Button 
        variant="text" 
        color="secondary" 
        onClick={handleClearAll}
        sx={{ ml: 'auto !important', minWidth: 'auto' }}
      >
        Clear All
      </Button>
    </Stack>
  );
}
