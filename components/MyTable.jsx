import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const MyTable = ({ data, darkMode = false, onRowClick, renderCell }) => {
  const [expandedEmailRows, setExpandedEmailRows] = useState({});

  const extractHeadings = () => {
    if (data.length === 0) return [];
    const firstRow = data[0];
    return Object.keys(firstRow);
  };

  const handleEmailClick = (e, rowIndex) => {
    e.stopPropagation();
    setExpandedEmailRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const headings = extractHeadings();

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headings.map((heading, index) => (
            <th
              key={index}
              style={{
                position: 'sticky',
                top: 0,
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
              {heading.charAt(0).toUpperCase() + heading.slice(1)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr
              style={{ background: darkMode ? '#1a1a1a' : '#f7fafc' }}
              onClick={() => onRowClick && onRowClick(rowIndex)}
            >
              {headings.map((heading, columnIndex) => {
                const cellValue = renderCell ? renderCell(rowIndex, columnIndex, row[heading], heading) : row[heading];
                return (
                  <td
                    key={columnIndex}
                    style={{
                      padding: '10px',
                      borderBottom: darkMode ? '2px solid #000000' : '1px solid #e2e8f0',
                      color: darkMode ? '#cbd5e0' : '#2d3748',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {Array.isArray(cellValue) && cellValue.length > 1 ? (
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '24px' }}>{cellValue[0]}</span>
                        <FaEllipsisV
                          onClick={(e) => handleEmailClick(e, rowIndex)}
                          style={{
                            cursor: 'pointer',
                            color: darkMode ? '#e2e8f0' : '#4a5568',
                            fontSize: '1.2rem',
                            position: 'absolute',
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        />
                        {expandedEmailRows[rowIndex] && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            backgroundColor: darkMode ? '#2d3748' : '#ffffff',
                            color: darkMode ? '#e2e8f0' : '#2d3748',
                            padding: '10px',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            zIndex: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                            marginTop: '2px',
                          }}>
                            {cellValue.slice(1).map((email, index) => (
                              <div key={index} style={{ padding: '5px 0' }}>
                                {email}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      cellValue
                    )}
                  </td>
                );
              })}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default MyTable;
