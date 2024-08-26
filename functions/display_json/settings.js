import { toTitleCase, formatCellValue } from './utils';
import { FaEllipsisV } from 'react-icons/fa';

//HELPER FUNCTIONS
//Helper function to create column definitions
const createColumnDef = (key, formatStyle, onRenderUnderRow) => ({
  id: key,
  header: toTitleCase(key),
  accessorKey: key,
  cell: info => {
    const value = info.getValue();
    const displayValue = Array.isArray(value) ? value[0] : value; // Show only the first item if it's an array
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{formatCellValue(displayValue, formatStyle)}</span>
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
              const path = '[0]'&&{key};
              console.log({path})
              onRenderUnderRow({ path, json: value });
            }}
          >
            <FaEllipsisV style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>
    );
  }
});


// Updated handleSettings function
const handleSettings = (data, settings, onRenderUnderRow) => {
  const { hide = [], sortOrder = [], format = [] } = settings;

  // Create a lookup map for formatting
  const formatMap = format.reduce((acc, { key, style }) => {
    acc[key] = style;
    return acc;
  }, {});

  // Step 1: Filter out columns to omit based on `settings.hide`
  const filteredKeys = Object.keys(data[0])
    .filter(key => !hide.some(prefix => key.startsWith(prefix)));

  // Step 2: Sort the columns based on `settings.sortOrder`
  const orderedColumns = sortOrder
    .filter(key => filteredKeys.includes(key)) // Only include keys that are not hidden and are in sortOrder
    .map(key => createColumnDef(key, formatMap[key], onRenderUnderRow));

  // Step 3: Include the remaining columns that weren't specified in `sortOrder`
  const remainingColumns = filteredKeys
    .filter(key => !sortOrder.includes(key)) // Exclude keys that are already in orderedColumns
    .map(key => createColumnDef(key, formatMap[key], onRenderUnderRow));

  // Combine orderedColumns with remainingColumns
  const finalColumns = [...orderedColumns, ...remainingColumns];

  // Step 4: Sort data by the first column in ascending order
  if (finalColumns.length > 0) {
    const firstColumnKey = finalColumns[0].accessorKey;

    data.sort((a, b) => {
      if (a[firstColumnKey] < b[firstColumnKey]) return -1;
      if (a[firstColumnKey] > b[firstColumnKey]) return 1;
      return 0;
    });
  }

  return finalColumns;
};

export default handleSettings
