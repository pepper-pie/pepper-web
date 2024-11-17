import { useEffect } from 'react';
import RootLayout from './screens/RootLayout';
import Boot from './Boot';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


function App() {

  useEffect(() => {
      Boot()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout />
    </QueryClientProvider>
  );
}

export default App;
