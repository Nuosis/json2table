import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const MyHeadlessTable = ({ data, columns, callback, darkMode = false }) => {
  console.log("MyHeadlessTable called ... ")
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
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr 
            key={row.id} 
            style={{ 
              background: darkMode ? '#1a1a1a' : '#f7fafc'
            }}
            onClick={() => handleRowClick(row)}
          >
            {row.getVisibleCells().map(cell => (
              <td
                key={cell.id}
                style={{
                  padding: '10px',
                  borderBottom: darkMode ? '2px solid #000000' : '1px solid #e2e8f0',
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

export default MyHeadlessTable;
