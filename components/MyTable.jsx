import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const MyTable = ({ data, columns, callback }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handle row click
  const handleRowClick = (row) => {
    if (callback) {
      callback(row.original); // Return the original data for the clicked row
    }
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                style={{
                  borderBottom: '2px solid #e2e8f0',
                  background: '#cbd5e0',
                  color: '#4a5568',
                  fontWeight: '600',
                  textAlign: 'left',
                  padding: '10px',
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr 
            key={row.id} 
            style={{ background: row.id % 2 ? '#f7fafc' : '#ffffff' }}
            onClick={() => handleRowClick(row)} 
          >
            {row.getVisibleCells().map(cell => (
              <td
                key={cell.id}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#2d3748',
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MyTable;
