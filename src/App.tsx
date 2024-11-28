import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from 'react';
import Boot from './Boot';
import RootLayout from './screens/RootLayout';
import { useNotifications } from "@toolpad/core";


function App() {

  const { show } = useNotifications();

  // Configure React Query
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        // Automatically trigger notifications for all mutation failures
        show(error.message, {
          autoHideDuration: 3000,
          severity: 'error',
        });
      },
    }),
    queryCache: new QueryCache({
      onError: (error) => {
        console.log({ error })
        // Automatically trigger notifications for all mutation failures
        show(error.message, {
          autoHideDuration: 3000,
          severity: 'error'
        });
      },
    })
  });

  useEffect(() => {
    Boot();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RootLayout />
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;