import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import ListingsPage from './pages/ListingsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <ListingsPage />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;