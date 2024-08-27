import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';

const MyTable = ({ data, updateData, columns, callback, darkMode, onRowClick, expandedRows, searchBar }) => {
  console.log("MyTable called ... ", { data });

  const [tableData, setTableData] = useState(data); // Maintain internal state for data

  // Update function for external data changes
  const handleDataUpdate = (newData) => {
    setTableData(newData); // Update internal state
  };

  // Integrate updateData prop with internal state
  useEffect(() => {
    if (updateData) {
      handleDataUpdate(updateData); // Update internal data if provided
    }
  }, [updateData]);

  const table = useReactTable({
    data: tableData, // Use internal state for data
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(), // Include expanded rows functionality
  });

  // Handle row click
  const handleRowClick = (row) => {
    if (callback) {
      callback(row.original);
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
                onClick={() => header.column.getToggleSortingHandler()}
                style={{
                  position: 'sticky',
                  top: searchBar ? 53 : 0,
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
    <tr key={row.id} style={{ background: darkMode ? '#1a1a1a' : '#f7fafc' }} onClick={() => handleRowClick(row)}>
      {/* ... existing cell rendering ... */}
    </tr>
    {expandedRows[row.id] && ( // Check if the current row is expanded
      <tr>
        <td colSpan={columns.length} style={{ paddingLeft: '20px', background: darkMode ? '#222' : '#fff' }}>
          {/* Render the expanded content here */}
          {row.original.emails && ( // Check if the 'emails' property exists
            <ul>
              {row.original.emails.map(email => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          )}
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