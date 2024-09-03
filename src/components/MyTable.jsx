import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { handleExpandedRow } from './MyTable.Utils';

const MyTable = ({ data, columns, callback, darkMode = false, searchBarMargin = false, obj }) => {
  //console.log("MyTable Called")
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),  
    getExpandedRowModel: getExpandedRowModel(),  // Include expanded rows functionality
  });
  //console.log({table})

  // Handle row click
  const handleRowClick = (row) => {
    if (callback) {
      callback(row.original);
    }
  };
  
  const isNaNValue = (value) => {
    return value === null || value === undefined || value === '' || value === '$NaN' || value === 'NaN' || (typeof value === 'number' && isNaN(value));
  };


  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{
                  position: 'sticky',
                  top: searchBarMargin ? 53 : 0,
                  borderBottom: darkMode ? '2px solid #1a1a1a' : '2px solid #e2e8f0',
                  background: darkMode ? '#4a5568' : '#cbd5e0',
                  color: darkMode ? '#e2e8f0' : '#4a5568',
                  fontWeight: '600',
                  textAlign: 'left',
                  padding: '10px',
                  zIndex: 5,
                  cursor: 'pointer',
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <React.Fragment key={row.id}>
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
                {isNaNValue(cell.getValue())
                  ? ''
                  : flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            {row.getIsExpanded() && (
              <tr>
                <td colSpan={columns.length} style={{ paddingLeft: '20px', background: darkMode ? '#222' : '#fff' }}>
                  {handleExpandedRow(row.original.cellValue, callback, darkMode, searchBarMargin)}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default MyTable;
