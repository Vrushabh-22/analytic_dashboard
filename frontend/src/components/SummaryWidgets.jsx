import { Box, Card, CardContent, Typography, CircularProgress, Stack } from '@mui/material';
import { useQuery } from 'react-query';
import { makeGetRequest } from '../api/client';
import { formatNumber } from '../utils';



export default function SummaryWidgets({ filters }) {
  const { data, isLoading, error } = useQuery(
    ['analyticsSummary', filters],
    () => makeGetRequest('/analytics/summary/', {}, filters)
  );

  const metrics = [
    {
      label: 'Total Records',
      value: formatNumber(data?.total_records || 0),
      color: '#3b82f6'
    },
    {
      label: 'Total Clicks',
      value: formatNumber(data?.total_clicks || 0),
      color: '#10b981'
    },
    {
      label: 'Average CTR',
      value: `${(data?.average_ctr || 0).toFixed(2)}%`,
      color: '#8b5cf6'
    },
    {
      label: 'Average Rank',
      value: (data?.average_rank || 0).toFixed(1),
      color: '#f59e0b'
    },
  ];

  if (isLoading) return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Failed to load summary metrics</Typography>;

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%' }}>
      {metrics.map((metric) => (
        <Card key={metric.label} sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {metric.label}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: metric.color }}>
              {metric.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
