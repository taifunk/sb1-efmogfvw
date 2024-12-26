import React from 'react';
import { Card, Title, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import ListingsTable from '../components/ListingsTable';
import ListingsChart from '../components/ListingsChart';
import ListingsFilters from '../components/ListingsFilters';
import { useListingsQuery } from '../hooks/useListingsQuery';
import { useListingsFilters } from '../hooks/useListingsFilters';

export default function ListingsPage() {
  const { filters, updateFilter } = useListingsFilters();
  const { data: listings, isLoading, error } = useListingsQuery(filters);

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Error loading listings: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ListingsFilters filters={filters} onFilterChange={updateFilter} />
      
      <Card>
        <Title>Real Estate Listings</Title>
        <TabGroup>
          <TabList>
            <Tab>Table View</Tab>
            <Tab>Analytics</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ListingsTable data={listings} isLoading={isLoading} />
            </TabPanel>
            <TabPanel>
              <ListingsChart data={listings} isLoading={isLoading} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
}