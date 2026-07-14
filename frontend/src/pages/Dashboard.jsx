import { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import SummaryWidgets from '../components/SummaryWidgets';
import InsightsChart from '../components/InsightsChart';
import DataTable from '../components/DataTable';
import FilterToolbar from '../components/FilterToolbar';

export default function Dashboard() {
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  return (
    <Stack spacing={4}>
      <FilterToolbar filters={filters} onFilterChange={handleFilterChange} />

      <SummaryWidgets filters={filters} />

      <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1, width: '100%', overflow: 'hidden' }}>
        <Typography variant="h6" mb={2}>Traffic Insights</Typography>
        <InsightsChart filters={filters} />
      </Box>

      <Box sx={{ bgcolor: 'white', p: 0, borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
        <DataTable 
          filters={filters} 
          page={page} 
          setPage={setPage} 
          rowsPerPage={rowsPerPage} 
          setRowsPerPage={setRowsPerPage} 
        />
      </Box>
    </Stack>
  );
}
