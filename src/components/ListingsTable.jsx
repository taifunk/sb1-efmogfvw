import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

export default function ListingsTable({ data, isLoading }) {
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Address</TableHeaderCell>
          <TableHeaderCell>Price</TableHeaderCell>
          <TableHeaderCell>Area (m²)</TableHeaderCell>
          <TableHeaderCell>Rooms</TableHeaderCell>
          <TableHeaderCell>Listed</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data?.map((listing) => (
          <TableRow key={listing.id}>
            <TableCell>{listing.address}</TableCell>
            <TableCell>€{listing.price.toLocaleString()}</TableCell>
            <TableCell>{listing.area_m2}</TableCell>
            <TableCell>{listing.rooms || 'N/A'}</TableCell>
            <TableCell>
              {listing.listing_time
                ? new Date(listing.listing_time).toLocaleDateString()
                : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}