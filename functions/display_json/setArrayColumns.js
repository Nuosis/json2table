import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

// Helper function to create column definitions for an array
const setArrayColumns = (obj, onRenderUnderRow) => {
  return [
    {
      id: 'id', // A single column since it's an array
      header: obj?obj:'Values', // General name of the header
      accessorKey: obj?obj:'Values', // Since we have mixed types, just return the row itself
      cell: info => {
        const value = info.getValue();
        let displayValue;

        if (Array.isArray(value)) {
          displayValue = value[0]; // Show only the first item if it's an array
        } else {
          displayValue = value; // Show the string value directly
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{displayValue}</span>
            {Array.isArray(value) && value.length > 1 && (
              <button
                style={{
                  marginLeft: '5px',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click from being triggered
                  const path = `[0]`; // Simplified path since it's an array
                  onRenderUnderRow({ path, json: value });
                }}
              >
                <FaEllipsisV style={{ width: '16px', height: '16px' }} />
              </button>
            )}
          </div>
        );
      }
    }
  ];
};

export default setArrayColumns;
