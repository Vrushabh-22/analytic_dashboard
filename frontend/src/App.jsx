import { CssBaseline, ThemeProvider, createTheme, Box, Typography, Stack } from '@mui/material';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack sx={{ minHeight: '100vh' }}>
        <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', p: 2 }}>
          <Typography variant="h6" component="h1" fontWeight="bold">
            Analytics Dashboard
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, p: 6, mx: 'auto', width: '100%' }}>
          <Dashboard />
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
