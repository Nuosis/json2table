import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const MyTable = ({ data, columns, callback, darkMode=false }) => {
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
                  position: 'sticky',
                  top: 53,
                  borderBottom: darkMode ? '2px solid #000000' : '2px solid #e2e8f0', // Conditional border color
                  background: darkMode ? '#4a5568' : '#cbd5e0', // Dark mode background
                  color: darkMode ? '#e2e8f0' : '#4a5568', // Dark mode text color
                  fontWeight: '600',
                  textAlign: 'left',
                  padding: '10px',
                  zIndex: 5
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
            style={{ 
              background: darkMode 
                ? (row.id % 2 ? '#1a1a1a' : '#000000') // Dark mode alternating row colors
                : (row.id % 2 ? '#f7fafc' : '#ffffff'), // Light mode alternating row colors
            }}
            onClick={() => handleRowClick(row)} 
          >
            {row.getVisibleCells().map(cell => (
              <td
                key={cell.id}
                style={{
                  padding: '10px',
                  borderBottom: darkMode ? '1px solid #000000' : '2px solid #e2e8f0',
                  color: darkMode ? '#cbd5e0' : '#2d3748',
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
