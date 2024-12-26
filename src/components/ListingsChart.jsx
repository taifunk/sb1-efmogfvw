import React from 'react';
import { BarChart, Card, Title } from '@tremor/react';

export default function ListingsChart({ data, isLoading }) {
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const chartData = data?.reduce((acc, listing) => {
    const priceRange = Math.floor(listing.price / 50000) * 50000;
    const range = `€${priceRange.toLocaleString()} - €${(priceRange + 50000).toLocaleString()}`;
    
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const formattedData = Object.entries(chartData || {}).map(([range, count]) => ({
    range,
    count
  }));

  return (
    <Card>
      <Title>Price Distribution</Title>
      <BarChart
        data={formattedData}
        index="range"
        categories={["count"]}
        colors={["blue"]}
        yAxisWidth={48}
      />
    </Card>
  );
}