import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect } from 'react';
import Boot from './Boot';
import RootLayout from './screens/RootLayout';
import { Navigation } from "@toolpad/core";
import { AppProvider } from '@toolpad/core/react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import { LocalizationProvider } from "@mui/x-date-pickers";

const queryClient = new QueryClient();

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    pattern: 'splitwise',
    segment: 'splitwise',
    title: 'Splitwise',
    icon: <TimelineIcon />,
  },
];


function App() {

  useEffect(() => {
    Boot();
  }, []);



  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider
        navigation={NAVIGATION}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RootLayout />
        </LocalizationProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;