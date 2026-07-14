import  { useState } from 'react';
import {
  Box, CircularProgress, Typography, Chip,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import Chart from 'react-apexcharts';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '../api/client';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { METRIC_CONFIG } from '../utils';

export default function InsightsChart({ filters }) {
  const queryClient = useQueryClient();
  const [activeMetric, setActiveMetric] = useState('search_volume');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({
    date: '',
    title: '',
    description: ''
  });

  const handleOpenDialog = (annotation = null) => {
    if (annotation) {
      setEditingId(annotation.id);
      setFormValues({
        date: annotation.date,
        title: annotation.title,
        description: annotation.description
      });
    } else {
      setEditingId(null);
      const today = new Date().toISOString().split('T')[0];
      setFormValues({
        date: today,
        title: '',
        description: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const { data: chartData, isLoading, error } = useQuery(
    ['analyticsChart', filters],
    () => makeGetRequest('/analytics/chart/', {}, filters)
  );

  const { data: annotations } = useQuery(
    ['annotations'],
    () => makeGetRequest('/annotations/')
  );

  const { mutate: createAnnotation, isLoading: isCreating } = useMutation(
    (data) => makePostRequest('/annotations/', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('annotations');
        toast.success("Successfully created annotation!");
      },
      onError: () => {
        toast.error("Something went wrong. Contact your administrator");
      }
    }
  );

  const { mutate: updateAnnotation, isLoading: isUpdating } = useMutation(
    ({ id, ...data }) => makePutRequest(`/annotations/${id}/`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('annotations');
        toast.success("Successfully updated annotation!");
      },
      onError: () => {
        toast.error("Something went wrong. Contact your administrator");
      }
    }
  );

  const { mutate: deleteAnnotation, isLoading: isDeleting } = useMutation(
    (id) => makeDeleteRequest(`/annotations/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('annotations');
        toast.success("Successfully deleted annotation!");
      },
      onError: () => {
        toast.error("Something went wrong. Contact your administrator");
      }
    }
  );

  const handleSaveAnnotation = () => {
    if (editingId) {
      updateAnnotation({ id: editingId, ...formValues }, {
        onSuccess: handleCloseDialog
      });
    } else {
      createAnnotation(formValues, {
        onSuccess: handleCloseDialog
      });
    }
  };

  const handleDeleteAnnotation = () => {
    if (editingId && window.confirm("Delete this annotation?")) {
      deleteAnnotation(editingId, {
        onSuccess: handleCloseDialog
      });
    }
  };

  if (!chartData || chartData.length === 0) {
    if (isLoading) return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Failed to load chart data</Typography>;
    return <Typography>No data available for chart</Typography>;
  }

  const activeConfig = METRIC_CONFIG[activeMetric];

  // Map dates for quick O(1) lookup
  const chartDataMap = {};
  chartData.forEach(item => {
    chartDataMap[item.date] = item;
  });

  // 1. Line Series Data
  const lineData = chartData.map(item => [
    new Date(item.date).getTime(),
    item[activeConfig.dataKey]
  ]);

  const series = [{
    name: activeConfig.label.toUpperCase(),
    type: 'line',
    data: lineData
  }];

  // 2. Default Y value for annotations missing data points
  const maxMetricValue = Math.max(...chartData.map(item => item[activeConfig.dataKey] || 0));

  // 3. ApexCharts Options
  const chartOptions = {
    chart: {
      height: 400,
      zoom: { enabled: false },
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: [activeConfig.chartColor],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          if (activeMetric === 'search_volume' || activeMetric === 'clicks') {
            return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0);
          }
          return value.toFixed(2);
        }
      }
    },
    tooltip: {
      x: { format: 'dd MMM yyyy' },
      y: {
        formatter: function (value) {
          if (activeMetric === 'search_volume' || activeMetric === 'clicks') {
            return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(2);
          }
          return value.toFixed(2); // Fix value to exactly 2 decimal places
        },
        title: {
          formatter: () => {
            // Force the tooltip title to be the active metric to bypass ApexCharts series caching bugs
            return activeConfig.label.toUpperCase() + ':';
          }
        }
      }
    },
    annotations: {
      points: (annotations || []).map(ann => {
        const dataItem = chartDataMap[ann.date];
        const yVal = dataItem ? dataItem[activeConfig.dataKey] : maxMetricValue;

        return {
          x: new Date(ann.date).getTime(),
          y: yVal,
          marker: {
            size: 6,
            fillColor: '#fff',
            strokeColor: '#ef4444',
            radius: 2,
          },
          label: {
            borderColor: '#ef4444',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#ef4444',
              padding: { left: 5, right: 5, top: 5, bottom: 5 },
            },
            text: ann.title,
            // Native click handler via closure!
            click: function () {
              handleOpenDialog(ann);
            }
          }
        };
      })
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(METRIC_CONFIG).map(([key, config]) => (
            <Chip
              key={key}
              label={config.label}
              color={activeMetric === key ? config.chipColor : "default"}
              onClick={() => setActiveMetric(key)}
            />
          ))}
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={() => handleOpenDialog()}>
          Add Annotation
        </Button>
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto', pb: 2 }}>
        <Box sx={{ minWidth: 800, position: 'relative' }}>
          {isLoading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }} />}
          <Chart
            options={chartOptions}
            series={series}
            height={400}
            width="100%"
          />
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Annotation" : "Add Annotation"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formValues.date}
              onChange={(e) => setFormValues({ ...formValues, date: e.target.value })}
              fullWidth
            />
            <TextField
              label="Title"
              value={formValues.title}
              onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={formValues.description}
              onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          {editingId ? (
            <Button color="error" onClick={handleDeleteAnnotation} disabled={isDeleting} startIcon={<DeleteIcon />}>
              Delete
            </Button>
          ) : <Box />}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveAnnotation}
              disabled={!formValues.date || !formValues.title || isCreating || isUpdating}
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
